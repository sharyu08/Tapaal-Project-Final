import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
