import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Command, MessageSquareText } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, setIsOpen, prompt, setPrompt }) => (
    <>
        <button
            onClick={() => setIsOpen(true)}
            className="fixed bottom-10 right-[420px] z-40 group flex items-center gap-3 bg-white text-black p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95"
        >
            <Sparkles className="text-black" size={20} />
            <span className="text-xs font-bold pr-2">Ask Gemini</span>
            <div className="hidden group-hover:flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded text-[10px]">
                <Command size={10} /> K
            </div>
        </button>

        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="w-[650px] bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center gap-4 px-8 py-6">
                            <div className="p-2 bg-white/5 rounded-xl">
                                <MessageSquareText className="text-white/70" size={24} />
                            </div>
                            <input
                                autoFocus
                                className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-white/10 font-medium"
                                placeholder="What should I architect today?"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") setIsOpen(false);
                                    if (e.key === "Enter") {
                                        setIsOpen(false);
                                    }
                                }}
                            />
                        </div>
                        <div className="px-8 py-4 border-t border-white/5 flex justify-between bg-white/[0.02] text-[10px] text-white/20 font-bold uppercase tracking-widest">
                            <div className="flex gap-4">
                                <span>ESC to Exit</span>
                            </div>
                            <span>Architecture Mode Active</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
);
