import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client.js';
import { blogPosts, blogShares } from '../db/schema.js';
import { createClient } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';
const share = new Hono();
const createShareSchema = z.object({
    platform: z.enum(['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy_link']),
});
async function getOptionalUserFromAuthHeader(authHeader) {
    if (!authHeader)
        return null;
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer')
        return null;
    const token = parts[1];
    const supabaseServer = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabaseServer.auth.getUser(token);
    if (error || !data?.user)
        return null;
    return data.user;
}
share.post('/:id/share', async (c) => {
    try {
        const postIdOrSlug = c.req.param('id');
        const body = await c.req.json();
        const data = createShareSchema.parse(body);
        let found = await db.select().from(blogPosts).where(eq(blogPosts.id, postIdOrSlug));
        if (!found || found.length === 0) {
            found = await db.select().from(blogPosts).where(eq(blogPosts.slug, postIdOrSlug));
            if (!found || found.length === 0) {
                return c.json({ error: 'Post not found' }, 404);
            }
        }
        const post = found[0];
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
        const perPlatform = shares.reduce((acc, s) => {
            acc[s.platform] = (acc[s.platform] || 0) + 1;
            return acc;
        }, {});
        const publicUrl = `${process.env.APP_URL.replace(/\/$/, '')}/posts/${post.slug}`;
        return c.json({
            message: 'Share recorded',
            url: publicUrl,
            totals: { total, perPlatform },
        }, 201);
    }
    catch (err) {
        console.error(err);
        return c.json({ error: 'Invalid data' }, 400);
    }
});
share.get('/:id/shares', async (c) => {
    const postIdOrSlug = c.req.param('id');
    let found = await db.select().from(blogPosts).where(eq(blogPosts.id, postIdOrSlug));
    if (!found || found.length === 0) {
        found = await db.select().from(blogPosts).where(eq(blogPosts.slug, postIdOrSlug));
        if (!found || found.length === 0) {
            return c.json({ error: 'Post not found' }, 404);
        }
    }
    const post = found[0];
    const shares = await db.select().from(blogShares).where(eq(blogShares.postId, post.id));
    const total = shares.length;
    const perPlatform = shares.reduce((acc, s) => {
        acc[s.platform] = (acc[s.platform] || 0) + 1;
        return acc;
    }, {});
    return c.json({ totals: { total, perPlatform } });
});
export default share;
