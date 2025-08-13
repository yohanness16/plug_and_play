import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PostContent } from '@/components/blog/PostContent';
import { Comments } from '@/components/blog/Comments';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  try {
    const post = await api.getPost(params.slug);
    
    if (!post || post.status !== 'published') {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PostContent post={post} />
          <Comments postId={post.id} />
        </main>

        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch post:', error);
    notFound();
  }
}
