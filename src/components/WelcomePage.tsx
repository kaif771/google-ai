import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, Github, Terminal, BrainCircuit } from 'lucide-react';

const STORAGE_KEY = 'gemini_architect_recent_projects';

interface RecentProject {
    name: string;
    path: string;
}

interface WelcomePageProps {
    onProjectSelect: (name: string, handle?: FileSystemDirectoryHandle) => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onProjectSelect }) => {
    const [recentProjects, setRecentProjects] = React.useState<RecentProject[]>([]);

    React.useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setRecentProjects(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse recent projects:', e);
            }
        }
    }, []);

    const saveProject = (name: string) => {
        const newProjects = [
            { name, path: 'Local Directory' },
            ...recentProjects.filter(p => p.name !== name)
        ].slice(0, 5);
        setRecentProjects(newProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    };

    const handleOpenFolder = async () => {
        try {
            // @ts-ignore
            if ('showDirectoryPicker' in window) {
                // @ts-ignore
                const directoryHandle = await window.showDirectoryPicker();
                saveProject(directoryHandle.name);
                onProjectSelect(directoryHandle.name, directoryHandle);
            } else {
                alert('Your browser does not support the File System Access API.');
            }
        } catch (err) {
            console.error('Folder selection cancelled:', err);
        }
    };

    return (
        <div className="h-screen w-full bg-[#000000] text-gray-400 flex flex-col overflow-hidden font-sans">
            {/* Top Header */}
            <header className="flex justify-between items-center px-6 py-4">
                <div className="flex gap-4 text-[13px] font-medium text-white/50">
                    {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((item) => (
                        <span key={item} className="cursor-pointer hover:text-white transition-colors">
                            {item}
                        </span>
                    ))}
                </div>
                <div className="flex gap-4">
                    <div className="h-4 w-4 rounded-full border border-white/10" />
                    <div className="h-4 w-4 rounded-full border border-white/10" />
                    <div className="h-4 w-4 rounded-full border border-white/10" />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center -mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-16"
                >
                    <div className="flex items-center gap-4 mb-3">
                        <BrainCircuit size={48} className="text-white" />
                        <h1 className="text-[32px] font-medium tracking-tight text-white uppercase font-sans">GEMINI ARCHITECT <span className="text-white/70">3.0</span></h1>
                    </div>
                    <button className="text-[14px] text-white/40 hover:text-white transition-colors tracking-wide">
                        Sign in
                    </button>
                </motion.div>

                {/* Action Cards */}
                <div className="flex gap-3 mb-20">
                    {[
                        { icon: <FolderOpen size={22} />, label: 'Open project', onClick: handleOpenFolder },
                        { icon: <Github size={22} />, label: 'Clone repo', onClick: () => { } },
                        { icon: <Terminal size={22} />, label: 'Connect via SSH', onClick: () => { } }
                    ].map((action, i) => (
                        <motion.div
                            key={action.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={action.onClick}
                            className="w-[180px] h-[90px] bg-[#0a0a0a] hover:bg-[#111111] border border-white/5 rounded-xl flex flex-col items-start justify-center p-5 cursor-pointer transition-all group"
                        >
                            <div className="text-white/40 group-hover:text-white transition-colors mb-3">
                                {action.icon}
                            </div>
                            <span className="text-[14px] font-medium text-white/50 group-hover:text-white transition-colors">
                                {action.label}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Projects */}
                <div className="w-full max-w-3xl px-12">
                    <div className="flex justify-between items-center mb-10 px-2">
                        <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.25em]">Recent projects</h3>
                        <span className="text-[11px] font-black text-white/30 hover:text-white cursor-pointer transition-colors uppercase tracking-[0.25em]">View all ({recentProjects.length})</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {recentProjects.map((project, i) => (
                            <motion.div
                                key={project.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.05) }}
                                onClick={handleOpenFolder}
                                className="flex items-center justify-between py-2 group hover:bg-white/5 px-4 rounded-lg cursor-pointer transition-colors"
                            >
                                <div className="flex flex-col">
                                    <span className="text-[15px] font-medium text-white/70 group-hover:text-white transition-colors">{project.name}</span>
                                    <span className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-0.5">Click to reconnect folder</span>
                                </div>
                                <span className="text-[11px] text-white/20 font-mono tracking-tight">{project.path}</span>
                            </motion.div>
                        ))}
                        {recentProjects.length === 0 && (
                            <div className="px-4 py-2 text-[14px] text-white/20 italic">No recent projects.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
