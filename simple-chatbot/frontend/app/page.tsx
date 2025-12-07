'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import ChatBox from '../components/ChatBox';
import Footer from '../components/Footer';
import WelcomeSplash from '../components/WelcomeSplash';
import Image from 'next/image';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const handleFeatureClick = (title: string) => {
    if (title === 'Verify Info') {
      router.push('/verify');
    } else if (title === 'AI-Powered Chat') {
      setIsChatOpen(true);
    } else if (title === 'Report Scams') {
      router.push('/report');
    } else if (title === 'Real-time Alerts') {
      router.push('/alerts');
    }
  };

  if (showSplash) {
    return <WelcomeSplash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-white relative overflow-hidden">
      <Navigation />

      {/* Hero Section with Smaller Robot */}
      <section className="relative flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] overflow-hidden">

        {/* Cosmic Galaxy Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
          {/* Nebula clouds */}
          <div className="absolute top-[10%] right-[20%] w-[600px] h-[600px] bg-purple-600 rounded-full blur-[200px] opacity-20 animate-pulse"></div>
          <div className="absolute top-[30%] right-[40%] w-[400px] h-[400px] bg-blue-500 rounded-full blur-[180px] opacity-25 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-[5%] right-[10%] w-[300px] h-[300px] bg-pink-500 rounded-full blur-[150px] opacity-15 animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Bright center glow */}
          <div className="absolute top-[25%] right-[30%] w-[200px] h-[200px] bg-white rounded-full blur-[100px] opacity-30"></div>

          {/* Accent glows */}
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--sl-green)] rounded-full blur-[150px] opacity-10"></div>

          {/* Animated stars */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-8 flex items-center justify-between h-full gap-12">

          {/* Left Side: Title and Description */}
          <div className="flex-1 max-w-2xl space-y-8">

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 rounded-full bg-[var(--sl-green)]/20 border border-[var(--sl-green)] text-[var(--sl-green)] text-xs font-bold tracking-widest uppercase backdrop-blur-sm">
                  OFFICIAL GOV TOOL
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight" style={{ letterSpacing: '0.05em' }}>
                SIERRA LEONE'S <br />
                <span className="sl-gradient-text text-6xl md:text-8xl" style={{ letterSpacing: '0.1em' }}>TRUTH ENGINE</span>
              </h1>

              <p className="text-xl md:text-2xl font-light text-gray-200">
                The AI-Powered Cyber Watchdog
              </p>
            </div>

            <div className="space-y-4 max-w-xl text-gray-300 text-base leading-relaxed backdrop-blur-md bg-black/40 p-6 rounded-2xl border border-white/10">
              <p>
                In an era of digital misinformation, the <strong className="text-[var(--sl-green)]">Government of Sierra Leone</strong> introduces the ultimate tool for truth.
                Verify news, report scams, and stay safe online with our AI-powered assistant.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.push('/verify')}
                className="sl-button px-8 py-3.5 rounded-full font-bold tracking-widest text-sm uppercase shadow-[0_0_30px_rgba(30,181,58,0.6)] hover:shadow-[0_0_40px_rgba(30,181,58,0.8)] transition-all"
              >
                VERIFY INFO
              </button>
              <button
                onClick={() => router.push('/report')}
                className="px-8 py-3.5 rounded-full font-bold tracking-widest text-sm uppercase border-2 border-[var(--sl-blue)] hover:bg-[var(--sl-blue)]/20 text-white transition-all backdrop-blur-sm"
              >
                REPORT SCAM
              </button>
            </div>
          </div>

          {/* Right Side: Robot Image */}
          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="relative w-[1000px] h-[600px]">
              <Image
                src="/robot-new.jpg"
                alt="Sierra Leone Truth Engine Robot"
                fill
                className="object-contain drop-shadow-[0_0_50px_rgba(30,181,58,0.3)]"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Floating Chat Button - Bottom Right Corner */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] shadow-[0_0_30px_rgba(30,181,58,0.6)] hover:shadow-[0_0_50px_rgba(30,181,58,0.8)] transition-all hover:scale-110 flex items-center justify-center group"
        aria-label="Open Chat"
      >
        <span className="text-3xl">🤖</span>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
      </button>

      {/* Slide-in Chat Widget */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-gradient-to-br from-[var(--sl-green)]/5 via-[var(--sl-blue)]/5 to-gray-900/50 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 ease-in-out z-50 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-[var(--sl-green)]/20 to-[var(--sl-blue)]/20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--sl-green)] to-[var(--sl-blue)] flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-white">Truth Engine</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(100%-64px)] overflow-hidden">
          <ChatBox />
        </div>
      </div>

      {/* About / Mission Section */}
      <section className="py-20 bg-black/30 border-t border-white/5 z-10 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why the <span className="sl-text-green">Truth Engine</span>?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Misinformation spreads faster than truth. We are changing that.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--sl-green)] transition-colors">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--sl-green)]/20 flex items-center justify-center text-[var(--sl-green)]">!</span>
                  The Problem
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Viral WhatsApp messages about new laws or health warnings often lack verification.
                  Citizens are left confused, and cyber scams go unreported due to a lack of easy channels.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--sl-blue)] transition-colors">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[var(--sl-blue)]/20 flex items-center justify-center text-[var(--sl-blue)]">✓</span>
                  The Solution
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A centralized "Cyber Watchdog" accessible to every citizen.
                  Instantly verify rumors against official government databases and report financial fraud in real-time.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-[var(--sl-green)]/10 to-[var(--sl-blue)]/10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--sl-green)]/20 to-[var(--sl-blue)]/20"></div>

              {/* Robot Image */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <Image
                  src="/robot-new.jpg"
                  alt="Truth Engine Robot"
                  width={300}
                  height={300}
                  className="object-contain"
                />
              </div>

              {/* Content Overlay */}
              <div className="relative text-center p-8 z-10">
                <p className="text-6xl font-bold text-white/20 mb-4">100%</p>
                <p className="text-2xl font-bold text-white mb-3">Official Verification</p>
                <p className="text-sm text-gray-300 max-w-md mx-auto">Directly connected to Ministry databases.</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-[var(--sl-green)] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[var(--sl-green)] font-bold">LIVE CONNECTION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 z-10 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI-Powered <span className="sl-text-blue">Services</span></h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Verify Info', desc: 'Paste any message or news to check its authenticity instantly against official sources.', color: 'var(--sl-green)', icon: '✓' },
              { title: 'Report Scams', desc: 'Securely report cyber threats and financial fraud directly to authorities.', color: 'var(--sl-white)', icon: '🚨' },
              { title: 'Real-time Alerts', desc: 'Receive urgent government notifications and safety warnings instantly.', color: 'var(--sl-blue)', icon: '🔔' },
              { title: 'AI-Powered Chat', desc: 'Get instant answers to government-related questions 24/7 with our intelligent assistant.', color: 'var(--sl-green)', icon: '🤖' },
              { title: 'Document Verification', desc: 'Verify the authenticity of government documents and official communications.', color: 'var(--sl-blue)', icon: '📄' },
              { title: 'Multi-Language Support', desc: 'Access services in multiple local languages for better accessibility.', color: 'var(--sl-white)', icon: '🌐' },
              { title: 'WhatsApp Integration', desc: 'Full platform access: Verify news, report scams with evidence upload (photos/voice), and receive alerts.', color: 'var(--sl-green)', icon: '💬' },
              { title: 'SMS & Offline Support', desc: 'Critical reach for reliable access. Receive emergency alerts and report incidents via SMS without internet.', color: 'var(--sl-blue)', icon: '📱' },
              { title: 'Mobile Money Fraud Protection', desc: 'Specialized reporting for Orange/Africell Money scams with real-time verification and automated alerts.', color: 'var(--sl-white)', icon: '💰' }
            ].map((feature, idx) => (
              <div
                key={idx}
                onClick={() => handleFeatureClick(feature.title)}
                className={`p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--sl-green)]/50 transition-all group ${['Verify Info', 'Report Scams', 'AI-Powered Chat'].includes(feature.title) ? 'cursor-pointer hover:scale-105' : ''
                  }`}
              >
                <div className="w-14 h-14 rounded-xl mb-6 flex items-center justify-center text-2xl" style={{ backgroundColor: `${feature.color}20` }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </main>
  );
}
