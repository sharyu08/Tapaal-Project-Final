import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Mail, Users, BarChart3, Map, Building2, Bell, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768; // md breakpoint
            setIsMobile(mobile);
            setIsCollapsed(mobile); // Auto-collapse on mobile
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setIsCollapsed(!isCollapsed);
        } else {
            setIsCollapsed(!isCollapsed);
        }
    };

    const handleNavigate = (page: string) => {
        onNavigate(page);
        // Auto-close sidebar on mobile after navigation
        if (isMobile) {
            setIsCollapsed(true);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard },
        { id: 'analytics', label: t('navigation.analytics'), icon: BarChart3 },
        { id: 'inward', label: t('navigation.inwardMails'), icon: Mail },
        { id: 'outward', label: t('navigation.outwardMails'), icon: Mail },
        { id: 'departments', label: t('navigation.departments'), icon: Building2 },
        { id: 'users', label: t('navigation.users'), icon: Users },
        { id: 'tracking', label: t('navigation.tracking'), icon: Map },
    ];

    // Mobile overlay
    if (isMobile && !isCollapsed) {
        return (
            <>
                {/* Mobile overlay */}
                <div 
                    className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
                    onClick={() => setIsCollapsed(true)}
                />
                {/* Sidebar */}
                <aside className="fixed left-0 top-0 h-full w-64 text-white flex flex-col transition-all duration-300 ease-in-out relative shadow-xl z-[60]" style={{background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)'}}>
                    {/* Mobile Close Button */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Header */}
                    <div className="p-6 border-b border-white/20">
                        <h1 className="font-bold text-xl">
                            Tapaal
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentPage === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigate(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${isActive
                                        ? 'bg-white/20 text-white'
                                        : 'text-white/80 hover:bg-white/10'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="transition-all duration-300">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>
            </>
        );
    }

    return (
        <>
            {/* Mobile hamburger button when sidebar is collapsed */}
            {isMobile && isCollapsed && (
                <button
                    onClick={toggleSidebar}
                    className="fixed left-4 top-4 z-[60] p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {/* Desktop/Tablet Sidebar */}
            <aside className={`${isMobile ? 'hidden' : ''} ${isCollapsed ? 'w-16' : 'w-64'} text-white flex flex-col transition-all duration-300 ease-in-out relative shadow-xl`} style={{background: 'linear-gradient(90deg, #2563EB 0%, #9333EA 100%)'}}>
                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2 hidden lg:block"
                >
                    {isCollapsed ? (
                        <Menu className="w-6 h-6" />
                    ) : (
                        <X className="w-6 h-6" />
                    )}
                </button>

                {/* Header */}
                <div className="p-6 border-b border-white/20">
                    <h1 className={`font-bold transition-all duration-300 ${isCollapsed ? 'text-lg text-center' : 'text-xl'}`}>
                        {isCollapsed ? 'T' : 'Tapaal'}
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigate(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group ${isActive
                                    ? 'bg-white/20 text-white'
                                    : 'text-white/80 hover:bg-white/10'
                                    }`}
                                title={isCollapsed ? item.label : ''}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                {!isCollapsed && (
                                    <span className="transition-all duration-300">{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
