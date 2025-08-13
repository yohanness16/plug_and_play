import Link from 'next/link';
import { Category } from '@/lib/api';
import { Hash } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="card p-6 text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <Hash className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {category.name}
        </h3>
        
        <p className="text-sm text-gray-500">
          {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
        </p>
      </div>
    </Link>
  );
}
