import React from 'react';
import { Zap, Database, ShieldCheck } from 'lucide-react';

export const AISidebar: React.FC = () => (
    <aside className="w-[380px] bg-[#0a0a0a] p-6 flex flex-col space-y-8 border-l border-white/5">
        <div>
            <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <Zap size={14} className="text-white/50" /> Architecture Plan
            </h3>
            <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2 mb-2">
                        <Database className="text-white/30" size={14} />
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">MongoDB Schema</span>
                    </div>
                    <p className="text-[11px] text-white/20 italic font-medium">Awaiting AI Architect instruction...</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="text-white/30" size={14} />
                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider">Express Auth</span>
                    </div>
                    <p className="text-[11px] text-white/20 italic font-medium">Security logic pending...</p>
                </div>
            </div>
        </div>
    </aside>
);
