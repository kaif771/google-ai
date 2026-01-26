import React from 'react';
import { FileCode } from 'lucide-react';

interface CodeEditorProps {
    activeFile: string | null;
    code: string;
    setCode: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ activeFile, code, setCode }) => (
    <section className="flex-1 relative border-r border-white/5 bg-[#000000]">
        <div className="h-10 bg-[#050505] border-b border-white/5 flex items-center px-4">
            {activeFile ? (
                <div className="flex items-center gap-2 h-full px-4 bg-[#0a0a0a] border-t-2 border-t-white/30 text-white text-[11px] font-bold">
                    <FileCode size={14} className="text-white/40" /> {activeFile}
                </div>
            ) : (
                <div className="text-[10px] text-white/20 uppercase font-black tracking-widest px-4">No file selected</div>
            )}
        </div>

        <textarea
            className="w-full h-[calc(100%-40px)] bg-transparent p-10 outline-none text-white/90 font-mono text-[14px] leading-relaxed caret-white/50 resize-none custom-scrollbar"
            placeholder="// Enter your plan or code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
        />
    </section>
);
