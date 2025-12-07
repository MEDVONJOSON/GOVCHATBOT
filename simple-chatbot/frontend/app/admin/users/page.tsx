'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import { auth } from '../../../utils/auth';

export default function UserManagement() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        const user = auth.getUser();
        if (user?.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchUsers();
    }, [router]);

    const fetchUsers = async () => {
        try {
            const token = auth.getToken();
            const response = await fetch('http://localhost:5000/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setUsers(data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (userId, currentStatus) => {
        setActionLoading(userId);
        try {
            const token = auth.getToken();
            await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            await fetchUsers();
        } catch (error) {
            console.error('Error toggling status:', error);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

        setActionLoading(userId);
        try {
            const token = auth.getToken();
            await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 px-8 py-12 max-w-7xl mx-auto w-full">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">User <span className="sl-text-green">Management</span></h1>
                        <p className="text-gray-400">Manage system users and permissions.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading users...</div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 border-b border-white/10 text-gray-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="p-4">User</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Joined</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <div className="font-bold">{user.full_name}</div>
                                                    <div className="text-xs text-gray-500">{user.email}</div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin'
                                                        ? 'bg-[var(--sl-green)]/20 text-[var(--sl-green)] border border-[var(--sl-green)]/30'
                                                        : 'bg-gray-700/30 text-gray-400 border border-gray-600/30'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`flex items-center gap-2 text-sm ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    {user.is_active ? 'Active' : 'Suspended'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right space-x-2">
                                                {user.role !== 'admin' && (
                                                    <>
                                                        <button
                                                            onClick={() => toggleStatus(user.id, user.is_active)}
                                                            disabled={actionLoading === user.id}
                                                            className={`px-3 py-1 rounded text-xs font-bold border transition-all ${user.is_active
                                                                    ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                                                                    : 'border-green-500/30 text-green-500 hover:bg-green-500/10'
                                                                }`}
                                                        >
                                                            {user.is_active ? 'SUSPEND' : 'ACTIVATE'}
                                                        </button>
                                                        <button
                                                            onClick={() => deleteUser(user.id)}
                                                            disabled={actionLoading === user.id}
                                                            className="px-3 py-1 rounded text-xs font-bold border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
                                                        >
                                                            DELETE
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
