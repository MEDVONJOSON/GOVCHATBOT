'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.errors?.[0]?.msg || 'Registration failed');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect to dashboard
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 flex items-center justify-center px-8 py-20">
                <div className="w-full max-w-md">

                    {/* Register Card */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-[var(--sl-blue)]/30 shadow-[0_0_40px_rgba(0,0,0,0.5)]">

                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                            <p className="text-gray-400 text-sm">Join the GovChat community</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-blue)] text-white transition-all"
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-blue)] text-white transition-all"
                                    placeholder="your.email@example.com"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Phone Number</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-blue)] text-white transition-all"
                                    placeholder="+232 76 000 000"
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
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-blue)] text-white transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 text-gray-400">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-blue)] text-white transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[var(--sl-blue)] hover:bg-[var(--sl-blue)]/80 text-white p-3 rounded-xl transition-all font-bold tracking-wide shadow-[0_0_15px_rgba(0,114,198,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-500">
                            Already have an account? <Link href="/login" className="text-[var(--sl-blue)] hover:underline">Login here</Link>
                        </div>

                    </div>

                    <p className="text-center text-xs text-gray-600 mt-6">
                        🔒 Your data is protected by Government of Sierra Leone
                    </p>

                </div>
            </div>

            <Footer />
        </main>
    );
}
