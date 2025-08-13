"use client";
import { useEffect, useState } from 'react';
import { api, Comment, Post } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminCommentsPage() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [selectedPostId, setSelectedPostId] = useState<string>('');
	const [comments, setComments] = useState<Comment[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const res = await api.getPosts({ limit: 50 });
				setPosts(res.data || []);
			} catch (e) {
				toast.error('Failed to load posts');
			}
		})();
	}, []);

	const loadComments = async (postId: string) => {
		if (!postId) return;
		setLoading(true);
		try {
			const res = await api.getComments(postId);
			setComments(res.comments || []);
		} catch (e) {
			toast.error('Failed to load comments');
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this comment?')) return;
		try {
			await api.deleteComment(id);
			setComments((prev) => prev.filter((c) => c.id !== id));
			toast.success('Comment deleted');
		} catch (e) {
			toast.error('Failed to delete comment');
		}
	};

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Manage Comments</h1>
			<div className="flex items-center gap-3 mb-4">
				<select className="input" value={selectedPostId} onChange={(e) => setSelectedPostId(e.target.value)}>
					<option value="">Select a post...</option>
					{posts.map((p) => (
						<option key={p.id} value={p.id}>{p.title}</option>
					))}
				</select>
				<Button onClick={() => loadComments(selectedPostId)} disabled={!selectedPostId}>Load Comments</Button>
			</div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<table className="min-w-full bg-white border">
					<thead>
						<tr>
							<th className="p-2 border">Content</th>
							<th className="p-2 border">Author</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{comments.map((comment) => (
							<tr key={comment.id}>
								<td className="p-2 border">{comment.content}</td>
								<td className="p-2 border">{comment.authorName || 'Unknown'}</td>
								<td className="p-2 border space-x-2">
									<Button size="sm" variant="outline" onClick={() => handleDelete(comment.id)}>Delete</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
