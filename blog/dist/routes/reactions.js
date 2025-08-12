import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client.js';
import { blogReactions, blogPosts, blogComments } from '../db/schema.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
const reactions = new Hono();
const reactionBody = z.object({
    type: z.enum(['like', 'dislike'])
});
async function getPostCounts(postId) {
    const likes = (await db.select().from(blogReactions).where(and(eq(blogReactions.postId, postId), eq(blogReactions.type, 'like')))).length;
    const dislikes = (await db.select().from(blogReactions).where(and(eq(blogReactions.postId, postId), eq(blogReactions.type, 'dislike')))).length;
    return { likes, dislikes };
}
async function getCommentCounts(commentId) {
    const likes = (await db.select().from(blogReactions).where(and(eq(blogReactions.commentId, commentId), eq(blogReactions.type, 'like')))).length;
    const dislikes = (await db.select().from(blogReactions).where(and(eq(blogReactions.commentId, commentId), eq(blogReactions.type, 'dislike')))).length;
    return { likes, dislikes };
}
reactions.post('/posts/:postId/reactions', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const postId = c.req.param('postId');
    if (!postId)
        return c.json({ error: 'Missing postId param' }, 400);
    const body = await c.req.json();
    const { type } = reactionBody.parse(body);
    const post = await db.select().from(blogPosts).where(eq(blogPosts.id, postId));
    if (!post || post.length === 0)
        return c.json({ error: 'Post not found' }, 404);
    const existing = await db.select().from(blogReactions)
        .where(and(eq(blogReactions.postId, postId), eq(blogReactions.userId, user.id)));
    if (existing && existing.length > 0) {
        const row = existing[0];
        if (row.type === type) {
            await db.delete(blogReactions).where(eq(blogReactions.id, row.id));
        }
        else {
            await db.update(blogReactions).set({ type }).where(eq(blogReactions.id, row.id));
        }
    }
    else {
        await db.insert(blogReactions).values({
            id: randomUUID(),
            postId,
            commentId: null,
            userId: user.id,
            type
        });
    }
    const counts = await getPostCounts(postId);
    return c.json({ ok: true, ...counts });
});
reactions.get('/posts/:postId/reactions', async (c) => {
    let user = null;
    try {
        user = c.get('user');
    }
    catch (e) { }
    const postId = c.req.param('postId');
    if (!postId)
        return c.json({ error: 'Missing postId param' }, 400);
    const counts = await getPostCounts(postId);
    let userReaction = null;
    if (user) {
        const existing = await db.select().from(blogReactions).where(and(eq(blogReactions.postId, postId), eq(blogReactions.userId, user.id)));
        if (existing && existing.length)
            userReaction = existing[0].type;
    }
    return c.json({ ...counts, userReaction });
});
reactions.post('/comments/:commentId/reactions', requireAuth, async (c) => {
    const user = c.get('user');
    if (!user)
        return c.json({ error: 'Unauthorized' }, 401);
    const commentId = c.req.param('commentId');
    if (!commentId)
        return c.json({ error: 'Missing commentId param' }, 400);
    const body = await c.req.json();
    const { type } = reactionBody.parse(body);
    const comment = await db.select().from(blogComments).where(eq(blogComments.id, commentId));
    if (!comment || comment.length === 0)
        return c.json({ error: 'Comment not found' }, 404);
    const postId = comment[0].postId;
    const existing = await db.select().from(blogReactions)
        .where(and(eq(blogReactions.commentId, commentId), eq(blogReactions.userId, user.id)));
    if (existing && existing.length > 0) {
        const row = existing[0];
        if (row.type === type) {
            await db.delete(blogReactions).where(eq(blogReactions.id, row.id));
        }
        else {
            await db.update(blogReactions).set({ type }).where(eq(blogReactions.id, row.id));
        }
    }
    else {
        await db.insert(blogReactions).values({
            id: randomUUID(),
            postId: null,
            commentId,
            userId: user.id,
            type
        });
    }
    const counts = await getCommentCounts(commentId);
    return c.json({ ok: true, ...counts });
});
reactions.get('/comments/:commentId/reactions', async (c) => {
    let user = null;
    try {
        user = c.get('user');
    }
    catch (e) { }
    const commentId = c.req.param('commentId');
    if (!commentId)
        return c.json({ error: 'Missing commentId param' }, 400);
    const counts = await getCommentCounts(commentId);
    let userReaction = null;
    if (user) {
        const existing = await db.select().from(blogReactions)
            .where(and(eq(blogReactions.commentId, commentId), eq(blogReactions.userId, user.id)));
        if (existing && existing.length)
            userReaction = existing[0].type;
    }
    return c.json({ ...counts, userReaction });
});
export default reactions;
