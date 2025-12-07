'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import { useRouter } from 'next/navigation';
import { auth } from '../../utils/auth';

export default function ChatHistory() {
    const router = useRouter();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchHistory();
    }, [router]);

    const fetchHistory = async () => {
        try {
            const token = auth.getToken();
            const response = await fetch('http://localhost:5000/api/chat-history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group messages by session ID
    const groupedMessages = messages.reduce((groups, msg) => {
        const sessionId = msg.session_id || 'unknown';
        if (!groups[sessionId]) {
            groups[sessionId] = [];
        }
        groups[sessionId].push(msg);
        return groups;
    }, {});

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 px-8 py-12 max-w-4xl mx-auto w-full">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Chat <span className="sl-text-green">History</span></h1>
                        <p className="text-gray-400">Review your past conversations with the Truth Engine.</p>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading history...</div>
                ) : messages.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
                        <p className="text-gray-400 mb-6">Start a new chat to verify information.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="sl-button px-6 py-3 rounded-xl font-bold"
                        >
                            Start Chat
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(groupedMessages).map(([sessionId, sessionMessages]: [string, any[]]) => (
                            <div key={sessionId} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                                <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
                                    <span className="text-xs font-mono text-gray-500">SESSION: {sessionId}</span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(sessionMessages[0].timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="p-6 space-y-4">
                                    {sessionMessages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                                    ? 'bg-[var(--sl-blue)]/20 border border-[var(--sl-blue)]/50 text-white rounded-br-none'
                                                    : 'bg-white/10 text-gray-300 rounded-bl-none'
                                                }`}>
                                                <p>{msg.message}</p>
                                                <p className="text-[10px] opacity-50 mt-1 text-right">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
