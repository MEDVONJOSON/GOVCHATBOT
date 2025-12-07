import React, { useState, useEffect, useRef } from 'react';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [activeMode, setActiveMode] = useState('chat'); // chat, research, thinking, shopping, image

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const currentMode = activeMode;

        // Reset mode after sending unless it's a persistent mode? 
        // For now, let's keep it per message or reset. Resetting feels safer for general chat.
        // Actually, user might want to stay in "Research" mode. Let's keep it until changed or explicitly handle.
        // But for "image", it's usually a one-off.
        if (currentMode === 'image') setActiveMode('chat');

        const userMessage = { role: 'user', content: input, mode: currentMode };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: input, mode: currentMode }),
            });

            const data = await response.json();
            const botMessage = { role: 'assistant', content: data.message || data.response || "No response" };

            setMessages(prev => [...prev, botMessage]);
            speak(data.message || data.response);

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleFeatureSelect = (feature) => {
        setShowMenu(false);
        if (feature === 'files') {
            fileInputRef.current?.click();
        } else if (feature === 'audio') {
            toggleListening();
        } else {
            setActiveMode(feature);
            if (feature === 'image') setInput("Generate an image of... ");
            if (feature === 'link') setInput("Analyze this link: ");
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        // Optimistic UI update
        const userMessage = { role: 'user', content: `📎 ${file.name} (Uploading...)` };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            // Replace optimistic message or just add bot confirmation
            // Ideally should update the previous message but for simplicity we append

            // Send the file link as a message to the bot to analyze
            const fileMsg = `I have uploaded a file: ${data.url}`;
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const chatResponse = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({ message: fileMsg, mode: 'rec_analysis' }), // Special mode for file analysis if needed
            });
            const chatData = await chatResponse.json();

            setMessages(prev => [
                ...prev.slice(0, -1), // Remove "Uploading..."
                { role: 'user', content: `📎 Uploaded: ${file.name}` },
                { role: 'assistant', content: chatData.message }
            ]);

        } catch (error) {
            console.error('Upload failed:', error);
            setMessages(prev => [...prev, { role: 'system', content: "❌ File upload failed." }]);
        } finally {
            setIsLoading(false);
            // Reset file input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[#1a1a1a] text-white overflow-hidden relative font-sans">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth pb-24">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                        <div className="text-6xl mb-4 opacity-30">💬</div>
                        <p className="text-lg font-medium text-gray-400">Government AI Assistant</p>
                        <p className="text-sm">Ask anything, verify news, or report issues.</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                    >
                        <div
                            className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-[#2a2a2a] text-gray-200 border border-gray-700 rounded-bl-none'
                                }`}
                        >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <span className={`text-[10px] mt-2 block ${msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[#2a2a2a] p-4 rounded-2xl rounded-bl-none border border-gray-700 shadow-sm flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#1a1a1a] border-t border-gray-800 absolute bottom-0 w-full z-20">
                {/* Feature Menu */}
                {showMenu && (
                    <div className="absolute bottom-20 left-4 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl p-2 w-56 transform transition-all animate-fade-in-up z-50">
                        <button onClick={() => handleFeatureSelect('files')} className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                            <span>📎</span> Add photos & files
                        </button>
                        <button onClick={() => handleFeatureSelect('image')} className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                            <span>🖼️</span> Create image
                        </button>
                        <button onClick={() => handleFeatureSelect('audio')} className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                            <span>🎤</span> Audio Input
                        </button>
                        <button onClick={() => handleFeatureSelect('link')} className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg text-sm text-gray-300 transition-colors">
                            <span>🔗</span> Add Link
                        </button>
                    </div>
                )}

                {/* Hidden File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileUpload}
                />

                <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-full p-2 px-4 shadow-lg border border-gray-800 focus-within:border-gray-600 transition-colors">
                    {/* Plus Button */}
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all ${showMenu ? 'rotate-45' : ''}`}
                    >
                        <span className="text-xl">+</span>
                    </button>

                    {/* Text Input */}
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={activeMode === 'chat' ? "Ask anything" : `Mode: ${activeMode}...`}
                        className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 py-2"
                        autoFocus
                    />

                    {/* Right Icons: Mic & Send */}
                    <div className="flex items-center gap-2">
                        {/* Visual Search Icon (Visual only for now) */}
                        <button
                            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Visual Search"
                        >
                            Example
                        </button>

                        <button
                            onClick={toggleListening}
                            className={`p-2 rounded-full transition-all ${isListening ? 'text-red-500 bg-red-500/10 animate-pulse' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            title="Voice Input"
                        >
                            {isListening ? '🛑' : '🎤'}
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2 rounded-full text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <span className="text-lg">➔</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
