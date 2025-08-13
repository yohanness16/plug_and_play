# Zemenay Blog - Plug and Play Blog System

A modern, feature-rich blog system built with Next.js that integrates seamlessly with any existing website. This plug-and-play solution provides a complete blog experience with authentication, content management, comments, reactions, and social sharing.

## 🚀 Features

### Core Blog Features
- **Rich Content Management**: Create, edit, and manage blog posts with markdown support
- **Category System**: Organize content with customizable categories
- **User Authentication**: Secure login/signup with Supabase integration
- **Role-Based Access**: Admin, editor, writer, and user roles with appropriate permissions
- **SEO Optimized**: Clean URLs, meta tags, and structured data

### Interactive Features
- **Comments System**: Nested comments with moderation capabilities
- **Reactions**: Like/dislike posts and comments
- **Social Sharing**: Share posts on Facebook, Twitter, LinkedIn, and WhatsApp
- **View Tracking**: Automatic view counting for posts

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient content loading with pagination
- **Real-time Updates**: Instant feedback for user interactions

### Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Modular Architecture**: Clean, maintainable code structure
- **API Integration**: RESTful API client for backend communication
- **Error Handling**: Comprehensive error handling and user feedback
- **Performance Optimized**: Fast loading with Next.js optimizations

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Form handling and validation
- **React Hot Toast**: User notifications

### Backend Integration
- **RESTful API**: Communicates with your existing backend
- **Supabase**: Authentication and database (PostgreSQL)
- **Hono**: Fast web framework for the backend
- **Drizzle ORM**: Type-safe database operations

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Access to your backend API (running on port 3001 by default)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zemenay-blog-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `http://localhost:3001` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes | - |

### Customization

#### Branding
- Replace logo images in `public/assets/`
- Update colors in `tailwind.config.js`
- Modify company information in components

#### Styling
- Customize colors in `tailwind.config.js`
- Update global styles in `app/globals.css`
- Modify component styles as needed

#### Features
- Enable/disable features by modifying components
- Customize user roles and permissions
- Adjust pagination settings

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── posts/             # Blog posts pages
│   ├── categories/        # Category pages
│   ├── login/             # Authentication pages
│   └── signup/
├── components/            # Reusable components
│   ├── blog/             # Blog-specific components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── ui/               # UI components
├── lib/                  # Utilities and API client
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── public/               # Static assets
│   └── assets/          # Images and logos
└── package.json         # Dependencies and scripts
```

## 🔌 API Integration

The frontend communicates with your backend through a RESTful API. The API client (`lib/api.ts`) handles all communication and provides type-safe methods for:

- **Authentication**: Login, signup, password reset
- **Posts**: CRUD operations, search, filtering
- **Categories**: Management and listing
- **Comments**: Create, edit, delete, nested replies
- **Reactions**: Like/dislike posts and comments
- **Shares**: Social media sharing

### API Endpoints

The system expects these endpoints from your backend:

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `GET /posts` - List posts with filtering
- `GET /posts/:slug` - Get single post
- `POST /posts` - Create post (authenticated)
- `PUT /posts/:id` - Update post (authenticated)
- `DELETE /posts/:id` - Delete post (authenticated)
- `GET /catagories` - List categories
- `GET /comments/post/:postId` - Get post comments
- `POST /comments` - Create comment (authenticated)
- `POST /posts/:postId/reactions` - React to post (authenticated)
- `POST /share/:id/share` - Share post

## 🎨 Customization Guide

### Adding New Features

1. **Create new components** in the appropriate directory
2. **Add API methods** in `lib/api.ts`
3. **Update types** as needed
4. **Add routes** in the app directory

### Styling Customization

1. **Colors**: Update the primary color palette in `tailwind.config.js`
2. **Typography**: Modify font families and sizes
3. **Components**: Customize component styles in their respective files
4. **Layout**: Adjust spacing and layout in layout components

### Branding

1. **Logo**: Replace images in `public/assets/`
2. **Company Info**: Update in header and footer components
3. **Colors**: Match your brand colors in the configuration

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic builds

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use the Next.js build command
- **AWS Amplify**: Connect your repository
- **Docker**: Use the provided Dockerfile
- **Self-hosted**: Build and serve the static files

### Environment Setup

Ensure all environment variables are set in your production environment:

```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🔒 Security

- **Authentication**: Secure token-based authentication
- **Authorization**: Role-based access control
- **Input Validation**: Client and server-side validation
- **XSS Protection**: Sanitized content rendering
- **CSRF Protection**: Built-in Next.js protection

## 📊 Performance

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Built-in caching strategies
- **Bundle Analysis**: Optimized bundle sizes
- **Lighthouse Score**: 90+ performance score

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** if applicable
5. **Submit a pull request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- **Documentation**: Check this README and inline code comments
- **Issues**: Create an issue in the repository
- **Email**: Contact the development team

## 🎯 Roadmap

- [ ] **Admin Dashboard**: Full-featured admin interface
- [ ] **Analytics**: Post and user analytics
- [ ] **Email Newsletter**: Newsletter subscription system
- [ ] **Multi-language**: Internationalization support
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Media Library**: File upload and management
- [ ] **API Documentation**: Swagger/OpenAPI docs
- [ ] **Mobile App**: React Native companion app

---

**Built with ❤️ by Zemenay Tech Solutions**

A plug-and-play blog system that makes content management effortless.
