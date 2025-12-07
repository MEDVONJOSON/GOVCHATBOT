'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function AlertsPage() {
    const [subscriptions, setSubscriptions] = useState({
        emergency_enabled: true,
        government_notices_enabled: true,
        cybersecurity_enabled: true,
        public_safety_enabled: true,
        general_updates_enabled: false,
        whatsapp_enabled: false,
        sms_enabled: false,
        email_enabled: true,
        inapp_enabled: true,
        phone_number: '',
        email: ''
    });

    const [alerts, setAlerts] = useState([]);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        loadSubscriptions();
        loadAlerts();
    }, []);

    const loadSubscriptions = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:5000/api/alerts/subscriptions/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.subscriptions) {
                setSubscriptions(data.subscriptions);
            }
        } catch (error) {
            console.error('Load subscriptions error:', error);
        }
    };

    const loadAlerts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/alerts?limit=10');
            const data = await response.json();
            setAlerts(data.alerts || []);
        } catch (error) {
            console.error('Load alerts error:', error);
        }
    };

    const handleToggle = (field: string) => {
        setSubscriptions({ ...subscriptions, [field]: !subscriptions[field] });
    };

    const handleInputChange = (e: any) => {
        setSubscriptions({ ...subscriptions, [e.target.name]: e.target.value });
    };

    const saveSubscriptions = async () => {
        setLoading(true);
        setSaveSuccess(false);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login to save preferences');
                return;
            }

            const response = await fetch('http://localhost:5000/api/alerts/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(subscriptions)
            });

            if (response.ok) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Save error:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'border-red-500 bg-red-900/20';
            case 'high': return 'border-yellow-500 bg-yellow-900/20';
            case 'medium': return 'border-blue-500 bg-blue-900/20';
            default: return 'border-gray-500 bg-gray-900/20';
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return '🔴';
            case 'high': return '⚠️';
            case 'medium': return '🔵';
            default: return 'ℹ️';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'emergency': return '🔥';
            case 'government_notices': return '🏛️';
            case 'cybersecurity': return '🛡️';
            case 'public_safety': return '🚨';
            case 'general_updates': return '💡';
            default: return '📢';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (selectedAlert) {
        return (
            <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
                <Navigation />
                <div className="flex-1 px-4 md:px-8 py-12 max-w-4xl mx-auto w-full">
                    <button
                        onClick={() => setSelectedAlert(null)}
                        className="mb-6 text-[var(--sl-blue)] hover:text-white transition-colors flex items-center gap-2"
                    >
                        ← Back to Alerts
                    </button>

                    <div className={`rounded-2xl p-8 border-2 ${getSeverityColor(selectedAlert.severity)}`}>
                        <div className="flex items-start gap-4 mb-6">
                            <div className="text-4xl">{getSeverityIcon(selectedAlert.severity)}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-bold text-red-400 uppercase tracking-widest">
                                        {selectedAlert.category.replace('_', ' ')}
                                    </span>
                                    <span className="text-sm text-gray-500">ALERT</span>
                                </div>
                                <h1 className="text-3xl font-bold mb-4">{selectedAlert.title}</h1>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Issued by:</p>
                                <p className="text-lg text-[var(--sl-green)]">{selectedAlert.issued_by || 'Government of Sierra Leone'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Time:</p>
                                <p className="text-lg">{formatDate(selectedAlert.created_at)}</p>
                            </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-6 mb-6">
                            <p className="text-lg leading-relaxed">{selectedAlert.message}</p>
                        </div>

                        <div className="flex gap-4">
                            <button className="px-6 py-3 bg-[var(--sl-blue)] hover:bg-[var(--sl-blue)]/80 rounded-lg font-bold transition-all">
                                📤 Share
                            </button>
                            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold transition-all">
                                💾 Save
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />

            <div className="flex-1 px-4 md:px-8 py-12 max-w-6xl mx-auto w-full">

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        🔔 Real-time <span className="sl-gradient-text">Alerts</span>
                    </h1>
                    <p className="text-xl text-gray-400">
                        Get instant notifications about government updates, safety warnings, and urgent alerts.
                    </p>
                </div>

                {saveSuccess && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-center animate-fade-in-up">
                        ✅ Preferences saved successfully!
                    </div>
                )}

                {/* Alert Subscriptions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-8">
                    <h2 className="text-2xl font-bold mb-6">📢 Alert Category Toggles</h2>

                    <div className="space-y-4">
                        {[
                            { key: 'emergency_enabled', icon: '🔥', title: 'Emergency Alerts', desc: 'Natural disasters, security threats, critical warnings' },
                            { key: 'government_notices_enabled', icon: '🏛️', title: 'Government Notices', desc: 'Official statements, policy updates, new regulations' },
                            { key: 'cybersecurity_enabled', icon: '🛡️', title: 'Cybersecurity Alerts', desc: 'New scams, hacking attempts, data breach warnings' },
                            { key: 'public_safety_enabled', icon: '🚨', title: 'Public Safety', desc: 'Road closures, protests, unrest, fire incidents' },
                            { key: 'general_updates_enabled', icon: '💡', title: 'General Updates', desc: 'Public holidays, service interruptions, electricity/water updates' }
                        ].map((cat) => (
                            <div key={cat.key} className="flex items-center justify-between p-4 bg-black/30 rounded-xl hover:bg-black/40 transition-colors">
                                <div className="flex items-center gap-4 flex-1">
                                    <span className="text-3xl">{cat.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-lg">{cat.title}</h3>
                                        <p className="text-sm text-gray-400">{cat.desc}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggle(cat.key)}
                                    className={`px-6 py-2 rounded-full font-bold transition-all ${subscriptions[cat.key as keyof typeof subscriptions]
                                            ? 'bg-[var(--sl-green)] text-white'
                                            : 'bg-gray-700 text-gray-400'
                                        }`}
                                >
                                    {subscriptions[cat.key as keyof typeof subscriptions] ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notification Methods */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm mb-8">
                    <h2 className="text-2xl font-bold mb-6">📱 Notification Methods</h2>
                    <p className="text-gray-400 mb-6">Select how you want to receive alerts:</p>

                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {[
                            { key: 'whatsapp_enabled', icon: '📱', label: 'WhatsApp' },
                            { key: 'sms_enabled', icon: '💬', label: 'SMS' },
                            { key: 'email_enabled', icon: '📧', label: 'Email' },
                            { key: 'inapp_enabled', icon: '🔔', label: 'In-app notification' }
                        ].map((method) => (
                            <label key={method.key} className="flex items-center gap-3 p-4 bg-black/30 rounded-xl cursor-pointer hover:bg-black/40 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={subscriptions[method.key as keyof typeof subscriptions] as boolean}
                                    onChange={() => handleToggle(method.key)}
                                    className="w-5 h-5 rounded bg-black/40 border border-white/10"
                                />
                                <span className="text-2xl">{method.icon}</span>
                                <span className="font-bold">{method.label}</span>
                            </label>
                        ))}
                    </div>

                    {(subscriptions.whatsapp_enabled || subscriptions.sms_enabled) && (
                        <div className="bg-black/40 rounded-xl p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Phone Number: +232 ___ ___ ___</label>
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={subscriptions.phone_number}
                                    onChange={handleInputChange}
                                    placeholder="+232 76 123 456"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--sl-blue)] transition-all"
                                />
                            </div>
                            <button className="px-6 py-2 bg-[var(--sl-blue)] hover:bg-[var(--sl-blue)]/80 rounded-lg font-bold transition-all">
                                [ Connect WhatsApp ]
                            </button>
                        </div>
                    )}

                    <button
                        onClick={saveSubscriptions}
                        disabled={loading}
                        className="mt-6 w-full bg-gradient-to-r from-[var(--sl-green)] to-[var(--sl-blue)] hover:shadow-[0_0_30px_rgba(30,181,58,0.4)] text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : '💾 Save Preferences'}
                    </button>
                </div>

                {/* Recent Alerts Feed */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold mb-6">📰 Recent Alerts Feed</h2>
                    <p className="text-gray-400 mb-6">A modern feed showing the latest updates in real time.</p>

                    <div className="space-y-4">
                        {alerts.map((alert: any) => (
                            <div
                                key={alert.id}
                                className={`p-6 rounded-xl border-l-4 ${getSeverityColor(alert.severity)} hover:scale-[1.02] transition-all cursor-pointer`}
                                onClick={() => setSelectedAlert(alert)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl">{getCategoryIcon(alert.category)}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{alert.title}</h3>
                                        <p className="text-sm text-gray-400 mb-3">
                                            Date: {formatDate(alert.created_at)}
                                        </p>
                                        <p className="text-gray-300 line-clamp-2">{alert.message}</p>
                                        <button className="mt-3 text-[var(--sl-blue)] hover:text-white transition-colors text-sm font-bold">
                                            [ View Details ]
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {alerts.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-6xl mb-4 opacity-20">🔔</div>
                                <p>No alerts at this time</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}
