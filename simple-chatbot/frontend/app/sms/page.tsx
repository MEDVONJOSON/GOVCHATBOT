'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function SMSPage() {
    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-6 text-5xl">
                    📱
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">SMS & Offline Support</h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-12">
                    No internet? No problem. Access critical government services via SMS or USSD code.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-xl w-full mx-auto mb-12">
                    <h2 className="text-2xl font-bold mb-6">How to use (USSD)</h2>
                    <div className="text-4xl font-mono text-[var(--sl-blue)] font-bold mb-4 tracking-widest">
                        *468#
                    </div>
                    <p className="text-gray-400">Dial the code above on any mobile network (Orange, Africell, QCell) to access the menu.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-2xl w-full text-left">
                    <div>
                        <h3 className="text-xl font-bold mb-2">SMS Commands</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><strong className="text-white">VERIFY [Message]</strong> - Check news authenticity</li>
                            <li><strong className="text-white">REPORT [Number]</strong> - Report a scam number</li>
                            <li><strong className="text-white">ALERT</strong> - Get latest safety alerts</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Shortcode</h3>
                        <p className="text-4xl font-mono text-white font-bold">4680</p>
                        <p className="text-xs text-gray-500 mt-2">Free on all networks</p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
