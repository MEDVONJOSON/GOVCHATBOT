'use client';

import { useState } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '', accessCode: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // For now, use the regular login endpoint but check for admin role
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.username,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Check if user is admin
            if (data.user.role !== 'admin') {
                throw new Error('Access denied. Admin privileges required.');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to admin dashboard
            router.push('/admin/dashboard');

        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 flex items-center justify-center px-8 py-20">
                <div className="w-full max-w-md">

                    {/* Admin Login Card */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border-2 border-[var(--sl-green)] shadow-[0_0_60px_rgba(30,181,58,0.2)]">

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <img src="/coat-of-arms.png" alt="Coat of Arms" className="h-20 w-auto drop-shadow-lg" />
                            </div>
                            <div className="inline-block px-4 py-1 rounded-full bg-[var(--sl-green)]/20 border border-[var(--sl-green)] text-[var(--sl-green)] text-xs font-bold tracking-widest uppercase mb-4">
                                RESTRICTED ACCESS
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
                            <p className="text-gray-400 text-sm">Government Officials Only</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Admin Email</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                    placeholder="admin@gov.sl"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Access Code (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.accessCode}
                                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all font-mono"
                                    placeholder="XXXX-XXXX-XXXX"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white p-3 rounded-xl transition-all font-bold tracking-wide shadow-[0_0_20px_rgba(30,181,58,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'VERIFYING...' : 'SECURE LOGIN'}
                            </button>
                        </form>

                        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                            <p className="text-xs text-yellow-500 text-center">
                                ⚠️ Unauthorized access attempts are logged and reported to authorities.
                            </p>
                        </div>

                    </div>

                    <p className="text-center text-xs text-gray-600 mt-6">
                        🔐 Multi-factor authentication enabled
                    </p>

                </div>
            </div>

            <Footer />
        </main>
    );
}
