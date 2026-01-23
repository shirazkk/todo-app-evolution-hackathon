'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle, User } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col">
      <div className="text-xl font-bold mb-8">Todo App</div>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/new" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Todo
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/profile" passHref>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};