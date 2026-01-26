import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Sparkles, Terminal, FileCode, 
  Database, ShieldCheck, Zap, Command, ChevronDown, MessageSquareText
} from 'lucide-react';

// --- SUB-COMPONENT: File Explorer ---
const FileExplorer = ({ activeFile, onSelect }) => (
  <div className="w-64 bg-[#080808] border-r border-white/5 h-full py-6 flex flex-col">
    <div className="px-6 mb-6 flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
      <ChevronDown size={14} /> Workspace
    </div>
    {['Main.tsx', 'backend.js', 'package.json'].map(file => (
      <div 
        key={file}
        onClick={() => onSelect(file)}
        className={`flex items-center gap-2 px-6 py-2 cursor-pointer transition-all text-[11px] font-bold ${
          activeFile === file ? 'bg-blue-500/10 text-blue-400 border-r-2 border-blue-500' : 'text-gray-500 hover:bg-white/5'
        }`}
      >
        <FileCode size={14} className={activeFile === file ? "text-blue-400" : "text-gray-600"} />
        {file}
      </div>
    ))}
  </div>
);

// --- SUB-COMPONENT: AI Sidebar ---
const AISidebar = () => (
  <aside className="w-[380px] bg-[#0a0a0a] p-6 flex flex-col space-y-8 border-l border-white/5">
    <div>
      <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
        <Zap size={14} className="text-pink-500" /> Architecture Plan
      </h3>
      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]">
          <div className="flex items-center gap-2 mb-2">
            <Database className="text-blue-400" size={14} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">MongoDB Schema</span>
          </div>
          <p className="text-[11px] text-gray-500 italic">Awaiting AI Architect instruction...</p>
        </div>
        <div className="p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.05)]">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="text-pink-400" size={14} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Express Auth</span>
          </div>
          <p className="text-[11px] text-gray-500 italic">Security logic pending...</p>
        </div>
      </div>
    </div>
  </aside>
);

// --- MAIN APPLICATION ---
export default function GeminiArchitect() {
  const [activeFile, setActiveFile] = useState("Main.tsx");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("// Paste your frontend code here...");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col bg-[#050505] text-slate-300 overflow-hidden font-sans">
      <header className="h-12 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gradient-to-br from-pink-500 to-blue-600 rounded-lg shadow-lg">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <h1 className="text-[11px] font-black tracking-[0.3em] text-white">GEMINI ARCHITECT <span className="text-blue-500">3.0</span></h1>
        </div>
        <div className="text-[9px] font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">AGENT STATUS: ONLINE</div>
      </header>

      <main className="flex flex-1 overflow-hidden relative">
        <FileExplorer activeFile={activeFile} onSelect={setActiveFile} />
        
        <section className="flex-1 relative border-r border-white/5 bg-[#050505]">
          <div className="h-10 bg-[#0d0d0d] border-b border-white/5 flex items-center px-4">
            <div className="flex items-center gap-2 h-full px-4 bg-[#151515] border-t-2 border-t-pink-500 text-white text-[11px] font-bold">
              <FileCode size={14} className="text-blue-400" /> {activeFile}
            </div>
          </div>

          <textarea
            className="w-full h-[calc(100%-40px)] bg-transparent p-10 outline-none text-indigo-50 font-mono text-[14px] leading-relaxed caret-pink-500 resize-none"
            placeholder="// Enter your plan or code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </section>

        <AISidebar />

        {/* --- FLOATING ACTION BUTTON: AI COMMAND --- */}
        <button 
          onClick={() => setIsCommandOpen(true)}
          className="fixed bottom-10 right-[420px] z-40 group flex items-center gap-3 bg-gradient-to-r from-pink-600 to-blue-600 p-4 rounded-2xl shadow-2xl hover:scale-105 transition-all active:scale-95 border border-white/20"
        >
          <Sparkles className="text-white animate-pulse" size={20} />
          <span className="text-xs font-bold text-white pr-2">Ask Gemini Architect</span>
          <div className="hidden group-hover:flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded text-[10px]">
            <Command size={10} /> K
          </div>
        </button>
      </main>

      {/* --- SEPARATE FLOATING COMMAND PALETTE --- */}
      <AnimatePresence>
        {isCommandOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-[650px] bg-[#111] border border-white/10 rounded-3xl shadow-[0_0_80px_rgba(236,72,153,0.15)] overflow-hidden"
            >
              <div className="flex items-center gap-4 px-8 py-6">
                <div className="p-2 bg-pink-500/10 rounded-xl">
                  <MessageSquareText className="text-pink-500" size={24} />
                </div>
                <input 
                  autoFocus
                  className="bg-transparent border-none outline-none text-white w-full text-lg placeholder-gray-700 font-medium"
                  placeholder="What backend should I build for you?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setIsCommandOpen(false);
                    if (e.key === "Enter") {
                      // Logic for Enter goes here
                      setIsCommandOpen(false);
                    }
                  }}
                />
              </div>
              <div className="px-8 py-4 border-t border-white/5 flex justify-between bg-black/40 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Zap size={10} className="text-yellow-500"/> Deep Thinking</span>
                  <span className="flex items-center gap-1"><Database size={10} className="text-blue-500"/> Context Aware</span>
                </div>
                <span>ESC to Exit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="h-6 border-t border-white/5 bg-[#0d0d0d] flex items-center px-4 justify-between text-[10px] text-gray-600">
        <div className="flex gap-4"><Terminal size={12}/> python_api: connected</div>
        <div className="font-bold text-pink-500/50 tracking-tighter uppercase">Hackathon build v3.0.2</div>
      </footer>
    </div>
  );
}