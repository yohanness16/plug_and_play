# Integration Guide - Zemenay Blog Frontend

This guide explains how to integrate the Zemenay Blog frontend with your existing backend and deploy it as a plug-and-play solution.

## 🔗 Backend Integration

### Prerequisites
1. **Backend Running**: Ensure your blog backend is running on `http://localhost:3001` (or update the API URL)
2. **Supabase Setup**: Configure Supabase for authentication
3. **Database**: PostgreSQL database with the required schema

### Environment Configuration

1. **Copy the environment template**:
   ```bash
   cp env.example .env.local
   ```

2. **Update the environment variables**:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=http://localhost:3001
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: App URL for sharing
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Backend API Requirements

The frontend expects these API endpoints from your backend:

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/forgot-password` - Password reset

#### Posts
- `GET /posts` - List posts with filtering
- `GET /posts/:slug` - Get single post
- `POST /posts` - Create post (authenticated)
- `PUT /posts/:id` - Update post (authenticated)
- `DELETE /posts/:id` - Delete post (authenticated)

#### Categories
- `GET /catagories` - List categories
- `GET /catagories/:slug` - Get category with posts
- `POST /catagories` - Create category (authenticated)
- `PUT /catagories/:id` - Update category (authenticated)
- `DELETE /catagories/:id` - Delete category (authenticated)

#### Comments
- `GET /comments/post/:postId` - Get post comments
- `POST /comments` - Create comment (authenticated)
- `PUT /comments/:id` - Update comment (authenticated)
- `DELETE /comments/:id` - Delete comment (authenticated)

#### Reactions
- `GET /posts/:postId/reactions` - Get post reactions
- `POST /posts/:postId/reactions` - React to post (authenticated)
- `GET /comments/:commentId/reactions` - Get comment reactions
- `POST /comments/:commentId/reactions` - React to comment (authenticated)

#### Shares
- `GET /share/:id/shares` - Get post shares
- `POST /share/:id/share` - Share post

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp env.example .env.local
# Edit .env.local with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Customization

### Branding
1. **Logo**: Replace images in `public/assets/`
2. **Colors**: Update primary colors in `tailwind.config.js`
3. **Company Info**: Update in header and footer components

### Features
- **Enable/disable features** by modifying components
- **Customize user roles** and permissions
- **Adjust pagination** settings
- **Modify search** and filtering options

### Styling
- **Colors**: Update the color palette in `tailwind.config.js`
- **Typography**: Modify font families and sizes
- **Layout**: Adjust spacing and layout in components

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js App Router pages
├── components/            # Reusable components
├── lib/                  # Utilities and API client
├── public/               # Static assets
└── package.json         # Dependencies and scripts
```

### Key Components
- **API Client** (`lib/api.ts`): Handles all backend communication
- **Auth Provider** (`components/providers/AuthProvider.tsx`): Manages authentication state
- **Layout Components**: Header, footer, and navigation
- **Blog Components**: Post cards, comments, reactions, etc.

### Adding New Features
1. Create new components in the appropriate directory
2. Add API methods in `lib/api.ts`
3. Update types as needed
4. Add routes in the app directory

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds

### Other Platforms
- **Netlify**: Use the Next.js build command
- **AWS Amplify**: Connect your repository
- **Self-hosted**: Build and serve the static files

### Production Environment Variables
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 🔒 Security Considerations

### Authentication
- Secure token-based authentication
- Role-based access control
- Protected API endpoints

### Data Validation
- Client and server-side validation
- Input sanitization
- XSS protection

### Environment Variables
- Never commit sensitive data
- Use environment variables for configuration
- Secure API keys and secrets

## 📊 Performance Optimization

### Next.js Features
- Automatic image optimization
- Code splitting
- Static generation where possible
- Built-in caching

### Best Practices
- Optimize images and assets
- Minimize bundle size
- Use proper loading states
- Implement error boundaries

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Check if backend is running
   - Verify API URL in environment variables
   - Check CORS configuration

2. **Authentication Issues**
   - Verify Supabase configuration
   - Check environment variables
   - Clear browser storage

3. **Build Errors**
   - Check Node.js version (18+)
   - Clear node_modules and reinstall
   - Check TypeScript errors

### Debug Mode
Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📞 Support

For integration support:
1. Check the main README.md
2. Review inline code comments
3. Check the API documentation
4. Create an issue in the repository

## 🔄 Updates and Maintenance

### Keeping Up to Date
1. Regularly update dependencies
2. Monitor for security updates
3. Test after major updates
4. Backup before updates

### Monitoring
- Set up error tracking (Sentry, etc.)
- Monitor performance metrics
- Track user analytics
- Monitor API response times

---

**Need Help?** Contact the development team or create an issue in the repository.
