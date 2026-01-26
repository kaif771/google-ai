import { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { MainEditor } from './components/Editor/MainEditor';

export default function GeminiArchitect() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);

  const handleProjectSelect = (name: string, handle?: FileSystemDirectoryHandle) => {
    setSelectedProject(name);
    if (handle) setDirectoryHandle(handle);
  };

  if (!selectedProject) {
    return <WelcomePage onProjectSelect={handleProjectSelect} />;
  }

  return (
    <MainEditor
      selectedProject={selectedProject}
      directoryHandle={directoryHandle}
      onBack={() => setSelectedProject(null)}
    />
  );
}
