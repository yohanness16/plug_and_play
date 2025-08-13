"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, Post } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminPostsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.getPosts({});
				setPosts(res.data || []);
			} catch (e) {
				toast.error('Failed to load posts');
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this post?')) return;
		try {
			await api.deletePost(id);
			setPosts((prev) => prev.filter((p) => p.id !== id));
			toast.success('Post deleted');
		} catch (e) {
			toast.error('Failed to delete post');
		}
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Manage Posts</h1>
				<Link href="/admin/posts/new"><Button>Create New Post</Button></Link>
			</div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<table className="min-w-full bg-white border">
					<thead>
						<tr>
							<th className="p-2 border">Title</th>
							<th className="p-2 border">Status</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{posts.map((post) => (
							<tr key={post.id}>
								<td className="p-2 border">{post.title}</td>
								<td className="p-2 border">{post.status}</td>
								<td className="p-2 border space-x-2">
									{post.slug ? (
										<Link href={`/admin/posts/${post.slug}/edit`}><Button size="sm">Edit</Button></Link>
									) : null}
									<Button size="sm" variant="outline" onClick={() => handleDelete(post.id)}>Delete</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
