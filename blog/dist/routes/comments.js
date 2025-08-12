import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client.js';
import { blogComments, blogPosts, users } from '../db/schema.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { eq, asc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
const comments = new Hono();
const createCommentSchema = z.object({
    postId: z.string().uuid(),
    content: z.string().min(1),
    parentId: z.string().uuid().optional(),
});
const editCommentSchema = z.object({
    content: z.string().min(1),
});
function buildCommentsTree(rows) {
    const map = new Map();
    const roots = [];
    for (const r of rows) {
        map.set(r.id, { ...r, replies: [] });
    }
    for (const node of map.values()) {
        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId).replies.push(node);
        }
        else {
            roots.push(node);
        }
    }
    return roots;
}
comments.post('/', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const body = await c.req.json();
    const data = createCommentSchema.parse(body);
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, data.postId));
    if (!post || post.length === 0)
        return c.json({ error: 'Post not found' }, 404);
    const id = randomUUID();
    await db.insert(blogComments).values({
        id,
        postId: data.postId,
        userId: user.id,
        parentId: data.parentId ?? null,
        content: data.content,
        createdAt: new Date(),
    });
    return c.json({ message: 'Comment created', id, parentId: data.parentId ?? null }, 201);
});
comments.get('/post/:postId', async (c) => {
    const postId = c.req.param('postId');
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
    if (!post || post.length === 0)
        return c.json({ error: 'Post not found' }, 404);
    const rows = await db
        .select({
        id: blogComments.id,
        postId: blogComments.postId,
        parentId: blogComments.parentId,
        content: blogComments.content,
        createdAt: blogComments.createdAt,
        userId: blogComments.userId,
        authorName: users.name,
        authorAvatar: users.profilePhoto,
    })
        .from(blogComments)
        .leftJoin(users, eq(blogComments.userId, users.id))
        .where(eq(blogComments.postId, postId))
        .orderBy(asc(blogComments.createdAt));
    const total = await db.$count(blogComments, eq(blogComments.postId, postId));
    const tree = buildCommentsTree(rows);
    return c.json({ count: total, comments: tree }, 200);
});
comments.put('/:id', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const id = c.req.param('id');
    const body = await c.req.json();
    const { content } = editCommentSchema.parse(body);
    const rows = await db.select().from(blogComments).where(eq(blogComments.id, id));
    if (!rows || rows.length === 0)
        return c.json({ error: 'Comment not found' }, 404);
    const comment = rows[0];
    if (comment.userId !== user.id) {
        const urows = await db.select().from(users).where(eq(users.id, user.id));
        const me = urows && urows[0];
        if (!me || (me.role !== 'admin' && me.role !== 'editor')) {
            return c.json({ error: 'Forbidden' }, 403);
        }
    }
    await db.update(blogComments).set({ content }).where(eq(blogComments.id, id));
    return c.json({ message: 'Comment updated' }, 200);
});
comments.delete('/:id', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const id = c.req.param('id');
    const rows = await db.select().from(blogComments).where(eq(blogComments.id, id));
    if (!rows || rows.length === 0)
        return c.json({ error: 'Comment not found' }, 404);
    const comment = rows[0];
    if (comment.userId !== user.id) {
        const urows = await db.select().from(users).where(eq(users.id, user.id));
        const me = urows && urows[0];
        if (!me || (me.role !== 'admin' && me.role !== 'editor')) {
            return c.json({ error: 'Forbidden' }, 403);
        }
    }
    await db.delete(blogComments).where(eq(blogComments.id, id));
    c.status(204);
    return c.text('');
});
export default comments;
