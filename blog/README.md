# Blog API (Hono + Bun/Node + Drizzle + Supabase)

A fully functional blog API using **Hono**, **Drizzle ORM**, **Supabase**, and **PostgreSQL**, compatible with both **Node** and **Bun**. Includes posts, categories, comments, reactions, and sharing functionality.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup & Migrations](#database-setup--migrations)
- [Scripts](#scripts)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Frontend Integration](#frontend-integration)

---

## Requirements

- Node.js >= 20 or Bun >= 1.x
- PostgreSQL (Supabase or local)
- npm or bun
- `npx` for Drizzle CLI

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo-folder>

Install dependencies:

Node (npm/yarn/pnpm):


npm install
# or
yarn
# or
pnpm install
# or 
bun install

Environment Variables
Create a .env file in the root of the project:
 
# PostgreSQL database connection
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?pgbouncer=true

# Supabase configuration
SUPABASE_URL=https://<your-supabase-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional: App URL for sharing links
APP_URL=http://localhost:3000

Do not commit your .env file to source control.

Database Setup & Migrations
Generate migration files using Drizzle CLI:

bash
Copy
Edit
npx drizzle-kit generate
Run migrations:

bash
Copy
Edit
npx drizzle-kit migrate
This will create all tables for:

blog_posts

blog_categories

blog_post_categories

blog_comments

blog_reactions

blog_shares

users (managed via Supabase)

Scripts
Command	Description
bun run --watch src/app.ts	Run development server with Bun (hot reload)
npm run dev:node	Run development server with Node/tsx (watch dist/app.js)
npm run build	Build production files with tsc
npm start	Start production server (Node)

Running the Server
Bun:

bash
Copy
Edit
bun run --watch src/app.ts
Node:

Build:

bash
Copy
Edit
npm run build
Run:

bash
Copy
Edit
npm start
Dev watch mode (Node):

bash
Copy
Edit
npm run dev:node
API Endpoints
Auth
bash
Copy
Edit
POST /auth/signup
POST /auth/login
GET /auth/me
Auth handled via Supabase JWT. Include Authorization: Bearer <token> in headers for protected routes.

Posts
Create Post (Admin/Author)
POST /posts

Body example:

json
Copy
Edit
{
  "title": "My First Post",
  "content": "This is the content of the post.",
  "slug": "optional-slug",
  "coverImage": "https://example.com/image.jpg",
  "categories": ["category-uuid-1", "category-uuid-2"],
  "status": "draft"
}
List Posts
GET /posts?page=1&limit=10&q=search&status=published&authorId=<uuid>&categoryId=<uuid>

Get Single Post
GET /posts/:slug

Update Post
PUT /posts/:id
Body is same as create but optional fields.

Delete Post
DELETE /posts/:id?hard=true
hard=true → permanent delete (admin only)
Default → soft delete (archived)

Categories
GET /catagories
POST /catagories (admin)
PUT /catagories/:id (admin)
DELETE /catagories/:id (admin)

Comments
POST /comments
GET /comments?postId=<postId>
PUT /comments/:id
DELETE /comments/:id

Reactions
Post Reaction
POST /posts/:postId/reactions
Body: { "type": "like" | "dislike" }

Comment Reaction
POST /comments/:commentId/reactions
Body: { "type": "like" | "dislike" }

Get Reactions
GET /posts/:postId/reactions
GET /comments/:commentId/reactions

Share
Create Share
POST /share/:id/share
Body:

json
Copy
Edit
{
  "platform": "facebook" | "twitter" | "linkedin" | "whatsapp" | "copy_link"
}
Get Share Counts
GET /share/:id/shares

Frontend Integration
Include Authorization Header for authenticated routes:

js
Copy
Edit
fetch('/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify(postData)
});
Fetch posts:

js
Copy
Edit
const res = await fetch('/posts?page=1&limit=10');
const data = await res.json();
Reactions & Shares:

js
Copy
Edit
// Reaction
await fetch(`/posts/${postId}/reactions`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'like' })
});

// Share
await fetch(`/share/${postId}/share`, {
  method: 'POST',
  body: JSON.stringify({ platform: 'twitter' })
});
Notes
Slugs are automatically generated from titles if not provided.

Soft deletes archive posts (status: archived) instead of removing them.

views are automatically incremented on post fetch.

Categories, reactions, comments, and shares are relational and handled via drizzle-orm.

✅ You're ready to go!
Clone, set your .env, run migrations, and start the server. Your full-featured blog API is now ready for integration.

Copy
Edit






