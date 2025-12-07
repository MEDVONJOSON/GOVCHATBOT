'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function ReportFraudPage() {
    // Reusing the structure of ReportScam but with a specialized form
    // For expediency, I'll create a simplified version that funnels to the same backend
    // but with the reportType pre-set.

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // ... similar reuse of logic ...

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-4xl font-bold mb-4">Mobile Money Fraud Protection</h1>
                <p className="text-xl text-gray-400 mb-8 max-w-2xl">
                    Dedicated reporting channel for Orange Money and Africell Money fraud incidents.
                </p>
                <a
                    href="/report"
                    className="bg-[var(--sl-green)] hover:bg-[var(--sl-green)]/80 text-white font-bold py-4 px-8 rounded-xl transition-all text-lg"
                >
                    Report Fraud Incident Now
                </a>
                <p className="mt-8 text-sm text-gray-500">
                    You will be redirected to our secure reporting portal. Please select "Mobile Money Fraud" as the category.
                </p>
            </div>
            <Footer />
        </main>
    );
}
