'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Post, Reaction, Share } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Button } from '../ui/Button';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Eye,
  Calendar,
  User
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '../providers/AuthProvider';
import toast from 'react-hot-toast';

interface PostContentProps {
  post: Post;
}

export function PostContent({ post }: PostContentProps) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState<Reaction>({ likes: 0, dislikes: 0 });
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [shares, setShares] = useState<Share>({ total: 0, perPlatform: {} });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reactionsData, sharesData] = await Promise.all([
          api.getPostReactions(post.id),
          api.getPostShares(post.slug),
        ]);
        setReactions(reactionsData);
        setUserReaction(reactionsData.userReaction || null);
        setShares(sharesData.totals);
      } catch (error) {
        console.error('Failed to fetch post data:', error);
      }
    };

    fetchData();
  }, [post.id, post.slug]);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) {
      toast.error('Please login to react to posts');
      return;
    }

    setLoading(true);
    try {
      const response = await api.reactToPost(post.id, type);
      setReactions(response);
      setUserReaction(response.userReaction || null);
    } catch (error) {
      toast.error('Failed to update reaction');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (platform: 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'copy_link') => {
    try {
      if (platform === 'copy_link') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } else {
        await api.sharePost(post.slug, platform);
        toast.success(`Shared on ${platform}!`);
      }
      
      // Refresh shares count
      const sharesData = await api.getPostShares(post.slug);
      setShares(sharesData.totals);
    } catch (error) {
      toast.error('Failed to share post');
    }
  };

  const shareButtons = [
    { platform: 'facebook' as const, icon: Facebook, label: 'Facebook' },
    { platform: 'twitter' as const, icon: Twitter, label: 'Twitter' },
    { platform: 'linkedin' as const, icon: Linkedin, label: 'LinkedIn' },
    { platform: 'copy_link' as const, icon: Share2, label: 'Copy Link' },
  ];

  return (
    <article className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-64 md:h-96">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Post Header */}
      <div className="p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
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

        {/* Post Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Reactions */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant={userReaction === 'like' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleReaction('like')}
                disabled={loading}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {reactions.likes}
              </Button>
              <Button
                variant={userReaction === 'dislike' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleReaction('dislike')}
                disabled={loading}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {reactions.dislikes}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Share:</span>
            {shareButtons.map(({ platform, icon: Icon, label }) => (
              <Button
                key={platform}
                variant="outline"
                size="sm"
                onClick={() => handleShare(platform)}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {shares.total} shares
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
