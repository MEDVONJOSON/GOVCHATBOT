'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/navigation';
import { auth } from '../../../utils/auth';

export default function ReportManagement() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!auth.isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        const user = auth.getUser();
        if (user?.role !== 'admin') {
            router.push('/');
            return;
        }
        fetchReports();
    }, [router, filter]);

    const fetchReports = async () => {
        try {
            const token = auth.getToken();
            let url = 'http://localhost:5000/api/reports';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setReports(data.reports || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (reportId: number, newStatus: string, newPriority: string) => {
        try {
            const token = auth.getToken();
            await fetch(`http://localhost:5000/api/reports/${reportId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, priority: newPriority })
            });
            fetchReports();
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative">
            <Navigation />

            <div className="flex-1 px-8 py-12 max-w-7xl mx-auto w-full">

                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Scam <span className="text-red-500">Reports</span></h1>
                        <p className="text-gray-400">Review and manage reported threats.</p>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm"
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                    {['all', 'pending', 'investigating', 'resolved'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-all ${filter === status
                                ? 'bg-[var(--sl-blue)] text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading reports...</div>
                ) : reports.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <div className="text-4xl mb-4">✅</div>
                        <h3 className="text-xl font-bold mb-2">No reports found</h3>
                        <p className="text-gray-400">There are no reports matching the selected filter.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {reports.map((report: any) => (
                            <div key={report.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${report.report_type === 'phishing' ? 'bg-blue-500/20 text-blue-500' :
                                            report.report_type === 'fraud' ? 'bg-red-500/20 text-red-500' :
                                                'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                            {report.report_type === 'phishing' ? '🎣' : report.report_type === 'fraud' ? '💰' : '⚠️'}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold capitalize">{report.report_type}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${report.status === 'pending' ? 'bg-red-500/20 text-red-500' :
                                                    report.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-500' :
                                                        'bg-green-500/20 text-green-500'
                                                    }`}>
                                                    {report.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                Reported by <span className="text-white">{report.full_name || 'Unknown'}</span> on {new Date(report.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {report.status !== 'investigating' && report.status !== 'resolved' && (
                                            <button
                                                onClick={() => updateStatus(report.id, 'investigating', 'high')}
                                                className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-500 hover:bg-yellow-500/20 transition-all text-sm font-bold"
                                            >
                                                Investigate
                                            </button>
                                        )}
                                        {report.status !== 'resolved' && (
                                            <button
                                                onClick={() => updateStatus(report.id, 'resolved', 'low')}
                                                className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-xl text-green-500 hover:bg-green-500/20 transition-all text-sm font-bold"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-black/20 rounded-xl p-4 mb-4">
                                    <p className="text-gray-300 text-sm leading-relaxed">{report.description}</p>
                                </div>

                                {report.evidence_url && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="text-xs text-gray-500 font-bold uppercase mb-2">Evidence / Links</p>
                                        <div className="space-y-1">
                                            {report.evidence_url.split(',').map((url: string, index: number) => {
                                                const trimmedUrl = url.trim();
                                                if (!trimmedUrl) return null;
                                                return (
                                                    <div key={index} className="flex items-center gap-2 text-sm text-[var(--sl-blue)]">
                                                        <span>🔗</span>
                                                        <a
                                                            href={trimmedUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="hover:text-blue-300 hover:underline truncate max-w-full block"
                                                        >
                                                            {trimmedUrl.split('/').pop() || trimmedUrl}
                                                        </a>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <Footer />
        </main>
    );
}
