"use client";
import Link from 'next/link';

export default function AdminUsersPage() {
	return (
		<div className="p-8 max-w-3xl mx-auto space-y-6">
			<h1 className="text-2xl font-bold">Manage Users</h1>
			<div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
				<p className="text-gray-700">
					User management (listing, roles, deletions) is handled via Supabase. For security reasons,
					listing all users requires server-side privileges and is not exposed by the current backend API.
				</p>
				<div className="space-y-2">
					<p className="text-gray-700">Available actions:</p>
					<ul className="list-disc pl-6 text-gray-700">
						<li>
							Invite a new user by sharing the signup page: <Link className="text-primary-600 underline" href="/signup">/signup</Link>
						</li>
						<li>Promote a user to admin by updating their role in the database (via Supabase dashboard)</li>
						<li>Disable or delete users in Supabase Auth dashboard</li>
					</ul>
				</div>
				<p className="text-sm text-gray-500">
					If you need in-app user administration, we can add API endpoints server-side to securely support it.
				</p>
			</div>
		</div>
	);
}
