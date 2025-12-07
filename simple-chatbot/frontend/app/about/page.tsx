'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import Image from 'next/image';

export default function About() {
    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            {/* Hero Section with Image */}
            <section className="relative py-20 px-8 overflow-hidden bg-gradient-to-b from-black via-black/95 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--sl-green)]/5 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Left: Image */}
                    <div className="relative h-[500px] rounded-2xl overflow-hidden border border-[var(--sl-green)]/20 bg-white">
                        <Image
                            src="/about-flayer.jpg"
                            alt="Sierra Leone Truth Engine"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-2 rounded-full bg-[var(--sl-green)]/10 border border-[var(--sl-green)] text-[var(--sl-green)] text-xs font-bold tracking-widest uppercase mb-4">
                            HELLO & WELCOME
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            SIERRA LEONE<br />
                            <span className="sl-gradient-text">GOV CHATBOT</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-light leading-relaxed">
                            Your intelligent assistant for government services and information. Powered by advanced AI to serve you better.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Empowering the citizens of Sierra Leone with accurate, verified information through cutting-edge artificial intelligence technology.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-[var(--sl-green)]">Our Mission</h2>
                    <p className="text-gray-400 leading-relaxed">
                        To create a digital ecosystem where every citizen has instant access to verified government information.
                        We aim to dismantle misinformation networks and protect our people from cyber threats through advanced AI technology.
                    </p>
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-[var(--sl-blue)]">Our Vision</h2>
                    <p className="text-gray-400 leading-relaxed">
                        A Sierra Leone where truth prevails over rumors, and digital safety is a fundamental right.
                        We envision a future where technology bridges the gap between the government and the people.
                    </p>
                </div>
            </section>

            {/* Leadership / Ministry */}
            <section className="py-20 bg-white/5 border-y border-white/10">
                <div className="max-w-7xl mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold mb-12">Powered By</h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center">

                        {/* State House */}
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-[var(--sl-blue)] transition-colors group">
                            <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                                <Image src="/images/ministries/state_house.jpg" alt="State House" fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Office of the President</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                The executive branch leading the nation's strategic direction, policy-making, and overall governance.
                            </p>
                        </div>

                        {/* Ministry of Information */}
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-[var(--sl-green)] transition-colors group">
                            <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                                <Image src="/images/ministries/min_info.jpg" alt="Ministry of Information" fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Ministry of Information</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Official source of verified government news and promoting civic engagement strategies across the nation.
                            </p>
                        </div>

                        {/* MoCTI */}
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-[var(--sl-blue)] transition-colors group">
                            <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                                <Image src="/images/ministries/min_tech.jpg" alt="MoCTI" fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Ministry of Technology</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Driving Sierra Leone's digital transformation, technological innovation, and connectivity infrastructure.
                            </p>
                        </div>

                        {/* Ministry of Health */}
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-[var(--sl-green)] transition-colors group">
                            <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                                <Image src="/images/ministries/min_health.jpg" alt="Ministry of Health" fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Ministry of Health</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Dedicated to ensuring public health safety, disease prevention, and providing reliable medical information.
                            </p>
                        </div>

                        {/* Ministry of Sports */}
                        <div className="p-6 bg-black/40 rounded-2xl border border-white/10 hover:border-[var(--sl-blue)] transition-colors group">
                            <div className="w-24 h-24 mx-auto mb-6 relative rounded-full overflow-hidden border-2 border-white/20 group-hover:scale-110 transition-transform">
                                <Image src="/images/ministries/min_sports.jpg" alt="Ministry of Sports" fill className="object-cover" />
                            </div>
                            <h3 className="text-lg font-bold mb-3 text-white">Ministry of Sports</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Fostering national unity and youth development through the promotion of sports and athletic excellence.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
