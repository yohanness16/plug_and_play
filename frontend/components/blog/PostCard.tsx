import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/api';
import { formatDate, truncateText } from '@/lib/utils';
import { Eye, Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured';
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <article className={`card overflow-hidden transition-transform hover:scale-105 hover:shadow-lg ${isFeatured ? 'md:col-span-2' : ''}`}>
      {post.coverImage && (
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{post.authorName || 'Anonymous'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-4 w-4" />
            <span>{post.views} views</span>
          </div>
        </div>

        <Link href={`/posts/${post.slug}`}>
          <h3 className={`font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors ${
            isFeatured ? 'text-2xl' : 'text-xl'
          }`}>
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {truncateText(post.excerpt, 150)}
          </p>
        )}

        <Link href={`/posts/${post.slug}`}>
          <span className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors">
            Read more
            <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}
