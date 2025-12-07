'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import { auth } from '../../utils/auth';

export default function Dashboard() {
    const router = useRouter();
    const [userStats, setUserStats] = useState({
        conversations: 0,
        reports: 0,
        verified: 0,
        status: 'Active'
    });

    useEffect(() => {
        // Check if user is logged in
        if (!auth.isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Get user data
        const userData = auth.getUser();
        setUser(userData);
        fetchUserStats();
    }, [router]);

    const fetchUserStats = async () => {
        try {
            const token = auth.getToken();
            const headers = { 'Authorization': `Bearer ${token}` };

            // Fetch user specific stats
            const [reportsRes, chatsRes] = await Promise.all([
                fetch('http://localhost:5000/api/reports/my-reports', { headers }),
                fetch('http://localhost:5000/api/chat-history', { headers })
            ]);

            const reportsData = await reportsRes.json();
            const chatsData = await chatsRes.json();

            setUserStats({
                conversations: chatsData.messages ? new Set(chatsData.messages.map((m: any) => m.session_id)).size : 0,
                reports: reportsData.reports ? reportsData.reports.length : 0,
                verified: 0, // Placeholder for now
                status: 'Active'
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching user stats:', error);
            setLoading(false);
        }
    };

    const handleLogout = () => {
        auth.logout();
    };

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="text-white">Loading Dashboard...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 px-8 py-12 max-w-7xl mx-auto w-full">

                {/* Welcome Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome back, <span className="sl-text-green">{user?.fullName || user?.full_name}</span>!
                    </h1>
                    <p className="text-gray-400">Manage your account and view your activity</p>
                </div>

                {/* Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">

                    {/* Profile Card */}
                    <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] flex items-center justify-center text-2xl font-bold">
                                {user?.fullName?.[0] || user?.full_name?.[0] || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{user?.fullName || user?.full_name}</h3>
                                <p className="text-sm text-gray-500">{user?.role === 'admin' ? '👑 Admin' : '👤 User'}</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-gray-500">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Account Type</p>
                                <p className="font-medium capitalize">{user?.role}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Member Since</p>
                                <p className="font-medium">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full mt-6 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm"
                        >
                            LOGOUT
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="md:col-span-2 grid grid-cols-2 gap-6">

                        <div className="bg-gradient-to-br from-[var(--sl-green)]/10 to-transparent border border-[var(--sl-green)]/30 rounded-2xl p-6">
                            <div className="text-3xl mb-2">💬</div>
                            <h3 className="text-2xl font-bold mb-1">{userStats.conversations}</h3>
                            <p className="text-sm text-gray-400">Total Conversations</p>
                        </div>

                        <div className="bg-gradient-to-br from-[var(--sl-blue)]/10 to-transparent border border-[var(--sl-blue)]/30 rounded-2xl p-6">
                            <div className="text-3xl mb-2">🛡️</div>
                            <h3 className="text-2xl font-bold mb-1">{userStats.reports}</h3>
                            <p className="text-sm text-gray-400">Scams Reported</p>
                        </div>

                        <div className="bg-gradient-to-br from-[var(--sl-green)]/10 to-transparent border border-[var(--sl-green)]/30 rounded-2xl p-6">
                            <div className="text-3xl mb-2">✅</div>
                            <h3 className="text-2xl font-bold mb-1">{userStats.verified}</h3>
                            <p className="text-sm text-gray-400">Info Verified</p>
                        </div>

                        <div className="bg-gradient-to-br from-[var(--sl-blue)]/10 to-transparent border border-[var(--sl-blue)]/30 rounded-2xl p-6">
                            <div className="text-3xl mb-2">⭐</div>
                            <h3 className="text-2xl font-bold mb-1">{userStats.status}</h3>
                            <p className="text-sm text-gray-400">Account Status</p>
                        </div>

                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
                    <div className="grid md:grid-cols-4 gap-4">

                        <button
                            onClick={() => router.push('/')}
                            className="p-4 bg-[var(--sl-green)]/10 border border-[var(--sl-green)]/30 rounded-xl hover:bg-[var(--sl-green)]/20 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">💬</div>
                            <h3 className="font-bold mb-1">Start Chat</h3>
                            <p className="text-xs text-gray-400">Ask questions</p>
                        </button>

                        <button
                            onClick={() => router.push('/report')}
                            className="p-4 bg-[var(--sl-blue)]/10 border border-[var(--sl-blue)]/30 rounded-xl hover:bg-[var(--sl-blue)]/20 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">🚨</div>
                            <h3 className="font-bold mb-1">Report Scam</h3>
                            <p className="text-xs text-gray-400">Submit threat</p>
                        </button>

                        <button
                            onClick={() => router.push('/chat-history')}
                            className="p-4 bg-[var(--sl-green)]/10 border border-[var(--sl-green)]/30 rounded-xl hover:bg-[var(--sl-green)]/20 transition-all text-left"
                        >
                            <div className="text-2xl mb-2">📊</div>
                            <h3 className="font-bold mb-1">View History</h3>
                            <p className="text-xs text-gray-400">Past chats</p>
                        </button>

                        <button className="p-4 bg-[var(--sl-blue)]/10 border border-[var(--sl-blue)]/30 rounded-xl hover:bg-[var(--sl-blue)]/20 transition-all text-left">
                            <div className="text-2xl mb-2">⚙️</div>
                            <h3 className="font-bold mb-1">Settings</h3>
                            <p className="text-xs text-gray-400">Manage account</p>
                        </button>

                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                    <div className="text-center py-12 text-gray-500">
                        <div className="text-4xl mb-4">📭</div>
                        <p>No recent activity</p>
                        <p className="text-sm mt-2">Start a conversation to see your activity here</p>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
