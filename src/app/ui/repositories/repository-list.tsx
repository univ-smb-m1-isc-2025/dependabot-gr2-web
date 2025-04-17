'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/app/context/auth-context";

const mockRepositories = [
	{ id: 1, name: 'my-project', language: 'Maven' },
	{ id: 2, name: 'web-app', language: 'Maven' },
	{ id: 6, name: 'backend-service', language: 'Python' },
	{ id: 4, name: 'mobile-app', language: 'Maven' },
];

export default function RepositoryList() {
	const [repositories, setRepositories] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { logout } = useAuth();

	useEffect(() => {
		fetchRepositories();
	}, []);

	const fetchRepositories = async () => {
		setIsLoading(true);
		const token = localStorage.getItem('token');
		if (!token) {
			logout();
			setIsLoading(false);
			return;
		}

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			const response = await fetch(`${apiUrl}/api/deps/repositories`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				credentials: 'include',
			});
			if(response.status === 401) {
				logout();
				setIsLoading(false);
				return;
			}
			if (!response.ok) {
				throw new Error('Failed to fetch repositories');
			}

			const data = await response.json();
			if (data.repositories && Array.isArray(data.repositories)) {
				setRepositories(data.repositories);
			} else {
				console.error('Unexpected response format:', data);
				setRepositories([]);
			}
		}
		catch (error) {
			console.error('Error fetching repositories:', error);
		}
		finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Repositories</h2>
				<button 
					onClick={fetchRepositories}
					disabled={isLoading}
					className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
				>
					{isLoading ? (
						<span>Refreshing...</span>
					) : (
						<span>Refresh</span>
					)}
				</button>
			</div>
			<div className="shadow overflow-hidden rounded-lg bg-gray-700 text-gray-100">
				<table className="min-w-full divide-y divide-gray-500 bg-gray-700 text-gray-100">
					<thead className="bg-gray-700">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Name</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Type</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-gray-800 text-white">
						{repositories.map((repo) => (
							<tr 
								key={repo.id} 
								className="bg-gray-700 hover:bg-gray-600 cursor-pointer relative group"
							>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{repo.name}</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{repo.type}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}