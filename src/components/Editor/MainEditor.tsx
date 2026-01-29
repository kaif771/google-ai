import React, { useCallback, useState } from 'react';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useEditorState } from '../../hooks/useEditorState';
import { useProjectContext } from '../../hooks/useProjectContext';
import { EditorHeader } from './EditorHeader';
import { EditorFooter } from './EditorFooter';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { AISidebar } from './AISidebar';
import { AIChatbot } from './AIChatbot';
import { PreviewPanel } from './PreviewPanel';
import { CommandPalette } from './CommandPalette';
import type { FileNode } from '../../types';

interface MainEditorProps {
    selectedProject: string;
    directoryHandle: FileSystemDirectoryHandle | null;
    onBack: () => void;
}

export const MainEditor: React.FC<MainEditorProps> = ({
    selectedProject,
    directoryHandle,
    onBack
}) => {
    const {
        fileTree,
        toggleFolder,
        saveFile,
        createFile
    } = useFileSystem(directoryHandle);

    const {
        activeFile,
        setActiveFile,
        activeFileHandle,
        setActiveFileHandle,
        code,
        setCode,
        isCommandOpen,
        setIsCommandOpen,
        isPreviewOpen,
        setIsPreviewOpen,
        isFileExplorerOpen,
        setIsFileExplorerOpen,
        isAISidebarOpen,
        setIsAISidebarOpen,
        prompt,
        setPrompt
    } = useEditorState();

    const { context, scanProject, isScanning } = useProjectContext(directoryHandle);
    const [isThinking, setIsThinking] = useState(false);

    // Scan project when directoryHandle is available
    React.useEffect(() => {
        if (directoryHandle) {
            scanProject();
        }
    }, [directoryHandle, scanProject]);

    const handleSave = useCallback(async () => {
        if (activeFileHandle) {
            await saveFile(activeFileHandle, code);
        }
    }, [activeFileHandle, code, saveFile]);

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(true);
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave, setIsCommandOpen]);

    const handleFileSelect = (node: FileNode) => {
        if (node.kind === 'directory') {
            toggleFolder(node);
        } else {
            setActiveFile(node.name);
            setActiveFileHandle(node.handle as FileSystemFileHandle);
        }
    };

    const handleCreateFile = async (fileName: string) => {
        const handle = await createFile(fileName);
        if (handle) {
            setActiveFile(fileName);
            setActiveFileHandle(handle);
            setCode("");
        }
    };

    const handleArchitectRequest = async () => {
        if (!prompt.trim()) return;
        setIsThinking(true);
        setIsCommandOpen(false); // Close palette to show progress

        try {
            // Ideally move this to a dedicated API service hook
            const response = await fetch('http://localhost:8080/api/architect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt,
                    projectContext: context
                })
            });

            const data = await response.json();
            // TODO: Display the plan/code in a meaningful way. 
            // For now, we'll append it to a new file "ArchitectPlan.md" or show in Chat.

            console.log("Architect Plan:", data);

            // Create a plan file
            const planFileName = `Architect_Plan_${Date.now()}.md`;
            const planHandle = await createFile(planFileName);
            if (planHandle) {
                // Formatting the output
                const content = `# Architect's Thought Process\n${data.thought}\n\n# Implementation Plan\n${data.plan}\n\n# Generated Code\n\`\`\`\n${data.code}\n\`\`\``;
                // @ts-ignore - quick save
                const writable = await planHandle.createWritable();
                await writable.write(content);
                await writable.close();

                setActiveFile(planFileName);
                setActiveFileHandle(planHandle);
                setCode(content);
            }

        } catch (error) {
            console.error("Architect failed:", error);
            alert("Architect failed to reason. Check console.");
        } finally {
            setIsThinking(false);
            setPrompt("");
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-[#000000] text-slate-300 overflow-hidden font-sans">
            <EditorHeader
                selectedProject={selectedProject}
                onBack={onBack}
                isFileExplorerOpen={isFileExplorerOpen}
                onToggleFileExplorer={() => setIsFileExplorerOpen(!isFileExplorerOpen)}
                isAISidebarOpen={isAISidebarOpen}
                onToggleAISidebar={() => setIsAISidebarOpen(!isAISidebarOpen)}
            />

            <main className="flex flex-1 overflow-hidden relative">
                {isFileExplorerOpen && (
                    <div className="absolute inset-y-0 left-0 z-40 lg:relative lg:inset-auto">
                        <FileExplorer
                            activeFile={activeFile}
                            fileTree={fileTree}
                            onSelect={handleFileSelect}
                            onCreateFile={handleCreateFile}
                        />
                    </div>
                )}

                <div className="flex-1 flex flex-col min-w-0 relative">
                    <CodeEditor
                        activeFile={activeFile}
                        code={code}
                        setCode={setCode}
                    />
                    <AIChatbot />

                    {/* Loading Overlay */}
                    {isThinking && (
                        <div className="absolute inset-0 z-50 bg-black/80 flex items-center justify-center flex-col gap-4 backdrop-blur-sm">
                            <div className="w-16 h-16 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
                            <div className="text-cyan-400 font-mono animate-pulse">Gemini Architect is thinking...</div>
                        </div>
                    )}

                    {isPreviewOpen && (
                        <div className="absolute inset-0 z-50 bg-black">
                            <PreviewPanel onClose={() => setIsPreviewOpen(false)} />
                        </div>
                    )}
                </div>

                {isAISidebarOpen && (
                    <div className="absolute inset-y-0 right-0 z-40 lg:relative lg:inset-auto bg-[#0a0a0a] shadow-2xl lg:shadow-none">
                        <AISidebar />
                    </div>
                )}

                <CommandPalette
                    isOpen={isCommandOpen}
                    setIsOpen={setIsCommandOpen}
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleArchitectRequest}
                    isScanning={isScanning}
                />
            </main>

            <EditorFooter
                isPreviewOpen={isPreviewOpen}
                onTogglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
            />
        </div>
    );
};// Context hook usage will be added in MainEditor.tsx
