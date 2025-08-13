import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { redirect } from 'next/navigation';
import { api } from '@/lib/api';

export default async function AdminPage() {
  // This would typically check authentication and role
  // For now, we'll just show the dashboard
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your blog content and users</p>
        </div>

        <AdminDashboard />
      </main>

      <Footer />
    </div>
  );
}
