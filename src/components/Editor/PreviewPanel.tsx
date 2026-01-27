import React, { useState, useRef } from 'react';
import { ExternalLink, RefreshCw, Smartphone, Monitor, Laptop, X } from 'lucide-react';

interface PreviewPanelProps {
    onClose: () => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ onClose }) => {
    const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
    const [url, setUrl] = useState('http://localhost:3000');
    const [key, setKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const viewWidths = {
        mobile: 'w-[375px]',
        tablet: 'w-[768px]',
        desktop: 'w-full'
    };

    const handleRefresh = () => {
        setKey(prev => prev + 1);
        setIsLoading(true);
    };

    const handlePopOut = () => {
        window.open(url, '_blank');
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRefresh();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0a] border-l border-white/5 h-full overflow-hidden">
            {/* Toolbar */}
            <div className="h-10 bg-[#050505] border-b border-white/5 flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 rounded-lg p-0.5">
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
                        >
                            <Smartphone size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('tablet')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'tablet' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
                        >
                            <Laptop size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}
                        >
                            <Monitor size={14} />
                        </button>
                    </div>
                    <div className="h-4 w-px bg-white/5" />
                    <div className="flex items-center gap-2 bg-white/[0.02] border border-white/5 rounded-md px-3 py-1">
                        <span className="text-[10px] text-white/20 font-mono tracking-tight">URL</span>
                        <input
                            type="text"
                            value={url}
                            onChange={handleUrlChange}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent border-none outline-none text-[10px] text-white/60 w-48 font-mono"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleRefresh}
                        className="p-1.5 hover:bg-white/5 rounded-md text-white/30 hover:text-white/60 transition-colors"
                        title="Refresh Preview"
                    >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-500' : ''} />
                    </button>
                    <button
                        onClick={handlePopOut}
                        className="p-1.5 hover:bg-white/5 rounded-md text-white/30 hover:text-white/60 transition-colors"
                        title="Open in New Tab"
                    >
                        <ExternalLink size={14} />
                    </button>
                    <div className="h-4 w-px bg-white/5 mx-1" />
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-white/5 rounded-md text-white/30 hover:text-red-400 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-[#111] flex items-center justify-center p-8 overflow-hidden relative">
                <div className={`h-full bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden transition-all duration-500 ease-in-out ${viewWidths[viewMode]} relative`}>
                    {isLoading && (
                        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center z-10 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/10 border-2 border-cyan-500/20 border-t-cyan-500 animate-spin mb-4" />
                            <h4 className="text-slate-900 font-bold text-[12px] uppercase tracking-widest">Architect Preview</h4>
                            <p className="text-slate-400 text-[10px] font-medium mt-1">Sourcing {url}...</p>
                        </div>
                    )}
                    <iframe
                        key={key}
                        ref={iframeRef}
                        src={url}
                        onLoad={() => setIsLoading(false)}
                        className="w-full h-full border-none bg-white"
                        title="Frontend Preview"
                    />
                </div>
            </div>
        </div>
    );
};
