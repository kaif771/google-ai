import { useState, useEffect, useCallback } from 'react';

export const useEditorState = () => {
    const [activeFile, setActiveFile] = useState<string | null>(null);
    const [activeFileHandle, setActiveFileHandle] = useState<FileSystemFileHandle | null>(null);
    const [code, setCode] = useState("// Select a file to view code...");
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [prompt, setPrompt] = useState("");

    const loadFile = useCallback(async (handle: FileSystemFileHandle) => {
        try {
            const file = await handle.getFile();
            const text = await file.text();
            setCode(text);
        } catch (err) {
            console.error("Error loading file:", err);
            setCode("// Error loading file contents.");
        }
    }, []);

    useEffect(() => {
        if (activeFileHandle) {
            loadFile(activeFileHandle);
        }
    }, [activeFileHandle, loadFile]);

    return {
        activeFile,
        setActiveFile,
        activeFileHandle,
        setActiveFileHandle,
        code,
        setCode,
        isCommandOpen,
        setIsCommandOpen,
        prompt,
        setPrompt
    };
};
