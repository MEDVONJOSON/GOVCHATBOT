'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { useRouter } from 'next/navigation';
import { auth } from '../../../utils/auth';

export default function AdminSettings() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Profile state
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        fullName: ''
    });

    // Password state
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Create admin state
    const [newAdmin, setNewAdmin] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        role: 'admin'
    });

    // Admins list
    const [admins, setAdmins] = useState([]);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        const userData = auth.getUser();
        if (userData?.role !== 'admin' && userData?.role !== 'super_admin') {
            router.push('/');
            return;
        }

        setUser(userData);
        setProfile({
            username: userData.username || '',
            email: userData.email || '',
            fullName: userData.fullName || userData.full_name || ''
        });

        if (userData.role === 'super_admin') {
            fetchAdmins();
        }
    }, [router]);

    const fetchAdmins = async () => {
        try {
            const token = auth.getToken();
            const res = await fetch('http://localhost:5000/api/admin/management/list', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setAdmins(data.admins);
            }
        } catch (error) {
            console.error('Fetch admins error:', error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = auth.getToken();
            const res = await fetch(`http://localhost:5000/api/admin/management/profile/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(profile)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local storage
                const updatedUser = { ...user, ...profile };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            setLoading(false);
            return;
        }

        try {
            const token = auth.getToken();
            const res = await fetch(`http://localhost:5000/api/admin/management/password/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to change password' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const token = auth.getToken();
            const res = await fetch('http://localhost:5000/api/admin/management/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAdmin)
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Admin created successfully!' });
                setNewAdmin({ username: '', email: '', password: '', fullName: '', role: 'admin' });
                fetchAdmins();
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to create admin' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`Are you sure you want to delete ${username}?`)) return;

        try {
            const token = auth.getToken();
            const res = await fetch(`http://localhost:5000/api/admin/management/user/${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'User deleted successfully!' });
                fetchAdmins();
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to delete user' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Server error' });
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                {/* Message Alert */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-400'}`}>
                        {message.text}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-6 py-3 font-bold transition-all ${activeTab === 'profile' ? 'border-b-2 border-[var(--sl-green)] text-[var(--sl-green)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`px-6 py-3 font-bold transition-all ${activeTab === 'password' ? 'border-b-2 border-[var(--sl-green)] text-[var(--sl-green)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Change Password
                    </button>
                    {user?.role === 'super_admin' && (
                        <>
                            <button
                                onClick={() => setActiveTab('create')}
                                className={`px-6 py-3 font-bold transition-all ${activeTab === 'create' ? 'border-b-2 border-[var(--sl-green)] text-[var(--sl-green)]' : 'text-gray-400 hover:text-white'}`}
                            >
                                Create Admin
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`px-6 py-3 font-bold transition-all ${activeTab === 'manage' ? 'border-b-2 border-[var(--sl-green)] text-[var(--sl-green)]' : 'text-gray-400 hover:text-white'}`}
                            >
                                Manage Admins
                            </button>
                        </>
                    )}
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Update Profile</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Username</label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Change Password Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">Current Password</label>
                                <input
                                    type="password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Create Admin Tab (Super Admin Only) */}
                {activeTab === 'create' && user?.role === 'super_admin' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Create New Admin</h2>
                        <form onSubmit={handleCreateAdmin} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={newAdmin.username}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                        required
                                        minLength={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={newAdmin.fullName}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, fullName: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Password</label>
                                <input
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2">Role</label>
                                <select
                                    value={newAdmin.role}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-[var(--sl-green)] outline-none"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50"
                            >
                                {loading ? 'Creating...' : 'Create Admin'}
                            </button>
                        </form>
                    </div>
                )}

                {/* Manage Admins Tab (Super Admin Only) */}
                {activeTab === 'manage' && user?.role === 'super_admin' && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Manage Admins</h2>
                        <div className="space-y-4">
                            {admins.map((admin) => (
                                <div key={admin.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${admin.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[var(--sl-green)]/20 text-[var(--sl-green)]'}`}>
                                            {admin.role === 'super_admin' ? '👑' : '👤'}
                                        </div>
                                        <div>
                                            <p className="font-bold">{admin.full_name}</p>
                                            <p className="text-sm text-gray-400">{admin.email}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <span className={`px-2 py-0.5 rounded ${admin.role === 'super_admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-[var(--sl-green)]/20 text-[var(--sl-green)]'}`}>
                                                    {admin.role === 'super_admin' ? 'SUPER ADMIN' : 'ADMIN'}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    {admin.role !== 'super_admin' && admin.id !== user.userId && (
                                        <button
                                            onClick={() => handleDeleteUser(admin.id, admin.username)}
                                            className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all text-sm font-bold"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
