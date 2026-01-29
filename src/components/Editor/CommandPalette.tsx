import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText } from 'lucide-react';

interface CommandPaletteProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    onSubmit: () => void;
    isScanning: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    isOpen,
    setIsOpen,
    prompt,
    setPrompt,
    onSubmit,
    isScanning
}) => (
    <>
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
                            <div className="p-2 bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-white/5 rounded-xl">
                                <MessageSquareText className="text-white/70" size={24} />
                            </div>
                            <input
                                autoFocus
                                className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-white/10 font-medium"
                                placeholder={isScanning ? "Scanning codebase..." : "Ask Gemini Architect..."}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") setIsOpen(false);
                                    if (e.key === "Enter" && !isScanning) {
                                        onSubmit();
                                    }
                                }}
                                disabled={isScanning}
                            />
                            {isScanning && <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />}
                        </div>
                        <div className="px-8 py-4 border-t border-white/5 flex justify-between bg-white/[0.02] text-[10px] text-white/20 font-bold uppercase tracking-widest">
                            <div className="flex gap-4">
                                <span>ENTER to Execute</span>
                                <span>ESC to Exit</span>
                            </div>
                            <span className={isScanning ? "animate-pulse text-yellow-500/50" : "text-cyan-500/50"}>
                                {isScanning ? "Reading Files..." : "Link Active"}
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    </>
);
