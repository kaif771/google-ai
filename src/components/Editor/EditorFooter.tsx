import React from 'react';
import { Terminal } from 'lucide-react';

interface EditorFooterProps {
    isPreviewOpen: boolean;
    onTogglePreview: () => void;
}

export const EditorFooter: React.FC<EditorFooterProps> = ({ isPreviewOpen, onTogglePreview }) => (
    <footer className="h-8 border-t border-white/5 bg-black flex items-center px-4 sm:px-6 justify-between text-[10px]">
        <div className="font-bold tracking-tighter uppercase text-white/20 hidden xs:block">
            GEMINI ARCHITECT 3.0
        </div>

        <div className="flex items-center gap-3">
            <button
                onClick={onTogglePreview}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all duration-300 ${isPreviewOpen
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                    : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10 hover:border-white/20'
                    }`}
            >
                <div className={`w-1 h-1 rounded-full ${isPreviewOpen ? 'bg-cyan-400 animate-pulse' : 'bg-white/20'}`} />
                <span className="font-bold uppercase tracking-tight">Preview</span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-white/40 font-bold uppercase tracking-tight">
                <Terminal size={12} className="text-white/20 shrink-0" />
                <span className="truncate max-w-[80px] sm:max-w-none">status: connected</span>
            </div>
        </div>
    </footer>
);
