import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ChevronDown, Maximize2, Minimize2, Paperclip, X } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
    image?: string;
    timestamp: Date;
}

export const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [input, setInput] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'ai',
            content: 'Hello! I am your Gemini AI Assistant. Upload a blueprint or diagram, and I will code it for you.',
            timestamp: new Date(),
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!input.trim() && !selectedImage) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            image: selectedImage as string | undefined, // Cast to undefined if null
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        const currentImage = selectedImage;
        setInput('');
        setSelectedImage(null);

        try {
            // REAL API CALL: Update to your server's endpoint
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: currentInput,
                    image: currentImage,
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
                content: data.reply,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
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
      relative border-t border-white/5 bg-[#050505] transition-all duration-500 ease-in-out flex flex-col z-30
      ${isExpanded ? 'h-96 sm:h-[600px]' : 'h-64 sm:h-80'}
    `}>
            {/* Header */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse" />
                    <h3 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">Gemini AI Intelligence</h3>
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
              w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border
              ${msg.role === 'ai'
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.1)]'
                                : 'bg-pink-500/10 border-pink-500/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.1)]'}
            `}>
                            {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                        </div>
                        <div className={`max-w-[80%] flex flex-col gap-2`}>
                            {msg.image && (
                                <img src={msg.image} alt="User upload" className="rounded-xl border border-white/10 max-h-48 object-cover" />
                            )}
                            <div className={`
                                p-4 rounded-2xl text-[13px] leading-relaxed font-medium
                                ${msg.role === 'ai'
                                    ? 'glass-panel text-slate-300'
                                    : 'bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/20 text-pink-100'
                                }
                            `}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white/[0.01] border-t border-white/5">
                {selectedImage && (
                    <div className="flex items-center gap-2 mb-2 p-2 bg-white/5 rounded-lg w-fit">
                        <img src={selectedImage} alt="Preview" className="w-8 h-8 rounded object-cover" />
                        <span className="text-[10px] text-white/50">Image attached</span>
                        <button onClick={() => setSelectedImage(null)} className="text-white/30 hover:text-white">
                            <X size={12} />
                        </button>
                    </div>
                )}
                <div className="relative group flex gap-2">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.08] transition-colors text-white/40 hover:text-cyan-400"
                    >
                        <Paperclip size={18} />
                    </button>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask AI or upload a design..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-[13px] text-white outline-none focus:border-cyan-500/30 focus:bg-white/[0.05] transition-all placeholder:text-white/20 font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() && !selectedImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500/50 hover:text-cyan-400 hover:scale-110 disabled:opacity-0 transition-all duration-300"
                        >
                            <Send size={18} />
                        </button>
                        {/* Input Glow */}
                        <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10" />
                    </div>
                </div>
            </div>
        </div>
    );
};
