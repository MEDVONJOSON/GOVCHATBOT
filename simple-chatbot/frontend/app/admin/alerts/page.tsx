'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import { auth } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminAlerts() {
    const router = useRouter();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [newAlert, setNewAlert] = useState({ title: '', message: '', type: 'info' });

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/alerts'); // Public endpoint
            const data = await response.json();
            setAlerts(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching alerts:', error);
            setLoading(false);
        }
    };

    const handleSendAlert = async (e) => {
        e.preventDefault();
        setSending(true);

        try {
            const token = auth.getToken();
            const response = await fetch('http://localhost:5000/api/alerts/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAlert)
            });

            if (response.ok) {
                alert('Alert broadcasted successfully!');
                setNewAlert({ title: '', message: '', type: 'info' });
                fetchAlerts();
            } else {
                alert('Failed to send alert.');
            }
        } catch (error) {
            console.error('Error sending alert:', error);
            alert('Error sending alert.');
        } finally {
            setSending(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">System Alerts</h1>
                <p className="text-gray-400">Broadcast important notifications to all citizens</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Send Alert Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span>📣</span> Broadcast New Alert
                        </h2>

                        <form onSubmit={handleSendAlert} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newAlert.title}
                                    onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--sl-green)] outline-none"
                                    placeholder="e.g. Heavy Rain Warning"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                                <textarea
                                    value={newAlert.message}
                                    onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--sl-green)] outline-none h-32 resize-none"
                                    placeholder="Enter alert details..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Alert Type</label>
                                <select
                                    value={newAlert.type}
                                    onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-[var(--sl-green)] outline-none"
                                >
                                    <option value="info">ℹ️ Information</option>
                                    <option value="warning">⚠️ Warning</option>
                                    <option value="emergency">🚨 Emergency</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${sending ? 'bg-gray-600 cursor-not-allowed' : 'bg-[var(--sl-blue)] hover:bg-[var(--sl-blue)]/80 text-white'
                                    }`}
                            >
                                {sending ? 'Broadcasting...' : 'Broadcast Alert'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Active Alerts List */}
                <div className="lg:col-span-2">
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6">
                        <h2 className="text-xl font-bold mb-4">Active Alerts History</h2>

                        {loading ? (
                            <p className="text-gray-500 text-center py-8">Loading alerts...</p>
                        ) : alerts.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No active alerts</p>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
                                        <div className={`text-2xl p-3 rounded-lg h-fit ${alert.type === 'emergency' ? 'bg-red-500/20 text-red-500' :
                                                alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    'bg-blue-500/20 text-blue-500'
                                            }`}>
                                            {alert.type === 'emergency' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg">{alert.title}</h3>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(alert.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">{alert.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
