DROP INDEX "blog_reactions_unique";--> statement-breakpoint
ALTER TABLE "blog_reactions" ADD COLUMN "comment_id" uuid;--> statement-breakpoint
ALTER TABLE "blog_reactions" ADD CONSTRAINT "blog_reactions_comment_id_blog_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."blog_comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "blog_reactions_unique_post" ON "blog_reactions" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_reactions_unique_comment" ON "blog_reactions" USING btree ("comment_id","user_id");