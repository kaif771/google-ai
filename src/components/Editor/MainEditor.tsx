import React, { useCallback } from 'react';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useEditorState } from '../../hooks/useEditorState';
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
                />
            </main>

            <EditorFooter
                isPreviewOpen={isPreviewOpen}
                onTogglePreview={() => setIsPreviewOpen(!isPreviewOpen)}
            />
        </div>
    );
};
