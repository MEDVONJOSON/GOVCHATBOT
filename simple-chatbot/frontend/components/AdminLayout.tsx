'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '../utils/auth';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const user = auth.getUser();

    const handleLogout = () => {
        auth.logout();
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
        { name: 'User Management', path: '/admin/users', icon: '👥' },
        { name: 'Scam Reports', path: '/admin/reports', icon: '🚨' },
        { name: 'Chat History', path: '/admin/chats', icon: '💬' },
        { name: 'Alerts', path: '/admin/alerts', icon: '🔔' },
    ];

    return (
        <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
            {/* Side Navigation */}
            <aside className="w-64 bg-black/50 border-r border-white/10 flex flex-col backdrop-blur-sm">
                {/* Logo */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] rounded-lg flex items-center justify-center">
                            <span className="text-xl">🛡️</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-lg">TRUTH ENGINE</h2>
                            <p className="text-xs text-gray-400">Admin Portal</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => router.push(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname === item.path
                                ? 'bg-[var(--sl-green)] text-white shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/10">
                    <p className="text-xs text-gray-500 text-center">
                        © 2024 Sierra Leone Gov
                    </p>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar with Profile Dropdown */}
                <header className="h-16 bg-black/30 border-b border-white/10 flex items-center justify-between px-6 backdrop-blur-sm">
                    <div>
                        <h1 className="text-xl font-bold">Admin Dashboard</h1>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] flex items-center justify-center">
                                <span className="text-xl">👤</span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold">{user?.username || 'Admin'}</p>
                                <p className="text-xs text-gray-400">System Administrator</p>
                            </div>
                            <span className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>

                        {/* Dropdown Menu */}
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50">
                                <div className="p-4 border-b border-white/10">
                                    <p className="text-sm font-bold">{user?.email || 'admin@gov.sl'}</p>
                                    <p className="text-xs text-gray-400 mt-1">Administrator</p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => router.push('/admin/settings')}
                                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-left"
                                    >
                                        <span>⚙️</span>
                                        <span>Settings</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all text-left"
                                    >
                                        <span>🚪</span>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
