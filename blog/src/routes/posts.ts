
import { Hono } from 'hono'
import { z } from 'zod'
import { db } from '../db/client' 
import {
  blogPosts,
  blogPostCategories,
  blogCategories,
  users,
  postViews, 
} from '../db/schema';
import { requireAuth } from '../middleware/requireAuth'
import { eq, sql, and, desc, inArray } from 'drizzle-orm';
import { randomUUID } from 'crypto'
import { slugify } from '../utils/slugify'
import type { HonoVariables } from '../utils/types'; 



const posts = new Hono<{ Variables: HonoVariables }>()

async function makeUniqueSlug(baseSlug: string, excludeId?: string) {
  let unique = baseSlug.toLowerCase();
  let counter = 1;
  while (true) {
    const existing = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.slug, unique),
          excludeId ? sql`(${blogPosts.id} <> ${excludeId})` : undefined
        )
      );
    if (!existing || existing.length === 0) break;
    unique = `${baseSlug}-${counter++}`;
  }
  return unique;
}


const createPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  slug: z.string().optional(),
  coverImage: z.string().url().optional(),
  categories: z.array(z.string().uuid()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
})

posts.post('/', requireAuth, async (c) => {
  
  const user = c.get('user')
  if (!user) return c.json({ error: 'Unauthorized' }, 401)

  
  const body = await c.req.json()
  const data = createPostSchema.parse(body)

 
  const baseSlug = (data.slug ?? slugify(data.title)).toLowerCase()
  let uniqueSlug = baseSlug
  let counter = 1


  while (true) {
    const existing = await db.select().from(blogPosts).where(eq(blogPosts.slug, uniqueSlug))
    if (!existing || existing.length === 0) break
    uniqueSlug = `${baseSlug}-${counter++}`
  }

  
  const postId = randomUUID()

  await db.insert(blogPosts).values({
    id: postId,
    title: data.title,
    slug: uniqueSlug,
    content: data.content,
    coverImage: data.coverImage ?? null,
    authorId: user.id,
    status: data.status,
    publishedAt: data.status === 'published' ? new Date() : null,
  })

  
  if (data.categories && data.categories.length) {
    const mappings = data.categories.map((categoryId) => ({
      postId,
      categoryId,
    }))
    await db.insert(blogPostCategories).values(mappings)
  }

  
  return c.json({ message: 'Post created', id: postId, slug: uniqueSlug }, 201)
})

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  q: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  authorId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

posts.get('/', async (c) => {
  const raw = {
    page: c.req.query('page'),
    limit: c.req.query('limit'),
    q: c.req.query('q'),
    status: c.req.query('status'),
    authorId: c.req.query('authorId'),
    categoryId: c.req.query('categoryId'),
  };
  const q = listQuerySchema.parse(raw);
  const offset = (q.page - 1) * q.limit;

  const filters = [];
  if (q.q) {
    const term = `%${q.q.toLowerCase()}%`;
    filters.push(sql`(lower(${blogPosts.title}) LIKE ${term} OR lower(${blogPosts.content}) LIKE ${term})`);
  }
  if (q.status) filters.push(eq(blogPosts.status, q.status));
  if (q.authorId) filters.push(eq(blogPosts.authorId, q.authorId));
  if (q.categoryId) {
  

    const sub = db.select({ pid: blogPostCategories.postId })
                  .from(blogPostCategories)
                  .where(eq(blogPostCategories.categoryId, q.categoryId));
    filters.push(inArray(blogPosts.id, sub));
  }

  const rows = await db
    .select({
      id: blogPosts.id,
      title: blogPosts.title,
      slug: blogPosts.slug,
      excerpt: sql`substring(${blogPosts.content} FROM 1 FOR 300)`.as('excerpt'),
      coverImage: blogPosts.coverImage,
      authorId: blogPosts.authorId,
      authorName: users.name,
      status: blogPosts.status,
      publishedAt: blogPosts.publishedAt,
      views: blogPosts.views,
    })
    .from(blogPosts)
    .leftJoin(users, eq(blogPosts.authorId, users.id))
    .where(filters.length ? and(...filters) : undefined)
    .orderBy(desc(blogPosts.publishedAt))
    .limit(q.limit)
    .offset(offset);

  return c.json({ data: rows, page: q.page, limit: q.limit });
});


