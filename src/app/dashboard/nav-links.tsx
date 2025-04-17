'use client';

import { HomeIcon, FolderIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const links = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Repositories', href: '/dashboard', icon: FolderIcon }
];

export default function NavLinks() {
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-2 rounded-lg bg-gray-700 p-2 text-sm font-medium hover:bg-gray-600"
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}