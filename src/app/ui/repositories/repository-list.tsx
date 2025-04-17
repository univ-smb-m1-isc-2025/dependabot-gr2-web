'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from "@/app/context/auth-context";
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Repository {
	id: string;
	name: string;
	branch: string;
	type: string;
	url: string;
	username: string;
	lastVerificationDate?: string;
	numberOfDependencies?: number;
	pendingUpdatesCount?: number;
  }

interface RepositoryListProps {
    onSelectRepository: (id: string) => void;
}

export default function RepositoryList({ onSelectRepository }: RepositoryListProps) {
	const [repositories, setRepositories] = useState<Repository[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [newRepoName, setNewRepoName] = useState<string>('');
	const [newRepoUsername, setNewRepoUsername] = useState<string>(localStorage.getItem('username') || '');
	const [newRepoURL, setNewRepoURL] = useState<string>('');
	const [newRepoBranch, setNewRepoBranch] = useState<string>('main');
	const [newRepoToken, setNewRepoToken] = useState<string>('');
	const [newRepoType, setNewRepoType] = useState<string>('');
	const [isModalOpen, setModalOpen] = useState<boolean>(false);
	const { logout } = useAuth();

	const fetchRepositories = useCallback(async () => {
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
	  }, [logout]);

	const getTimeDifference = (lastVerificationDate: string) => {
		const date = new Date(lastVerificationDate + 'Z'); // Set UTC timezone to avoid timezone issues
		const now = new Date();
		
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
		
		if (diffDays > 0) {
		  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
		} else if (diffHours > 0) {
		  return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
		} else {
		  return `${diffMinutes || 1} minute${(diffMinutes > 1 || diffMinutes === 0) ? 's' : ''} ago`;
		}
	  };

	const handleAddRepository = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log('Adding repository:', newRepoName, newRepoType);
		
		const token = localStorage.getItem('token');
		if (!token) {
			logout();
			return;
		}

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			const response = await fetch(`${apiUrl}/api/deps/add-repository`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: newRepoName,
					username: newRepoUsername,
					url: newRepoURL,
					branch: newRepoBranch,
					token: newRepoToken,
					type: newRepoType,
				}),
			});

			if(response.status === 401) {
				logout();
				return;
			}

			if (!response.ok) {
				throw new Error('Failed to add repository');
			}
			setModalOpen(false);
			fetchRepositories();
		} catch (error) {
			console.error('Error adding repository:', error);
		}
	}

	const renderAddRepositoryModal = () =>{
		if (!isModalOpen) return null;
		
		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div className="bg-gray-700 rounded-lg p-6 w-full max-w-md">
					<h3 className="text-xl font-bold mb-4">Add Repository</h3>
					<form onSubmit={handleAddRepository}>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Repository Name</label>
							<input 
								type="text" 
								className="w-full p-2 bg-gray-600 rounded text-white focus:bg-gray-500"
								value={newRepoName}
								onChange={(e) => setNewRepoName(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Username</label>
							<input 
								type="text" 
								className="w-full p-2 bg-gray-600 rounded text-white focus:bg-gray-500"
								value={newRepoUsername}
								onChange={(e) => setNewRepoUsername(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Repository URL</label>
							<input 
								type="text" 
								className="w-full p-2 bg-gray-600 rounded text-white  focus:bg-gray-500"
								value={newRepoURL}
								onChange={(e) => setNewRepoURL(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Branch</label>
							<input 
								type="text" 
								className="w-full p-2 bg-gray-600 rounded text-white focus:bg-gray-500"
								value={newRepoBranch}
								onChange={(e) => setNewRepoBranch(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Token</label>
							<input 
								type="text" 
								className="w-full p-2 bg-gray-600 rounded text-white  focus:bg-gray-500"
								value={newRepoToken}
								onChange={(e) => setNewRepoToken(e.target.value)}
								required
							/>
						</div>
						<div className="mb-4">
							<label className="block text-sm font-medium mb-1">Repository Type</label>
							<select
								className="w-full p-2 bg-gray-600 rounded text-white  focus:bg-gray-500"
								value={newRepoType}
								onChange={(e) => setNewRepoType(e.target.value)}
								required
							>
								<option value="">Select type</option>
								<option value="MAVEN">Maven</option>
							</select>
						</div>
						<div className="flex justify-end gap-2">
							<button
								type="button"
								className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
								onClick={() => setModalOpen(false)}
							>
								Cancel
							</button>
							<button
								type="submit"
								className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
							>
								Add Repository
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
	
	const renderRepositoriesTable = () => {
		return (
		  <div className="shadow overflow-hidden rounded-lg bg-gray-700 text-gray-100">
			<table className="min-w-full divide-y divide-gray-500 bg-gray-700 text-gray-100">
			  <thead className="bg-gray-700">
				<tr>
				  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Name</th>
				  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Branch</th>
				  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Type</th>
				  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Last update check</th>
				  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Up to date</th>
				</tr>
			  </thead>
			  <tbody className="divide-y divide-gray-200 bg-gray-800 text-white">
				{repositories.map((repo) => (
				  <tr 
					key={repo.id} 
					className="bg-gray-700 hover:bg-gray-600 cursor-pointer relative group"
					onClick={() => onSelectRepository(repo.id)}
				  >
					<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{repo.name}</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{repo.branch}</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{repo.type}</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
					  {repo.lastVerificationDate 
						? getTimeDifference(repo.lastVerificationDate)
						: 'Never'
					  }
					</td>
					<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">
					  {repo.numberOfDependencies !== undefined && repo.pendingUpdatesCount !== undefined 
						? `${repo.numberOfDependencies - repo.pendingUpdatesCount} / ${repo.numberOfDependencies}` 
						: 'NaN'}
					</td>
				  </tr>
				))}
			  </tbody>
			</table>
		  </div>
		);
	};
	
	useEffect(() => {
	fetchRepositories();
	}, [fetchRepositories]);

	return (
		<div className="w-full mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
			{renderAddRepositoryModal()}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Repositories</h2>
			</div>
			<div className="flex items-center mb-4 gap-2">
				<button
					onClick={() => setModalOpen(true)}
					className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
				>
					<PlusIcon className="w-5 h-5 mr-1" />
					Add
				</button>
				<button 
					onClick={fetchRepositories}
					disabled={isLoading}
					className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center"
				>
					<ArrowPathIcon className="w-5 h-5 mr-1" />
					{isLoading ? (
						<span>Refreshing...</span>
					) : (
						<span>Refresh</span>
					)}
				</button>
			</div>
			{renderRepositoriesTable()}
		</div>
	);
}