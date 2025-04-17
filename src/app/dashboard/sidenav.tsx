'use client';

import Link from 'next/link';
import NavLinks from './nav-links';
import DepocheckLogo from '@/app/ui/depocheck-logo';
import { useAuth } from '@/app/context/auth-context';

export default function SideNav() {
    const { logout, username } = useAuth();
    
    return (
        <div className="h-full bg-gray-800 text-white flex flex-col">
            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-52">
                <DepocheckLogo />
            </div>
            <nav className="flex flex-col justify-between flex-grow">
            {username && (
                  <div className="px-4 pt-4 text-sm">
                    Welcome, <span className="font-semibold">{username}</span>
                  </div>
                )}
                <ul className="flex flex-col gap-4 p-4">
                    <li className="flex flex-col gap-2">
                        <NavLinks />
                    </li>
                </ul>
                <div className="mt-auto p-4 sticky bottom-0 bg-gray-800">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg bg-gray-700 p-2 text-sm font-medium hover:bg-gray-600"
                    >
                        <span>Log out</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}