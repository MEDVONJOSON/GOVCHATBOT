import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="py-12 border-t border-white/10 bg-black z-10 relative">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-12">
                <div className="col-span-2">
                    <div className="text-2xl font-bold tracking-widest text-white flex items-center gap-2 mb-6">
                        <div className="flex flex-col h-6 w-8 rounded overflow-hidden border border-white/20">
                            <div className="h-2 w-full bg-[var(--sl-green)]"></div>
                            <div className="h-2 w-full bg-[var(--sl-white)]"></div>
                            <div className="h-2 w-full bg-[var(--sl-blue)]"></div>
                        </div>
                        <span>GOV<span className="sl-text-green">CHAT</span></span>
                    </div>
                    <p className="text-gray-500 text-sm max-w-sm">
                        The official AI-powered communication channel for the Government of Sierra Leone. Promoting transparency and digital safety.
                    </p>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-white">Quick Links</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li><Link href="/" className="hover:text-[var(--sl-green)] transition-colors">Home</Link></li>
                        <li><Link href="/about" className="hover:text-[var(--sl-green)] transition-colors">About Us</Link></li>
                        <li><Link href="/login" className="hover:text-[var(--sl-green)] transition-colors">User Login</Link></li>
                        <li><Link href="/contact" className="hover:text-[var(--sl-green)] transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-6 text-white">Contact</h4>
                    <ul className="space-y-3 text-sm text-gray-500">
                        <li>Freetown, Sierra Leone</li>
                        <li>info@gov.sl</li>
                        <li>+232 76 000 000</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-8 mt-12 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
                © 2024 Government of Sierra Leone. All rights reserved.
            </div>
        </footer>
    );
}
