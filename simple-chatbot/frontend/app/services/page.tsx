'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function Services() {
    const services = [
        {
            title: 'Information Verification',
            icon: '✓',
            description: 'Verify the authenticity of news, messages, and claims against official government databases.',
            color: 'var(--sl-green)',
            features: ['Fact-Check Messages', 'Verify News Articles', 'Check Government Announcements', 'Validate Social Media Claims']
        },
        {
            title: 'Scam Reporting',
            icon: '🚨',
            description: 'Report cyber scams, fraud attempts, and suspicious activities directly to authorities.',
            color: 'var(--sl-blue)',
            features: ['Report Financial Fraud', 'Report Phishing Attempts', 'Report Fake Websites', 'Track Report Status']
        },
        {
            title: 'Misinformation Alerts',
            icon: '🔔',
            description: 'Receive real-time alerts about trending misinformation and official government corrections.',
            color: 'var(--sl-green)',
            features: ['Breaking News Alerts', 'Misinformation Warnings', 'Government Updates', 'Emergency Notifications']
        },
        {
            title: 'Document Authentication',
            icon: '📄',
            description: 'Verify the authenticity of government documents, certificates, and official communications.',
            color: 'var(--sl-white)',
            features: ['Verify Certificates', 'Check Document Validity', 'Authenticate Letters', 'Validate Permits']
        },
        {
            title: 'Rumor Debunking',
            icon: '❌',
            description: 'Get official responses to viral rumors and false information circulating online.',
            color: 'var(--sl-blue)',
            features: ['Check Viral Claims', 'Government Clarifications', 'Myth Busting', 'Official Statements']
        },
        {
            title: 'Cyber Safety Education',
            icon: '🛡️',
            description: 'Learn how to identify scams, protect yourself online, and stay safe from cyber threats.',
            color: 'var(--sl-green)',
            features: ['Safety Tips', 'Scam Recognition', 'Privacy Protection', 'Security Best Practices']
        },
        {
            title: 'AI-Powered Q&A',
            icon: '🤖',
            description: 'Ask questions about government policies, services, and get instant verified answers.',
            color: 'var(--sl-white)',
            features: ['Policy Questions', 'Service Information', 'Legal Queries', '24/7 Assistance']
        },
        {
            title: 'Truth Database',
            icon: '📚',
            description: 'Access a comprehensive database of verified government information and official records.',
            color: 'var(--sl-blue)',
            features: ['Official Policies', 'Government Records', 'Verified Statistics', 'Public Documents']
        },
        {
            title: 'Community Reporting',
            icon: '👥',
            description: 'Contribute to community safety by reporting suspicious content and helping others stay informed.',
            color: 'var(--sl-green)',
            features: ['Report Fake News', 'Flag Suspicious Content', 'Community Alerts', 'Collaborative Verification']
        }
    ];

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            {/* Hero Section */}
            <section className="relative py-20 px-8 text-center bg-gradient-to-b from-black via-black/95 to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sl-green)]/10 to-transparent pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-block px-4 py-2 rounded-full bg-[var(--sl-green)]/10 border border-[var(--sl-green)] text-[var(--sl-green)] text-xs font-bold tracking-widest uppercase mb-6">
                        TRUTH ENGINE SERVICES
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Our <span className="sl-text-green">Services</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-light max-w-2xl mx-auto">
                        Comprehensive tools to fight misinformation, verify facts, and protect citizens from cyber threats.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--sl-green)]/50 transition-all group cursor-pointer"
                        >
                            <div
                                className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center text-3xl"
                                style={{ backgroundColor: `${service.color}20` }}
                            >
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                {service.description}
                            </p>
                            <div className="space-y-2">
                                {service.features.map((feature, fIdx) => (
                                    <div key={fIdx} className="flex items-center gap-2 text-sm text-gray-500">
                                        <span className="text-[var(--sl-green)]">✓</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                            <button
                                className="mt-6 w-full py-3 rounded-xl bg-[var(--sl-green)]/10 border border-[var(--sl-green)]/30 text-[var(--sl-green)] font-bold hover:bg-[var(--sl-green)]/20 transition-all"
                            >
                                USE SERVICE
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white/5 border-y border-white/10">
                <div className="max-w-7xl mx-auto px-8">
                    <h2 className="text-3xl font-bold mb-12 text-center">How the Truth Engine <span className="sl-text-blue">Works</span></h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Submit Query', desc: 'Send a message, link, or claim you want to verify' },
                            { step: '2', title: 'AI Analysis', desc: 'Our AI cross-references official databases and verified sources' },
                            { step: '3', title: 'Instant Results', desc: 'Receive verification status with supporting evidence' },
                            { step: '4', title: 'Take Action', desc: 'Report scams, share verified info, or get more details' }
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Trust Us */}
            <section className="py-20 px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-12 text-center">Why Trust the <span className="sl-text-green">Truth Engine</span>?</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: 'Official Government Source', desc: 'Directly connected to verified government databases and official records', icon: '🏛️' },
                        { title: 'AI-Powered Accuracy', desc: 'Advanced AI technology cross-references multiple trusted sources instantly', icon: '🤖' },
                        { title: 'Real-time Updates', desc: 'Constantly updated with the latest official information and corrections', icon: '⚡' },
                        { title: 'Community Protection', desc: 'Help protect your community by reporting and flagging misinformation', icon: '🛡️' }
                    ].map((benefit, idx) => (
                        <div key={idx} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="text-4xl">{benefit.icon}</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-gray-400 text-sm">{benefit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
