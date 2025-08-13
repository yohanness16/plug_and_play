# Zemenay Tech Solutions - Blog System

This repository contains a complete blog system with a backend API and a plug-and-play frontend.

## Project Structure

```
plug_and_play/
├── blog/           # Backend API (Hono + Supabase + PostgreSQL)
├── frontend/       # Next.js Frontend (Plug-and-Play)
├── Assets/         # Brand assets and logos
└── README.md       # This file
```

## Quick Start

### Backend Setup
The backend is located in the `blog/` directory and provides the API for the blog system.

```bash
cd blog
npm install
# Configure environment variables
npm run dev
```

### Frontend Setup
The frontend is a plug-and-play Next.js application located in the `frontend/` directory.

```bash
cd frontend
npm install
# Configure environment variables
npm run dev
```

## Documentation

- **Backend Documentation**: See `blog/README.md` for backend setup and API documentation
- **Frontend Documentation**: See `frontend/README.md` for frontend setup and integration guide
- **Integration Guide**: See `frontend/INTEGRATION_GUIDE.md` for detailed integration instructions

## Features

### Backend (blog/)
- RESTful API built with Hono
- Authentication with Supabase
- PostgreSQL database with Drizzle ORM
- Blog posts, categories, comments, reactions, and sharing
- Admin functionality

### Frontend (frontend/)
- Next.js 14 with App Router
- TypeScript and Tailwind CSS
- Responsive design
- Authentication integration
- Complete blog functionality
- Admin dashboard
- Plug-and-play architecture

## Technology Stack

### Backend
- **Framework**: Hono
- **Database**: PostgreSQL via Supabase
- **ORM**: Drizzle
- **Authentication**: Supabase Auth
- **Runtime**: Node.js/Bun

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Lucide React icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast

## Getting Started

1. **Clone the repository**
2. **Set up the backend** (see `blog/README.md`)
3. **Set up the frontend** (see `frontend/README.md`)
4. **Configure environment variables**
5. **Start both services**

## Support

For questions or issues:
- Backend issues: Check `blog/README.md`
- Frontend issues: Check `frontend/README.md`
- Integration issues: Check `frontend/INTEGRATION_GUIDE.md`

## License

This project is owned by Zemenay Tech Solutions.
