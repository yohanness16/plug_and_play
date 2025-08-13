'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Eye, 
  Plus,
  Settings,
  BarChart3
} from 'lucide-react';
import { api } from '@/lib/api';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    comments: 0,
    views: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you'd have a stats endpoint
        // For now, we'll use placeholder data
        setStats({
          posts: 12,
          categories: 5,
          comments: 28,
          views: 1247,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const adminActions = [
    {
      title: 'Create Post',
      description: 'Write and publish new blog posts',
      icon: Plus,
      href: '/admin/posts/new',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Posts',
      description: 'Edit, delete, and organize your posts',
      icon: FileText,
      href: '/admin/posts',
      color: 'bg-green-500',
    },
    {
      title: 'Categories',
      description: 'Manage blog categories and tags',
      icon: BarChart3,
      href: '/admin/categories',
      color: 'bg-purple-500',
    },
    {
      title: 'Comments',
      description: 'Moderate and manage user comments',
      icon: MessageSquare,
      href: '/admin/comments',
      color: 'bg-orange-500',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-red-500',
    },
    {
      title: 'Settings',
      description: 'Configure blog settings and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{stats.categories}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Comments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.comments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.views}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    {action.title}
                  </h3>
                </div>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-sm text-gray-600">
                New post "Getting Started with Next.js" published
              </p>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-sm text-gray-600">
                New comment on "React Best Practices"
              </p>
              <span className="text-xs text-gray-400">4 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-sm text-gray-600">
                Category "Web Development" created
              </p>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
