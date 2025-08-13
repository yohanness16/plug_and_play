'use client';

import { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { PostSearch } from './PostSearch';
import { PostFilters } from './PostFilters';
import { Pagination } from '../ui/Pagination';
import { api, Post } from '@/lib/api';
import { Button } from '../ui/Button';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  page: number;
  query: string;
  categoryId: string;
  authorId: string;
}

export function PostList({ page: initialPage, query: initialQuery, categoryId: initialCategoryId, authorId: initialAuthorId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedAuthor, setSelectedAuthor] = useState(initialAuthorId);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        status: 'published',
      };

      if (searchQuery) params.q = searchQuery;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (selectedAuthor) params.authorId = selectedAuthor;

      const response = await api.getPosts(params);
      setPosts(response.data);
      setTotalPages(Math.ceil(response.data.length / 12));
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, selectedCategory, selectedAuthor]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <PostSearch onSearch={handleSearch} initialQuery={searchQuery} />
        <PostFilters
          selectedCategory={selectedCategory}
          selectedAuthor={selectedAuthor}
          onCategoryChange={handleCategoryChange}
          onAuthorChange={handleAuthorChange}
        />
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? `No posts match your search for "${searchQuery}"`
              : 'No posts are available at the moment.'
            }
          </p>
          {(searchQuery || selectedCategory || selectedAuthor) && (
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSelectedAuthor('');
                setCurrentPage(1);
              }}
              variant="outline"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
