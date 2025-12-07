'use client';

import { useState, useRef } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function VerifyDocumentPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleVerify = async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setResult(null);

        try {
            // Simulate verification for now or implement real logic
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Upload the document
            const uploadRes = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadRes.ok) throw new Error('Upload failed');

            // In a real app, we'd send the path to a document verification API
            // For now, mock a response after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            setResult({
                status: 'pending',
                color: 'yellow',
                message: 'Document received and under review. Reference ID: DOC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                official_source: 'Ministry of Information'
            });

        } catch (error) {
            console.error('Verification error:', error);
            setResult({
                status: 'error',
                color: 'red',
                message: 'Unable to process document. Please try again.',
                official_source: null
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col bg-[var(--background)] text-white">
            <Navigation />

            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="max-w-3xl w-full space-y-8">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Document <span className="sl-gradient-text">Verification</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Upload official government documents to verify their authenticity.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 text-center mb-8 transition-colors cursor-pointer hover:border-[var(--sl-blue)]/50 ${selectedFile ? 'border-[var(--sl-green)]' : 'border-white/10'}`}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileSelect}
                            />
                            <div className="text-5xl mb-4">📄</div>
                            {selectedFile ? (
                                <div>
                                    <p className="text-lg font-bold text-white">{selectedFile.name}</p>
                                    <p className="text-sm text-[var(--sl-green)] mt-2">Click to change file</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-lg text-gray-300 font-bold mb-2">Click to Upload Document</p>
                                    <p className="text-sm text-gray-500">Supports PDF, JPG, PNG</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isLoading || !selectedFile}
                            className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-all ${isLoading || !selectedFile
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[var(--sl-green)] to-[var(--sl-blue)] hover:shadow-[0_0_30px_rgba(30,181,58,0.4)]'
                                }`}
                        >
                            {isLoading ? 'Processing...' : 'Verify Document'}
                        </button>
                    </div>

                    {result && (
                        <div className={`rounded-3xl p-8 border animate-fade-in-up ${result.color === 'yellow' ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-red-900/20 border-red-500/50'}`}>
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">{result.color === 'yellow' ? '⏳' : '⚠️'}</span>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">{result.status === 'pending' ? 'Verification Pending' : 'Error'}</h3>
                                    <p className="text-lg text-gray-200">{result.message}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
