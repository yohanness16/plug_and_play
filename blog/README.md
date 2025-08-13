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
- [Notes](#notes)  

---

## Requirements

- Node.js >= 20 or Bun >= 1.x  
- PostgreSQL (Supabase or local)  
- npm, yarn, pnpm, or Bun  
- `npx` for Drizzle CLI  

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <your-repo-folder>

```
### 2.Install dependencies:

```bash
# Node (npm/yarn/pnpm)
npm install
# or
yarn
# or
pnpm install
# Bun
bun install

```
Environment Variables
Create a .env file in the root:

```bash
# PostgreSQL database connection
DATABASE_URL=postgresql://<DB_USER>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>?pgbouncer=true

# Supabase configuration
SUPABASE_URL=https://<your-supabase-project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional: App URL for sharing links
APP_URL=http://localhost:3000

``` 
Database Setup & Migrations
## 1.Generate migration files:
```bash
npx drizzle-kit generate
```
## 2.Run migrations:
```bash
npx drizzle-kit migrate
```

This project will create the following tables:

- `blog_posts`
- `blog_categories`
- `blog_post_categories`
- `blog_comments`
- `blog_reactions`
- `blog_shares`
- `users` (managed via Supabase)

## Scripts

| Command                     | Description                                          |
|-----------------------------|------------------------------------------------------|
| `bun run --watch src/app.ts` | Run development server with Bun (hot reload)       |
| `npm run dev:node`           | Run development server with Node/tsx (watch dist/app.js) |
| `npm run build`              | Build production files with TypeScript (`tsc`)     |
| `npm start`                  | Start production server (Node)                     |



## Running the Server

### Using Bun
To run the development server with hot reload using Bun:

```bash
bun run --watch src/app.ts

```
Using Node
1. Build the project:

```bash
npm run build

```
2. Run the production server:
 ```bash
 npm start

```
3. Run the development server with watch mode:
```bash
npm run dev:node

```
## API Endpoints

### Auth (via Supabase JWT)

| Method | Endpoint       | Description                       |
|--------|----------------|-----------------------------------|
| POST   | `/auth/signup` | Sign up a new user                |
| POST   | `/auth/login`  | Log in an existing user           |
| GET    | `/auth/me`     | Get the current authenticated user|

> **Note:** Include `Authorization: Bearer <token>` in headers for protected routes.

Posts
Create Post (Admin/Author)

```bash
POST /posts

```
Body Example:
```bash
{
  "title": "My First Post",
  "content": "This is the content of the post.",
  "slug": "optional-slug",
  "coverImage": "https://example.com/image.jpg",
  "categories": ["category-uuid-1", "category-uuid-2"],
  "status": "draft"
}

```
## Other Post Routes

| Method | Endpoint                                                                                     | Description                              |
|--------|---------------------------------------------------------------------------------------------|------------------------------------------|
| GET    | `/posts?page=1&limit=10&q=search&status=published&authorId=<uuid>&categoryId=<uuid>`       | List posts with optional filters         |
| GET    | `/posts/:slug`                                                                               | Get a single post by slug                |
| PUT    | `/posts/:id`                                                                                 | Update a post by ID                       |
| DELETE | `/posts/:id?hard=true`                                                                       | Delete a post (soft delete by default; `hard=true` for permanent) |

## Categories

| Method | Endpoint                | Description               |
|--------|------------------------|---------------------------|
| GET    | `/catagories`           | List all categories       |
| POST   | `/catagories`           | Create a category (admin) |
| PUT    | `/catagories/:id`       | Update a category (admin) |
| DELETE | `/catagories/:id`       | Delete a category (admin) |

## Comments

| Method | Endpoint                      | Description                     |
|--------|--------------------------------|---------------------------------|
| POST   | `/comments`                    | Create a comment                |
| GET    | `/comments?postId=<postId>`   | List comments for a post        |
| PUT    | `/comments/:id`               | Update a comment                |
| DELETE | `/comments/:id`               | Delete a comment                |

## Reactions

**Post Reaction:**  
```http
POST /posts/:postId/reactions
Body: { "type": "like" | "dislike" }
```
**Comment Reaction**
```http
POST /comments/:commentId/reactions
Body: { "type": "like" | "dislike" }
```
**Get reaction**
``http
GET /posts/:postId/reactions
GET /comments/:commentId/reactions
```
## Share API

### Create a Share

**Endpoint:** `POST /share/:id/share`  

**Description:** Create a new share for a specific post or item by its ID.

**URL Parameters:**

| Parameter | Type   | Description               |
|-----------|--------|---------------------------|
| `id`      | string | The ID of the post/item to share |

**Request Body:**  
```json
{
  "platform": "facebook" | "twitter" | "linkedin" | "whatsapp" | "copy_link"
}
```

## Frontend Integration
Authorization Header Example:
```js
fetch('/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify(postData)
});
```

fetche posts:
```js
const res = await fetch('/posts?page=1&limit=10');
const data = await res.json();
```
Reaction and shares:
```js
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
```

## Notes

- Slugs are automatically generated from titles if not provided.
- Soft deletes archive posts (`status: archived`) instead of removing them.
- Views are automatically incremented on post fetch.
- Categories, reactions, comments, and shares are relational and handled via Drizzle ORM.

✅ Clone, set your `.env`, run migrations, and start the server. Your full-featured blog API is ready for integration.







