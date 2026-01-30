import { useState, useCallback } from 'react';

export const useProjectContext = (directoryHandle: FileSystemDirectoryHandle | null) => {
    const [context, setContext] = useState<string>("");
    const [isScanning, setIsScanning] = useState(false);
    const [cacheName, setCacheName] = useState<string | null>(null);
    const [isCaching, setIsCaching] = useState(false);

    const createCache = useCallback(async (projectContext: string) => {
        setIsCaching(true);
        try {
            const response = await fetch('http://localhost:8080/api/cache-codebase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectFiles: projectContext })
            });
            const data = await response.json();
            if (data.cacheName) {
                setCacheName(data.cacheName);
                console.log("Cache created:", data.cacheName);
            }
        } catch (error) {
            console.error("Failed to create cache:", error);
        } finally {
            setIsCaching(false);
        }
    }, []);

    const scanProject = useCallback(async () => {
        if (!directoryHandle) return;
        setIsScanning(true);
        let fullContext = "";

        const processHandle = async (handle: FileSystemDirectoryHandle | FileSystemFileHandle, path: string = "") => {
            if (handle.kind === 'file') {
                const file = await (handle as FileSystemFileHandle).getFile();
                const name = handle.name;
                // Filter relevant files
                if (name.match(/\.(tsx|ts|js|jsx|css|json|html|md)$/) && !path.includes('node_modules') && !path.includes('dist') && !name.startsWith('.')) {
                    const text = await file.text();
                    fullContext += `\n// File: ${path}/${name}\n${text}\n`;
                }
            } else if (handle.kind === 'directory') {
                if (handle.name === 'node_modules' || handle.name === '.git' || handle.name === 'dist') return;

                // @ts-expect-error - Async iterator for directory handle is standard but might miss types
                for await (const entry of (handle as FileSystemDirectoryHandle).values()) {
                    await processHandle(entry, `${path}/${handle.name}`);
                }
            }
        };

        try {
            await processHandle(directoryHandle);
            setContext(fullContext);
            console.log("Project context scanned:", fullContext.length, "characters");

            // Automatically create cache after scanning
            if (fullContext) {
                createCache(fullContext);
            }
        } catch (error) {
            console.error("Failed to scan project:", error);
        } finally {
            setIsScanning(false);
        }
    }, [directoryHandle, createCache]);

    return { context, scanProject, isScanning, cacheName, isCaching };
};
