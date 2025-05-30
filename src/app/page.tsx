"use client";

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import DepocheckLogo from './ui/depocheck-logo';
import { useAuth } from './context/auth-context';

export default function Page() {
	const { isAuthenticated } = useAuth();

	return (
		<main className="flex min-h-screen flex-col p-6">
			<div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
				<DepocheckLogo />
			</div>
			<div className="mt-4 flex grow flex-col gap-4 md:flex-row">
				<div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
					<p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
							<strong>Welcome to Depocheck.</strong>
					</p>
					
					{isAuthenticated ? (
						<Link
							href="/dashboard"
							className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
						>
							<span>Go to Dashboard</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
					) : (
						<Link
							href="/login"
							className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
						>
							<span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
						</Link>
					)}
				</div>
				<div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
					<p>In the fast-paced world of software development, keeping your project&apos;s dependencies up to date is crucial for maintaining security, performance, and compatibility. Introducing Dependency Checker, an innovative application designed to streamline the process of verifying and updating dependencies for your GitHub projects.</p>
				</div>
			</div>
		</main>
	);
}