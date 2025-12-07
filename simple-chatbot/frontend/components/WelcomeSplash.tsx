'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function WelcomeSplash({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--sl-green)] rounded-full blur-[150px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--sl-blue)] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Ministry Logo - Top Right */}
            <div className="absolute top-8 right-8 z-20">
                <Image
                    src="/coat-of-arms.png"
                    alt="Sierra Leone Coat of Arms"
                    width={80}
                    height={80}
                    className="opacity-80 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-8 max-w-3xl">

                {/* Hero Image - Smaller Size */}
                <div className="mb-6 relative animate-float">
                    <Image
                        src="/bot-transition.png"
                        alt="Sierra Leone's Truth Engine - The AI-Powered Cyber Watchdog"
                        width={500}
                        height={500}
                        className="mx-auto drop-shadow-[0_0_60px_rgba(30,181,58,0.5)]"
                        priority
                    />
                </div>

                {/* Loading Bar */}
                <div className="w-full max-w-md mx-auto mb-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[var(--sl-green)] to-[var(--sl-blue)] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                <p className="text-sm text-gray-400 animate-pulse">
                    {progress < 100 ? 'Initializing Security Protocols...' : 'System Ready!'}
                </p>

            </div>

            <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
