import * as React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';
import { cn } from './ui/utils';

// Mocking Badge in case the external one isn't imported correctly
function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("absolute -top-1 -right-1 flex items-center justify-center rounded-full text-[10px] font-bold", className)}>
      {children}
    </span>
  );
}

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-30 w-full">
      {/* System Title */}
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate">
        Tapaal Management System
      </h1>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-full transition-all active:scale-95 text-gray-600 hover:text-blue-600"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <Badge className="bg-red-500 text-white min-w-[18px] h-[18px] border-2 border-white">
            3
          </Badge>
        </button>

        {/* User Profile Section */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer group">
          <div className="flex flex-col text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">Admin User</p>
            <p className="text-[11px] text-gray-500 font-medium">Administrator</p>
          </div>

          <button className="flex items-center gap-1 focus:outline-none">
            <div className="w-9 h-9 bg-blue-100 border border-blue-200 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>
        </div>
      </div>
    </header>
  );
}