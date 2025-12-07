'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function WhatsAppPage() {
    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 text-5xl">
                    💬
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">WhatsApp Integration</h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-12">
                    Access all Government AI services directly through WhatsApp.
                    Verify news, report scams, and get instant answers without leaving your favorite chat app.
                </p>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl w-full text-left mb-12">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2 text-green-400">Verify Info</h3>
                        <p className="text-sm text-gray-400">Forward any message to our bot to check its authenticity instantly.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2 text-green-400">Report Scams</h3>
                        <p className="text-sm text-gray-400">Send screenshots of suspicious chats or numbers to report them.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h3 className="text-xl font-bold mb-2 text-green-400">Voice Support</h3>
                        <p className="text-sm text-gray-400">Send voice notes in Krio, Mende, or Temne for instant assistance.</p>
                    </div>
                </div>

                <a
                    href="https://wa.me/23200000000" // Replace with actual number
                    target="_blank"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-12 rounded-full transition-all text-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] flex items-center gap-3"
                >
                    <span>Start Chatting</span>
                    <span>→</span>
                </a>
            </div>
            <Footer />
        </main>
    );
}
