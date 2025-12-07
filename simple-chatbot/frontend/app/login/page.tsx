'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            router.push('/dashboard');

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

                    {/* Login Card */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-[var(--sl-green)]/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-6">
                                <img src="/coat-of-arms.png" alt="Coat of Arms" className="h-20 w-auto drop-shadow-lg" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2">User Login</h1>
                            <p className="text-gray-400 text-sm">Access your GovChat account</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                    placeholder="your.email@example.com"
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white p-3 rounded-xl transition-all font-bold tracking-wide shadow-[0_0_15px_rgba(30,181,58,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'LOGGING IN...' : 'LOGIN'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account? <Link href="/register" className="text-[var(--sl-green)] hover:underline">Register here</Link>
                        </div>

                    </div>

                    <p className="text-center text-xs text-gray-600 mt-6">
                        🔒 Secure login powered by Government of Sierra Leone
                    </p>

                </div>
            </div>

            <Footer />
        </main>
    );
}
