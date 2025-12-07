'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { useRouter } from 'next/navigation';
import { auth } from '../../../utils/auth';

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        users: { total: 0, active: 0 },
        reports: { pending: 0, investigating: 0, resolved: 0, total: 0 },
        chats: { total: 0, today: 0 }
    });

    useEffect(() => {
        // Check if user is logged in and is admin
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        const userData = auth.getUser();
        if (userData?.role !== 'admin') {
            router.push('/');
            return;
        }

        setUser(userData);
        fetchStats();
    }, [router]);

    const fetchStats = async () => {
        try {
            const token = auth.getToken();
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch all stats in parallel
            const [userStatsRes, reportStatsRes, chatStatsRes] = await Promise.all([
                fetch('http://localhost:5000/api/admin/users/stats', { headers }),
                fetch('http://localhost:5000/api/reports/stats', { headers }),
                fetch('http://localhost:5000/api/chat-history/stats', { headers })
            ]);

            const userStats = await userStatsRes.json();
            const reportStats = await reportStatsRes.json();
            const chatStats = await chatStatsRes.json();

            setStats({
                users: {
                    total: userStats.totalUsers || 0,
                    active: userStats.activeUsers || 0
                },
                reports: {
                    pending: reportStats.pending || 0,
                    investigating: reportStats.investigating || 0,
                    resolved: reportStats.resolved || 0,
                    total: reportStats.total || 0
                },
                chats: {
                    total: chatStats.totalChats || 0,
                    today: chatStats.todayChats || 0
                }
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching stats:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-full">
                    <div className="text-white text-xl">Loading Dashboard...</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome, <span className="text-[var(--sl-green)]">{user?.fullName || user?.full_name || 'Administrator'}</span>!
                </h1>
                <p className="text-gray-400">System Administration Dashboard</p>
            </div>

            {/* System Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-[var(--sl-green)]/10 to-transparent border border-[var(--sl-green)]/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">👥</div>
                    <h3 className="text-4xl font-bold mb-1">{stats.users.total}</h3>
                    <p className="text-sm text-gray-400">Total Users</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">🚨</div>
                    <h3 className="text-4xl font-bold mb-1">{stats.reports.pending}</h3>
                    <p className="text-sm text-gray-400">Pending Reports</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">⚠️</div>
                    <h3 className="text-4xl font-bold mb-1">{stats.reports.investigating}</h3>
                    <p className="text-sm text-gray-400">Active Investigations</p>
                </div>

                <div className="bg-gradient-to-br from-[var(--sl-blue)]/10 to-transparent border border-[var(--sl-blue)]/30 rounded-2xl p-6 hover:scale-105 transition-transform">
                    <div className="text-4xl mb-3">💬</div>
                    <h3 className="text-4xl font-bold mb-1">{stats.chats.total}</h3>
                    <p className="text-sm text-gray-400">Total Chats</p>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* User Management */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">👥</div>
                        <h2 className="text-2xl font-bold">User Management</h2>
                    </div>
                    <p className="text-gray-400 mb-4">Manage user accounts and permissions</p>
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="w-full bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        View All Users
                    </button>
                </div>

                {/* Scam Reports */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-3xl">🚨</div>
                        <h2 className="text-2xl font-bold">Scam Reports</h2>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-red-400">Pending Reports</span>
                            <span className="font-bold">{stats.reports.pending}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-yellow-400">Investigating</span>
                            <span className="font-bold">{stats.reports.investigating}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-green-400">Resolved</span>
                            <span className="font-bold">{stats.reports.resolved}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => router.push('/admin/reports')}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                    >
                        Review Reports
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
