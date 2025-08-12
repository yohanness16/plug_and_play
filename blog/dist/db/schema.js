import { pgTable, uuid, text, timestamp, uniqueIndex, pgEnum, primaryKey, jsonb, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
export const userRoleEnum = pgEnum('user_role', ['admin', 'editor', 'writer', 'user']);
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);
export const commentStatusEnum = pgEnum('comment_status', ['pending', 'approved', 'rejected']);
export const reactionTypeEnum = pgEnum('reaction_type', ['like', 'dislike']);
export const sharePlatformEnum = pgEnum('share_platform', ['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy_link']);
export const users = pgTable('users', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    role: userRoleEnum('role').notNull().default('admin'),
    profilePhoto: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    emailUnique: uniqueIndex('users_email_unique').on(table.email),
}));
export const blogCategories = pgTable('blog_categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
}, (table) => ({
    nameUnique: uniqueIndex('blog_categories_name_unique').on(table.name),
    slugUnique: uniqueIndex('blog_categories_slug_unique').on(table.slug),
}));
export const blogPosts = pgTable('blog_posts', {
    id: uuid('id').defaultRandom().primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content').notNull(),
    coverImage: text('cover_image'),
    authorId: uuid('author_id').references(() => users.id),
    status: postStatusEnum('status').notNull().default('draft'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    views: integer('views').default(0),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    slugUnique: uniqueIndex('blog_posts_slug_unique').on(table.slug),
}));
export const blogPostCategories = pgTable('blog_post_categories', {
    postId: uuid('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => blogCategories.id, { onDelete: 'cascade' }),
}, (table) => ({
    pk: primaryKey(table.postId, table.categoryId),
}));
export const postViews = pgTable('post_views', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    ip: text('ip'),
    userAgent: text('user_agent'),
    createdAt: timestamp('created_at').defaultNow(),
});
export const blogComments = pgTable('blog_comments', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    parentId: uuid('parent_id').references(() => blogComments.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    status: commentStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow(),
});
export const blogReactions = pgTable('blog_reactions', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    commentId: uuid('comment_id').references(() => blogComments.id, { onDelete: 'cascade' }),
    type: reactionTypeEnum('type').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    uniqueReactionPost: uniqueIndex('blog_reactions_unique_post')
        .on(table.postId, table.userId)
        .where(sql `${table.postId} is not null`),
    uniqueReactionComment: uniqueIndex('blog_reactions_unique_comment')
        .on(table.commentId, table.userId)
        .where(sql `${table.commentId} is not null`),
}));
export const blogShares = pgTable('blog_shares', {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id').references(() => blogPosts.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    platform: sharePlatformEnum('platform').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
export const settings = pgTable('settings', {
    key: text('key').primaryKey(),
    value: jsonb('value').notNull(),
});
