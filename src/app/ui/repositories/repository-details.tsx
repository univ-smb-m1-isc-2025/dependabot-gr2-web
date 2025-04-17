'use client';

import { useEffect, useState } from 'react';
import { useAuth } from "@/app/context/auth-context";
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline';

interface RepositoryDetailsProps {
    repositoryId: string;
    onBack: () => void;
}

export default function RepositoryDetails({ repositoryId, onBack }: RepositoryDetailsProps) {

    const [repositoryDetails, setRepositoryDetails] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { logout } = useAuth();

    const fetchRepositoryDetails = async (repoID: string) => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
            logout();
            setIsLoading(false);
            return;
        }
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/deps/repository/${repoID}/dependencies`;
            console.log('Fetching repository details from:', apiUrl);
            const response = await fetch(apiUrl, {
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
                throw new Error('Failed to fetch repository details');
            }
            
            const data = await response.json();
            setRepositoryDetails(data);
        }
        catch (error) {
            console.error('Error fetching repository details:', error);
        }
        finally {
            setIsLoading(false);
        }
    }

    const deleteRepository = (repoID: string) => {
        return async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                logout();
                return;
            }
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/deps/repository/${repoID}`;
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    credentials: 'include',
                });
                if (response.status === 401) {
                    logout();
                    return;
                }
                if (!response.ok) {
                    throw new Error('Failed to delete repository');
                }
                alert('Repository deleted successfully!');
                setRepositoryDetails(null);

                onBack();
            } catch (error) {
                console.error('Error deleting repository:', error);
            }
        }
    }

    const displayRepositoryDetails = (repository: any) => {
        if (!repository) return null;
        return (
            <div className="bg-gray-700 rounded-lg p-6 w-full max-w flex flex-col gap-2">
                <div className="flex items-center gap-4 flex-col md:flex-row justify-between">
                    <h2 className="text-xl font-semibold text-white">{repository.name}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.open(`${repository.url}/tree/${repository.branch}`, '_blank')}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded flex items-center gap-2"
                        >
                            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                            </svg>
                            Github
                        </button>
                        <button
                            onClick={deleteRepository(repository.id)}
                            className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded flex items-center gap-2"
                        >
                            <TrashIcon className="h-6 w-6" fill="currentColor" />
                            Delete
                        </button>
                    </div>
                </div>
                <p className="text-gray-400">Branch: {repository.branch}</p>
                <p className="text-gray-400">Type: {repository.type}</p>
                <p className="text-gray-400">Username: {repository.username}</p>
            </div>
        );
    }

    const displayDependencies = (dependencies: any[]) => {
        if (!dependencies || dependencies.length === 0) return null;
        return (
            <div className="bg-gray-700 rounded-lg p-6 w-full max-w flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-white">Dependencies</h2>
				<table className="min-w-full divide-y divide-gray-500 bg-gray-700 text-gray-100">
                    <thead className="bg-gray-700">
						<tr>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Name</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Status</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Current version</th>
							<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-100 uppercase tracking-wider">Last version</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-gray-800 text-white">

                        {dependencies.map((dep, index) => (
                            <tr 
                                className="bg-gray-700 hover:bg-gray-600 cursor-pointer relative group"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{dep.dependencie_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100 w-min">{(dep.old_version != dep.new_version) ? <div className='bg-red-500 text-red-900 rounded-lg p-1 border border-red-900 border-2'>Not Up to Date</div> : <div className='bg-green-500 text-green-900 rounded-lg p-1 border border-green-900 border-2'>Up to Date</div>}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{dep.old_version ? dep.old_version : "NaN"}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{dep.new_version ? dep.new_version : "NaN"}</td>
                            </tr>
                        ))}
					</tbody>
				</table>
            </div>
        );
    }

    useEffect(() => {
        fetchRepositoryDetails(repositoryId);
    }, [repositoryId]);

    return (
        <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-4">
                <button 
                    onClick={onBack}
                    className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-white">Repository Details</h1>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"/>
                    <p className="ml-2 text-gray-400">Loading repository data...</p>
                </div>
            ) : <div className="flex flex-col gap-4">
                    {displayRepositoryDetails(repositoryDetails.repository)}
                    {displayDependencies(repositoryDetails.dependencies)}
                </div>
                }
        
        </div>
    );
}