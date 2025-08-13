'use client';

import { useState, useEffect } from 'react';
import { api, Category, User } from '@/lib/api';
import { Filter, X } from 'lucide-react';

interface PostFiltersProps {
  selectedCategory: string;
  selectedAuthor: string;
  onCategoryChange: (categoryId: string) => void;
  onAuthorChange: (authorId: string) => void;
}

export function PostFilters({ 
  selectedCategory, 
  selectedAuthor, 
  onCategoryChange, 
  onAuthorChange 
}: PostFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<User[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [categoriesResponse] = await Promise.all([
          api.getCategories(),
        ]);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Failed to fetch filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const hasActiveFilters = selectedCategory || selectedAuthor;

  const clearFilters = () => {
    onCategoryChange('');
    onAuthorChange('');
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
              Category: {categories.find(c => c.id === selectedCategory)?.name}
              <button
                onClick={() => onCategoryChange('')}
                className="ml-2 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedAuthor && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
              Author: {authors.find(a => a.id === selectedAuthor)?.name}
              <button
                onClick={() => onAuthorChange('')}
                className="ml-2 hover:text-primary-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.postCount})
                </option>
              ))}
            </select>
          </div>

          {/* Author Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author
            </label>
            <select
              value={selectedAuthor}
              onChange={(e) => onAuthorChange(e.target.value)}
              className="input"
            >
              <option value="">All Authors</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
