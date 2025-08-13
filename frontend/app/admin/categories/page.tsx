"use client";
import { useEffect, useState } from 'react';
import { api, Category } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [name, setName] = useState('');

	async function loadCategories() {
		try {
			const res = await api.getCategories();
			setCategories(res.data || []);
		} catch (e) {
			toast.error('Failed to load categories');
		}
	}

	useEffect(() => {
		(async () => {
			await loadCategories();
			setLoading(false);
		})();
	}, []);

	const handleCreate = async () => {
		if (!name.trim()) return;
		try {
			await api.createCategory({ name });
			await loadCategories();
			setName('');
			toast.success('Category created');
		} catch (e) {
			toast.error('Failed to create category');
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this category?')) return;
		try {
			await api.deleteCategory(id);
			setCategories((prev) => prev.filter((c) => c.id !== id));
			toast.success('Category deleted');
		} catch (e) {
			toast.error('Failed to delete category');
		}
	};

	return (
		<div className="p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">Manage Categories</h1>
				<div className="flex gap-2">
					<input className="input" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
					<Button onClick={handleCreate}>Create</Button>
				</div>
			</div>
			{loading ? (
				<div>Loading...</div>
			) : (
				<table className="min-w-full bg-white border">
					<thead>
						<tr>
							<th className="p-2 border">Name</th>
							<th className="p-2 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{categories.map((category) => (
							<tr key={category.id}>
								<td className="p-2 border">{category.name}</td>
								<td className="p-2 border space-x-2">
									<Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>Delete</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</div>
	);
}
