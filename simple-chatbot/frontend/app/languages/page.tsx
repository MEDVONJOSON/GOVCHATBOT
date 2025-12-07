'use client';

import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function LanguagesPage() {
    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-6 text-5xl">
                    🌐
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Multi-Language Support</h1>
                <p className="text-xl text-gray-400 max-w-2xl mb-12">
                    Our AI is trained to understand and respond in Sierra Leone's major local languages.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl w-full mb-12">
                    {['English', 'Krio', 'Mende', 'Temne'].map((lang) => (
                        <div key={lang} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-[var(--sl-green)]/20 transition-colors">
                            <h3 className="text-2xl font-bold mb-2">{lang}</h3>
                            <p className="text-xs text-gray-400">Fully Supported</p>
                        </div>
                    ))}
                </div>

                <div className="bg-black/40 p-8 rounded-2xl border border-white/10 max-w-2xl">
                    <h3 className="text-xl font-bold mb-4">How to switch languages</h3>
                    <p className="text-gray-300">
                        Simply start typing or speaking in your preferred language. The AI will automatically detect it and respond accordingly.
                        You can also type <span className="text-[var(--sl-green)] font-mono">/lang [language]</span> in the chat to manually switch.
                    </p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
