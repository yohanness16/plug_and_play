import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client.js';
import { blogCategories, blogPosts, blogPostCategories, users } from '../db/schema.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { eq, sql, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { slugify } from '../utils/slugify.js';
const categories = new Hono();
async function makeUniqueSlug(baseSlug, excludeId) {
    let unique = baseSlug.toLowerCase();
    let counter = 1;
    while (true) {
        const existing = await db
            .select()
            .from(blogCategories)
            .where(excludeId
            ? sql `${blogCategories.slug} = ${unique} AND ${blogCategories.id} <> ${excludeId}`
            : eq(blogCategories.slug, unique));
        if (!existing || existing.length === 0)
            break;
        unique = `${baseSlug}-${counter++}`;
    }
    return unique;
}
const createCategorySchema = z.object({
    name: z.string().min(1),
    slug: z.string().optional(),
});
const updateCategorySchema = z.object({
    name: z.string().min(1).optional(),
    slug: z.string().optional(),
});
categories.get('/', async (c) => {
    const rows = await db
        .select({
        id: blogCategories.id,
        name: blogCategories.name,
        slug: blogCategories.slug,
        postCount: sql `COUNT(${blogPostCategories.postId})`.as('post_count'),
    })
        .from(blogCategories)
        .leftJoin(blogPostCategories, eq(blogCategories.id, blogPostCategories.categoryId))
        .groupBy(blogCategories.id)
        .orderBy(blogCategories.name);
    return c.json({ data: rows });
});
categories.get('/:slug', async (c) => {
    const slug = c.req.param('slug');
    const [category] = await db
        .select()
        .from(blogCategories)
        .where(eq(blogCategories.slug, slug));
    if (!category)
        return c.json({ error: 'Not found' }, 404);
    const posts = await db
        .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        coverImage: blogPosts.coverImage,
        authorName: users.name,
        publishedAt: blogPosts.publishedAt,
    })
        .from(blogPosts)
        .innerJoin(blogPostCategories, eq(blogPosts.id, blogPostCategories.postId))
        .leftJoin(users, eq(blogPosts.authorId, users.id))
        .where(eq(blogPostCategories.categoryId, category.id))
        .orderBy(desc(blogPosts.publishedAt));
    return c.json({ category, posts });
});
categories.post('/', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user) {
        return c.json({ error: 'Forbidden' }, 403);
    }
    const body = await c.req.json();
    const data = createCategorySchema.parse(body);
    const baseSlug = (data.slug ?? slugify(data.name)).toLowerCase();
    const uniqueSlug = await makeUniqueSlug(baseSlug);
    const id = randomUUID();
    await db.insert(blogCategories).values({
        id,
        name: data.name,
        slug: uniqueSlug,
    });
    return c.json({ message: 'Category created', id, slug: uniqueSlug }, 201);
});
categories.put('/:id', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user || !['admin', 'editor'].includes(user.role)) {
        return c.json({ error: 'Forbidden' }, 403);
    }
    const id = c.req.param('id');
    const body = await c.req.json();
    const data = updateCategorySchema.parse(body);
    const [existing] = await db.select().from(blogCategories).where(eq(blogCategories.id, id));
    if (!existing)
        return c.json({ error: 'Not found' }, 404);
    let finalSlug = existing.slug;
    if (data.slug)
        finalSlug = data.slug.toLowerCase();
    if (data.name && !data.slug)
        finalSlug = slugify(data.name).toLowerCase();
    if (finalSlug !== existing.slug) {
        finalSlug = await makeUniqueSlug(finalSlug, id);
    }
    await db.update(blogCategories)
        .set({
        name: data.name ?? existing.name,
        slug: finalSlug,
    })
        .where(eq(blogCategories.id, id));
    return c.json({ message: 'Category updated', id });
});
categories.delete('/:id', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user || !['admin', 'editor'].includes(user.role)) {
        return c.json({ error: 'Forbidden' }, 403);
    }
    const id = c.req.param('id');
    const deleted = await db.delete(blogCategories).where(eq(blogCategories.id, id)).returning();
    if (!deleted.length)
        return c.json({ error: 'Not found' }, 404);
    return c.json({ message: 'Category deleted', deleted });
});
export default categories;
