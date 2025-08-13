Blog API (Hono + Bun/Node + Drizzle + Supabase)
A fully functional blog API built with Hono, Drizzle ORM, Supabase, and PostgreSQL. Compatible with both Node.js and Bun. Supports posts, categories, comments, reactions, and sharing functionality.

Table of Contents

Requirements
Installation
Environment Variables
Database Setup & Migrations
Scripts
Running the Server
API Endpoints
Frontend Integration


Requirements

Node.js >= 20 or Bun >= 1.x
PostgreSQL (via Supabase or local instance)
Package manager: npm, yarn, pnpm, or bun
npx for Drizzle CLI


Installation

Clone the repository:
git clone <your-repo-url>
cd <your-repo-folder>


Install dependencies:
For Node.js (using npm, yarn, or pnpm):
npm install
# or
yarn install
# or
pnpm install

For Bun:
bun install




Environment Variables
Create a .env file in the project root with the following:
# PostgreSQL database connection
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?pgbouncer=true

# Supabase configuration
SUPABASE_URL=https://<your-supabase-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional: App URL for sharing links
APP_URL=http://localhost:3000


Note: Do not commit your .env file to version control. Add it to .gitignore.


Database Setup & Migrations

Generate migration files using Drizzle CLI:
npx drizzle-kit generate


Apply migrations to create the database schema:
npx drizzle-kit migrate



This will create the following tables:

blog_posts
blog_categories
blog_post_categories
blog_comments
blog_reactions
blog_shares
users (managed via Supabase)


Scripts



Command
Description



bun run --watch src/app.ts
Run development server with Bun (hot reload)


npm run dev:node
Run development server with Node/tsx (watch mode)


npm run build
Build production files with TypeScript compiler


npm start
Start production server (Node)



Running the Server
Using Bun
bun run --watch src/app.ts

Using Node.js

Build the project:
npm run build


Start the production server:
npm start


For development with watch mode:
npm run dev:node




API Endpoints
Authentication
Authentication is handled via Supabase JWT. Include Authorization: Bearer <token> in headers for protected routes.



Method
Endpoint
Description



POST
/auth/signup
Register a new user


POST
/auth/login
Log in a user


GET
/auth/me
Get authenticated user


Posts



Method
Endpoint
Description



POST
/posts
Create a post (Admin/Author)


GET
/posts?page=1&limit=10&q=search&status=published&authorId=<uuid>&categoryId=<uuid>
List posts with filters


GET
/posts/:slug
Get a single post by slug


PUT
/posts/:id
Update a post (Admin/Author)


DELETE
/posts/:id?hard=true
Delete a post (soft or hard)


Create/Update Post Body Example:
{
  "title": "My First Post",
  "content": "This is the content of the post.",
  "slug": "optional-slug",
  "coverImage": "https://example.com/image.jpg",
  "categories": ["category-uuid-1", "category-uuid-2"],
  "status": "draft"
}


Note: hard=true in DELETE requests performs a permanent delete (admin only). By default, posts are soft-deleted (archived).

Categories



Method
Endpoint
Description



GET
/categories
List all categories


POST
/categories
Create a category (Admin)


PUT
/categories/:id
Update a category (Admin)


DELETE
/categories/:id
Delete a category (Admin)


Comments



Method
Endpoint
Description



POST
/comments
Create a comment


GET
/comments?postId=<postId>
List comments for a post


PUT
/comments/:id
Update a comment


DELETE
/comments/:id
Delete a comment


Reactions



Method
Endpoint
Description



POST
/posts/:postId/reactions
Add reaction to a post


POST
/comments/:commentId/reactions
Add reaction to a comment


GET
/posts/:postId/reactions
Get reactions for a post


GET
/comments/:commentId/reactions
Get reactions for a comment


Reaction Body Example:
{
  "type": "like"
}
