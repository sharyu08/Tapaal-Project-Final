import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Mail, Users, BarChart3, Map, Building2, Bell, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const { t } = useTranslation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard },
        { id: 'analytics', label: t('navigation.analytics'), icon: BarChart3 },
        { id: 'inward', label: t('navigation.inwardMails'), icon: Mail },
        { id: 'outward', label: t('navigation.outwardMails'), icon: Mail },
        { id: 'departments', label: t('navigation.departments'), icon: Building2 },
        { id: 'users', label: t('navigation.users'), icon: Users },
        { id: 'tracking', label: t('navigation.tracking'), icon: Map },
    ];

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside className={`${isCollapsed ? 'w-16' : 'w-64'} bg-blue-900 text-white flex flex-col transition-all duration-300 ease-in-out relative shadow-xl`}>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 p-2"
            >
                {isCollapsed ? (
                    <Menu className="w-6 h-6" />
                ) : (
                    <X className="w-6 h-6" />
                )}
            </button>

            {/* Header */}
            <div className="p-6 border-b border-blue-700">
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
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors group ${isActive
                                ? 'bg-slate-700 text-white'
                                : 'text-slate-300 hover:bg-slate-800'
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
    );
}
