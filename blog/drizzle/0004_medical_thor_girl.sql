DROP INDEX "blog_reactions_unique_post";--> statement-breakpoint
DROP INDEX "blog_reactions_unique_comment";--> statement-breakpoint
ALTER TABLE "blog_reactions" ALTER COLUMN "post_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_reactions_unique_post" ON "blog_reactions" USING btree ("post_id","user_id") WHERE "blog_reactions"."post_id" is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_reactions_unique_comment" ON "blog_reactions" USING btree ("comment_id","user_id") WHERE "blog_reactions"."comment_id" is not null;