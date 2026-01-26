import React from 'react';
import { Terminal } from 'lucide-react';

export const EditorFooter: React.FC = () => (
    <footer className="h-6 border-t border-white/5 bg-black flex items-center px-4 justify-between text-[10px] text-white/20">
        <div className="flex gap-4"><Terminal size={12} /> system: connected</div>
        <div className="font-bold tracking-tighter uppercase">GEMINI ARCHITECT 3.0</div>
    </footer>
);
