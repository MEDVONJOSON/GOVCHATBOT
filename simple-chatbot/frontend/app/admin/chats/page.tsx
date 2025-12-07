'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { auth } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminChats() {
    const router = useRouter();
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const token = auth.getToken();
            const response = await fetch('http://localhost:5000/api/chat-history/all?limit=100', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setChats(data.messages || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching chats:', error);
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Chat History</h1>
                <p className="text-gray-400">Monitor system interactions (Last 100 messages)</p>
            </div>

            <div className="bg-black/20 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-left">
                                <th className="p-4 text-gray-400 font-medium">Time</th>
                                <th className="p-4 text-gray-400 font-medium">User</th>
                                <th className="p-4 text-gray-400 font-medium">Sender</th>
                                <th className="p-4 text-gray-400 font-medium">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">Loading chats...</td>
                                </tr>
                            ) : chats.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No chat history found</td>
                                </tr>
                            ) : (
                                chats.map((chat) => (
                                    <tr key={chat.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm text-gray-400">
                                            {new Date(chat.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-white">
                                                {chat.full_name || 'Guest User'}
                                            </div>
                                            <div className="text-xs text-gray-500">{chat.email || 'No email'}</div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs border ${chat.sender === 'user'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {chat.sender?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300 max-w-md truncate">
                                            {chat.message}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
