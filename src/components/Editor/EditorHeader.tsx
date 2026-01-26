import React from 'react';
import { BrainCircuit } from 'lucide-react';

interface EditorHeaderProps {
    selectedProject: string | null;
    onBack: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({ selectedProject, onBack }) => (
    <header className="h-12 border-b border-white/5 bg-black flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
            <button
                onClick={onBack}
                className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5"
            >
                <BrainCircuit size={18} className="text-white" />
            </button>
            <div className="flex flex-col">
                <h1 className="text-[11px] font-black tracking-[0.3em] text-white leading-none uppercase">GEMINI ARCHITECT <span className="text-white/50">3.0</span></h1>
                <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5">{selectedProject}</span>
            </div>
        </div>
        <div className="text-[9px] font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 uppercase tracking-tighter">Status: Connected</div>
    </header>
);
