'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            {/* Hero Section with Chat Image */}
            <section className="relative py-20 px-8 overflow-hidden bg-gradient-to-b from-black via-black/95 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sl-blue)]/10 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left: Content */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Contact <span className="sl-text-blue">Us</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-light">
                            We're here to help. Reach out to the Government of Sierra Leone.
                        </p>
                    </div>

                    {/* Right: Chat Image */}
                    <div className="relative h-[400px] rounded-2xl overflow-hidden border border-[var(--sl-blue)]/20">
                        <Image
                            src="/contact-chat.jpg"
                            alt="Contact Government of Sierra Leone"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

                {/* Contact Form */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                placeholder="Your full name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400">Subject</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all"
                                placeholder="What is this about?"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-400">Message</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows={5}
                                className="w-full p-3 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-[var(--sl-green)] text-white transition-all resize-none"
                                placeholder="Your message..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="sl-button w-full py-3 rounded-xl font-bold tracking-widest text-sm uppercase"
                        >
                            {submitted ? 'Message Sent!' : 'Send Message'}
                        </button>
                    </form>
                </div>

                {/* Contact Info */}
                <div className="space-y-8">
                    <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>

                    <div className="space-y-6">
                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="font-bold mb-2 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-[var(--sl-green)]/20 flex items-center justify-center text-[var(--sl-green)]">📍</span>
                                Main Office
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Ministry of Information and Communications<br />
                                Freetown, Sierra Leone
                            </p>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="font-bold mb-2 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-[var(--sl-blue)]/20 flex items-center justify-center text-[var(--sl-blue)]">📧</span>
                                Email
                            </h3>
                            <p className="text-gray-400 text-sm">
                                General Inquiries: info@gov.sl<br />
                                Cyber Threats: security@gov.sl
                            </p>
                        </div>

                        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                            <h3 className="font-bold mb-2 flex items-center gap-3">
                                <span className="w-10 h-10 rounded-full bg-[var(--sl-green)]/20 flex items-center justify-center text-[var(--sl-green)]">📞</span>
                                Phone
                            </h3>
                            <p className="text-gray-400 text-sm">
                                Hotline: +232 76 000 000<br />
                                Office: +232 22 123 456
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Department Directory */}
            <section className="py-20 bg-white/5 border-y border-white/10">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">Department Directory</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { dept: 'Cyber Security', contact: 'cybersec@gov.sl' },
                            { dept: 'Public Relations', contact: 'pr@gov.sl' },
                            { dept: 'Technical Support', contact: 'support@gov.sl' },
                            { dept: 'Legal Affairs', contact: 'legal@gov.sl' },
                            { dept: 'Data Protection', contact: 'privacy@gov.sl' },
                            { dept: 'Emergency Response', contact: 'emergency@gov.sl' }
                        ].map((item, idx) => (
                            <div key={idx} className="p-6 bg-black/40 rounded-xl border border-white/10 hover:border-[var(--sl-green)] transition-colors">
                                <h3 className="font-bold mb-2">{item.dept}</h3>
                                <p className="text-sm text-gray-500">{item.contact}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
