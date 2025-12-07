'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '../utils/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
    const [isCapabilitiesDropdownOpen, setIsCapabilitiesDropdownOpen] = useState(false);

    useEffect(() => {
        // Check authentication status on mount and when local storage changes
        const checkAuth = () => {
            const authenticated = auth.isAuthenticated();
            setIsLoggedIn(authenticated);
            if (authenticated) {
                const user = auth.getUser();
                setUserRole(user?.role || 'user');
            } else {
                setUserRole(null);
            }
        };

        checkAuth();

        // Listen for storage events (in case login/logout happens in another tab)
        window.addEventListener('storage', checkAuth);

        // Custom event for immediate updates within the same tab
        window.addEventListener('auth-change', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('auth-change', checkAuth);
        };
    }, []);

    const handleLogout = (e) => {
        e.preventDefault();
        auth.logout();
        setIsLoggedIn(false);
        setUserRole(null);
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('auth-change'));
        router.push('/');
    };

    return (
        <nav className="flex justify-between items-center p-6 px-10 border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="text-2xl font-bold tracking-widest text-white flex items-center gap-2">
                {/* Sierra Leone Flag Icon */}
                <div className="flex flex-col h-6 w-8 rounded overflow-hidden border border-white/20">
                    <div className="h-2 w-full bg-[var(--sl-green)]"></div>
                    <div className="h-2 w-full bg-[var(--sl-white)]"></div>
                    <div className="h-2 w-full bg-[var(--sl-blue)]"></div>
                </div>
                <Link href="/">
                    <span className="font-medium tracking-widest">GOV-<span className="sl-text-green font-bold">CHATBOT</span></span>
                </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 text-xs font-bold tracking-widest text-gray-400 items-center">
                <Link href="/" className="hover:text-[var(--sl-green)] transition-colors duration-300">HOME</Link>

                {!isLoggedIn ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                            className="hover:text-[var(--sl-white)] transition-colors duration-300 flex items-center gap-1"
                        >
                            LOGIN
                            <span className="text-xs">▼</span>
                        </button>

                        {isLoginDropdownOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                <Link
                                    href="/login"
                                    className="block px-4 py-3 hover:bg-[var(--sl-green)]/20 transition-colors border-b border-white/5"
                                    onClick={() => setIsLoginDropdownOpen(false)}
                                >
                                    USER LOGIN
                                </Link>
                                <Link
                                    href="/register"
                                    className="block px-4 py-3 hover:bg-[var(--sl-blue)]/20 transition-colors border-b border-white/5"
                                    onClick={() => setIsLoginDropdownOpen(false)}
                                >
                                    REGISTER
                                </Link>
                                <Link
                                    href="/admin/login"
                                    className="block px-4 py-3 hover:bg-[var(--sl-green)]/20 transition-colors"
                                    onClick={() => setIsLoginDropdownOpen(false)}
                                >
                                    ADMIN LOGIN
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {userRole === 'admin' ? (
                            <Link href="/admin/dashboard" className="text-[var(--sl-green)] hover:text-[var(--sl-white)] transition-colors duration-300">ADMIN DASHBOARD</Link>
                        ) : (
                            <Link href="/dashboard" className="text-[var(--sl-green)] hover:text-[var(--sl-white)] transition-colors duration-300">DASHBOARD</Link>
                        )}
                    </>
                )}

                <Link href="/services" className="hover:text-[var(--sl-green)] transition-colors duration-300">GOV-SERVICES</Link>

                {/* AI Powered Services Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsCapabilitiesDropdownOpen(!isCapabilitiesDropdownOpen)}
                        className="hover:text-[var(--sl-blue)] transition-colors duration-300 flex items-center gap-1"
                    >
                        AI POWERED SERVICES
                        <span className="text-xs">▼</span>
                    </button>

                    {isCapabilitiesDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-black/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[600px] overflow-y-auto">
                            <div className="p-2">
                                {[
                                    { title: 'Verify Info', icon: '✓', desc: 'Check authenticity instantly', href: '/verify' },
                                    { title: 'Report Scams', icon: '🚨', desc: 'Report cyber threats', href: '/report' },
                                    { title: 'Real-time Alerts', icon: '🔔', desc: 'Government notifications', href: '/alerts' },
                                    { title: 'AI-Powered Chat', icon: '🤖', desc: '24/7 intelligent assistant', href: '/#chat' },
                                    { title: 'Document Verification', icon: '📄', desc: 'Verify official documents', href: '/verify-document' },
                                    { title: 'Multi-Language Support', icon: '🌐', desc: 'Multiple local languages', href: '/languages' },
                                    { title: 'WhatsApp Integration', icon: '💬', desc: 'Full platform access', href: '/whatsapp' },
                                    { title: 'SMS & Offline Support', icon: '📱', desc: 'Critical reach support', href: '/sms' },
                                    { title: 'Mobile Money Fraud Protection', icon: '💰', desc: 'Fraud protection', href: '/report-fraud' }
                                ].map((service, idx) => (
                                    <Link
                                        key={idx}
                                        href={service.href}
                                        className="block px-4 py-3 hover:bg-[var(--sl-green)]/20 transition-colors rounded-lg cursor-pointer border-b border-white/5 last:border-0"
                                        onClick={() => setIsCapabilitiesDropdownOpen(false)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl">{service.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{service.title}</h4>
                                                <p className="text-xs text-gray-400">{service.desc}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Link href="/about" className="hover:text-[var(--sl-white)] transition-colors duration-300">ABOUT US</Link>
                <Link href="/contact" className="hover:text-[var(--sl-blue)] transition-colors duration-300">CONTACT</Link>

                {/* Sierra Leone Coat of Arms */}
                <img
                    src="/coat-of-arms.png"
                    alt="Sierra Leone Coat of Arms"
                    className="h-12 w-12 object-contain ml-4"
                />

                {isLoggedIn && (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 border border-red-500/50 rounded text-red-400 hover:bg-red-500/10 transition-all duration-300"
                    >
                        LOGOUT
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
            </button>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-black/95 border-b border-gray-800 p-6 flex flex-col gap-4 md:hidden">
                    <Link href="/" className="text-gray-400 hover:text-[var(--sl-green)]" onClick={() => setIsMenuOpen(false)}>HOME</Link>

                    {!isLoggedIn ? (
                        <>
                            <Link href="/login" className="text-gray-400 hover:text-[var(--sl-white)]" onClick={() => setIsMenuOpen(false)}>USER LOGIN</Link>
                            <Link href="/register" className="text-gray-400 hover:text-[var(--sl-blue)]" onClick={() => setIsMenuOpen(false)}>REGISTER</Link>
                            <Link href="/admin/login" className="text-gray-400 hover:text-[var(--sl-green)]" onClick={() => setIsMenuOpen(false)}>ADMIN LOGIN</Link>
                        </>
                    ) : (
                        <>
                            {userRole === 'admin' ? (
                                <Link href="/admin/dashboard" className="text-[var(--sl-green)]" onClick={() => setIsMenuOpen(false)}>ADMIN DASHBOARD</Link>
                            ) : (
                                <Link href="/dashboard" className="text-[var(--sl-green)]" onClick={() => setIsMenuOpen(false)}>DASHBOARD</Link>
                            )}
                            <button onClick={(e) => { handleLogout(e); setIsMenuOpen(false); }} className="text-red-400 text-left">LOGOUT</button>
                        </>
                    )}

                    <Link href="/about" className="text-gray-400 hover:text-[var(--sl-white)]" onClick={() => setIsMenuOpen(false)}>ABOUT US</Link>
                    <Link href="/contact" className="text-gray-400 hover:text-[var(--sl-blue)]" onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                </div>
            )}
        </nav>
    );
}
