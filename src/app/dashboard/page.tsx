'use client';

import { useState } from 'react';
import RepositoryList from "@/app/ui/repositories/repository-list";
import RepositoryDetails from "@/app/ui/repositories/repository-details";

export default function Page() {
    const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSelectRepository = (repoId: string) => {
        setIsLoading(true);
        setSelectedRepoId(repoId);
        setIsLoading(false);
    };
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                <p className="ml-2">Loading repository data...</p>
            </div>
        );
    }
    
    // Show repository details if a repo is selected, otherwise show the list
    if (selectedRepoId) {
        return (
            <RepositoryDetails 
                repositoryId={selectedRepoId} 
                onBack={() => setSelectedRepoId(null)} 
            />
        );
    }
    
    return <RepositoryList onSelectRepository={handleSelectRepository} />;
}