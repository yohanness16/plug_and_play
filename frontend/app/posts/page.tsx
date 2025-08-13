import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostCard } from '@/components/blog/PostCard';
import { PostList } from '@/components/blog/PostList';
import { api } from '@/lib/api';
import { Suspense } from 'react';

interface PostsPageProps {
  searchParams: {
    page?: string;
    q?: string;
    categoryId?: string;
    authorId?: string;
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const page = parseInt(searchParams.page || '1');
  const query = searchParams.q || '';
  const categoryId = searchParams.categoryId || '';
  const authorId = searchParams.authorId || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover insights, stories, and knowledge from our team of experts
          </p>
        </div>

        <Suspense fallback={<div>Loading posts...</div>}>
          <PostList 
            page={page}
            query={query}
            categoryId={categoryId}
            authorId={authorId}
          />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