posts.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  
  const result = await db.transaction(async (tx) => {

    await tx
      .update(blogPosts)
      .set({ views: sql`${blogPosts.views} + 1` })
      .where(eq(blogPosts.slug, slug));


    const [post] = await tx
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        content: blogPosts.content,
        coverImage: blogPosts.coverImage,
        authorId: blogPosts.authorId,
        authorName: users.name,
        status: blogPosts.status,
        publishedAt: blogPosts.publishedAt,
        createdAt: blogPosts.createdAt,
        updatedAt: blogPosts.updatedAt,
        views: blogPosts.views,
      })
      .from(blogPosts)
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.slug, slug));

    return post;
  });

  if (!result) return c.json({ error: 'Not found' }, 404);

  
  const user = c.get('user');
  if (result.status !== 'published') {
    if (!user || (user.id !== result.authorId && user.role !== 'admin')) {
      return c.json({ error: 'Not found' }, 404);
    }
  }

  return c.json(result);
});


const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  slug: z.string().optional(),
  coverImage: z.string().url().optional(),
  categories: z.array(z.string().uuid()).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
});

posts.put('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const postId = c.req.param('id');
  const body = await c.req.json();
  const data = updatePostSchema.parse(body);


  const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!existing) return c.json({ error: 'Not found' }, 404);
  if (existing.authorId !== user.id && !['admin','editor'].includes(user.role)) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  
  let finalSlug = existing.slug;
  if (data.slug) finalSlug = (data.slug || '').toLowerCase();
  if (data.title && !data.slug) finalSlug = slugify(data.title).toLowerCase();
  if (finalSlug !== existing.slug) {
    finalSlug = await makeUniqueSlug(finalSlug, postId);
  }

 
  await db.transaction(async (tx) => {
    await tx.update(blogPosts).set({
      title: data.title ?? existing.title,
      slug: finalSlug,
      content: data.content ?? existing.content,
      coverImage: data.coverImage ?? existing.coverImage,
      status: data.status ?? existing.status,
      publishedAt: data.status === 'published' && !existing.publishedAt ? new Date() : existing.publishedAt,
      updatedAt: new Date(),
    }).where(eq(blogPosts.id, postId));

    if (data.categories) {
      
      await tx.delete(blogPostCategories).where(eq(blogPostCategories.postId, postId));
      if (data.categories.length) {
        const mappings = data.categories.map((categoryId: string) => ({ postId, categoryId }));
        await tx.insert(blogPostCategories).values(mappings);
      }
    }
  });

  return c.json({ message: 'Post updated', id: postId });
});


posts.delete('/:id', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const postId = c.req.param('id');
  const hard = c.req.query('hard') === 'true';

  const [existing] = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
  if (!existing) return c.json({ error: 'Not found' }, 404);

  if (existing.authorId !== user.id && !['admin','editor'].includes(user.role)) {
    return c.json({ error: 'Forbidden' }, 403);
  }

  if (hard) {
    if (user.role !== 'admin') return c.json({ error: 'Admin only for hard delete' }, 403);
    
    const deleted = await db.delete(blogPosts).where(eq(blogPosts.id, postId)).returning();
    return c.json({ message: 'Post hard deleted', deleted });
  } else {
  
    await db.update(blogPosts).set({ status: 'archived', updatedAt: new Date() }).where(eq(blogPosts.id, postId));
    return c.json({ message: 'Post archived (soft deleted)' });
  }
});

export default posts
