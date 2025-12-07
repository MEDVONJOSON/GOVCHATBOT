'use client';

import { useState, useRef } from 'react';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';

export default function VerifyPage() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVerify = async () => {
        if (!input.trim() && !selectedImage) return;

        setIsLoading(true);
        setResult(null);

        try {
            let imageUrl = null;

            // 1. Upload Image first if selected
            if (selectedImage) {
                const formData = new FormData();
                formData.append('file', selectedImage);

                const uploadRes = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    imageUrl = uploadData.file.path; // Or url depending on backend response
                }
            }

            // 2. Verify Content
            const response = await fetch('http://localhost:5000/api/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    image: imageUrl
                }),
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Verification error:', error);
            setResult({
                status: 'unverified',
                color: 'yellow',
                message: 'Unable to connect to verification service.',
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

                    {/* Header Section */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            Verify <span className="sl-gradient-text">Information</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Paste any message, news, or claim to instantly check its authenticity against official government records.
                        </p>
                    </div>

                    {/* Input Section */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Paste your message here... (e.g., 'Is it true that passport fees have increased?')"
                            className="w-full h-40 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--sl-green)] transition-all resize-none mb-6"
                        />

                        {/* Upload Section */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center mb-8 transition-colors cursor-pointer group relative overflow-hidden ${imagePreview ? 'border-[var(--sl-green)]' : 'border-white/10 hover:border-[var(--sl-blue)]/50'}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {imagePreview ? (
                                <div className="relative z-10">
                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-lg" />
                                    <p className="mt-2 text-sm text-[var(--sl-green)]">Click to change image</p>
                                </div>
                            ) : (
                                <>
                                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</div>
                                    <p className="text-sm text-gray-400">Drop a screenshot or click to upload image</p>
                                </>
                            )}
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleVerify}
                            disabled={isLoading || (!input.trim() && !selectedImage)}
                            className={`w-full py-4 rounded-xl font-bold text-lg tracking-widest uppercase transition-all ${isLoading
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[var(--sl-green)] to-[var(--sl-blue)] hover:shadow-[0_0_30px_rgba(30,181,58,0.4)] hover:scale-[1.02]'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Verifying...
                                </span>
                            ) : (
                                'Verify Now'
                            )}
                        </button>
                    </div>

                    {/* Output Section (unchanged) */}
                    {result && (
                        <div className={`rounded-3xl p-8 border animate-fade-in-up ${result.color === 'green' ? 'bg-green-900/20 border-green-500/50' :
                            result.color === 'red' ? 'bg-red-900/20 border-red-500/50' :
                                'bg-yellow-900/20 border-yellow-500/50'
                            }`}>
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${result.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                    result.color === 'red' ? 'bg-red-500/20 text-red-400' :
                                        'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {result.color === 'green' ? '✓' : result.color === 'red' ? '✕' : '⚠'}
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-2xl font-bold ${result.color === 'green' ? 'text-green-400' :
                                        result.color === 'red' ? 'text-red-400' :
                                            'text-yellow-400'
                                        }`}>
                                        {result.status === 'true' ? 'Verified as True' :
                                            result.status === 'false' ? 'False or Misleading' :
                                                'Unverified Information'}
                                    </h3>

                                    <p className="text-lg text-gray-200 leading-relaxed">
                                        {result.message}
                                    </p>

                                    {result.official_source && (
                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mb-1">Official Source</p>
                                            <p className="text-sm text-[var(--sl-blue)]">{result.official_source}</p>
                                        </div>
                                    )}
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
