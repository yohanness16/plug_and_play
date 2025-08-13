import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client.js';
import { blogPosts, blogShares } from '../db/schema.js';
import { createClient, User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { validate as isUuid } from 'uuid';

const share = new Hono();

const createShareSchema = z.object({
  platform: z.enum(['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy_link']),
});


async function getOptionalUserFromAuthHeader(authHeader?: string | null): Promise<User | null> {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  const token = parts[1];

  const supabaseServer = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseServer.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}


async function findPost(postIdOrSlug: string) {
  let found = [];
  if (isUuid(postIdOrSlug)) {
    found = await db.select().from(blogPosts).where(eq(blogPosts.id, postIdOrSlug));
  }
  if (!found || found.length === 0) {
    found = await db.select().from(blogPosts).where(eq(blogPosts.slug, postIdOrSlug));
  }
  return found && found.length > 0 ? found[0] : null;
}


function getShareUrl(platform: string, postUrl: string, postTitle: string): string {
  switch (platform) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
    case 'twitter':
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    case 'whatsapp':
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`;
    case 'copy_link':
      return postUrl;
    default:
      return postUrl;
  }
}


share.post('/:id/share', async (c) => {
  try {
    const postIdOrSlug = c.req.param('id');
    const body = await c.req.json();
    const data = createShareSchema.parse(body);

    const post = await findPost(postIdOrSlug);
    if (!post) return c.json({ error: 'Post not found' }, 404);

    const authHeader = c.req.header('authorization');
    const user = await getOptionalUserFromAuthHeader(authHeader);

    await db.insert(blogShares).values({
      id: randomUUID(),
      postId: post.id,
      userId: user ? user.id : null,
      platform: data.platform,
      createdAt: new Date(),
    });

    const shares = await db.select().from(blogShares).where(eq(blogShares.postId, post.id));
    const total = shares.length;
    const perPlatform: Record<string, number> = shares.reduce((acc, s) => {
      acc[s.platform] = (acc[s.platform] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const appUrl = process.env.APP_URL ? process.env.APP_URL.replace(/\/$/, '') : 'http://localhost:3000';
    const publicUrl = `${appUrl}/posts/${post.slug}`;
    const shareLink = getShareUrl(data.platform, publicUrl, post.title);

    return c.json({
      message: 'Share recorded',
      url: publicUrl,
      shareLink,
      totals: { total, perPlatform },
    }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: 'Invalid data' }, 400);
  }
});


share.get('/:id/shares', async (c) => {
  const postIdOrSlug = c.req.param('id');
  const post = await findPost(postIdOrSlug);
  if (!post) return c.json({ error: 'Post not found' }, 404);

  const shares = await db.select().from(blogShares).where(eq(blogShares.postId, post.id));
  const total = shares.length;
  const perPlatform: Record<string, number> = shares.reduce((acc, s) => {
    acc[s.platform] = (acc[s.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return c.json({ totals: { total, perPlatform } });
});

export default share;
