"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Post } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminEditPostPage() {
	const params = useParams();
	const router = useRouter();
	const slug = (params?.slug as string) || '';
	const [post, setPost] = useState<Post | null>(null);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		(async () => {
			if (!slug) return;
			try {
				const fetched = await api.getPost(slug);
				setPost(fetched);
				setTitle(fetched.title || '');
				setContent(fetched.content || '');
			} catch (e) {
				toast.error('Failed to load post');
			} finally {
				setLoading(false);
			}
		})();
	}, [slug]);

	const handleSave = async () => {
		if (!post) return;
		setSaving(true);
		try {
			await api.updatePost(post.id, { title, content });
			toast.success('Post updated');
			router.push('/admin/posts');
		} catch (e) {
			toast.error('Failed to update post');
		} finally {
			setSaving(false);
		}
	};

	if (loading) return <div className="p-8">Loading...</div>;
	if (!post) return <div className="p-8">Post not found</div>;

	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-2xl font-bold mb-6">Edit Post</h1>
			<div className="space-y-4">
				<div>
					<label className="block mb-1 font-medium">Title</label>
					<input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
				</div>
				<div>
					<label className="block mb-1 font-medium">Content</label>
					<textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} rows={10} />
				</div>
				<Button onClick={handleSave} loading={saving}>Save Changes</Button>
			</div>
		</div>
	);
}
