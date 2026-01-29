import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
}

export const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Hello! I am your Gemini AI Assistant. How can I help you build your project today?',
            timestamp: new Date(),
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input; // Capture input before clearing
        setInput('');

        try {
            // REAL API CALL: Update to your server's endpoint
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    // Send history formatted for Gemini
                    history: messages.map(m => ({
                        role: m.role === 'user' ? 'user' : 'model',
                        parts: [{ text: m.content }]
                    }))
                }),
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            const aiMessage: Message = {
                id: Date.now().toString(),
                role: 'ai',
                content: data.reply, // Assuming your server returns { "reply": "..." }
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            // Optional: show error message in UI
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-12 right-4 sm:right-6 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl transition-all duration-300 group z-50"
            >
                <Bot size={24} className="text-white group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full animate-pulse" />
            </button>
        );
    }

    return (
        <div className={`
      relative border-t border-white/5 bg-[#050505] transition-all duration-500 ease-in-out flex flex-col
      ${isExpanded ? 'h-96 sm:h-[500px]' : 'h-64 sm:h-72'}
    `}>
            {/* Header */}
            <div className="h-10 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                    <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Gemini AI Intelligence</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-1.5 hover:bg-white/5 rounded-md text-white/30 hover:text-white/60 transition-colors"
                    >
                        {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1.5 hover:bg-white/5 rounded-md text-white/30 hover:text-white/60 transition-colors"
                    >
                        <ChevronDown size={14} />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`
              w-8 h-8 rounded-xl flex items-center justify-center shrink-0
              ${msg.role === 'ai' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-white/5 text-white/40 border border-white/10'}
            `}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`
              max-w-[80%] p-4 rounded-2xl text-[12px] leading-relaxed
              ${msg.role === 'ai'
                                ? 'bg-white/[0.03] border border-white/5 text-white/80'
                                : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50'
                            }
            `}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 bg-white/[0.01]">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask AI..."
                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-2.5 sm:py-3 pl-4 pr-12 text-[12px] text-white outline-none focus:border-cyan-500/50 transition-all placeholder:text-white/10"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500/50 hover:text-cyan-400 disabled:opacity-0 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
