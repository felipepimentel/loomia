import React, { useState } from 'react';
import Header from '@/components/Header';
import LeftToolbar from '@/components/LeftToolbar';
import BottomToolbar from '@/components/BottomToolbar';
import MainCanvas from '@/components/Canvas';
import RightSidebar from '@/components/RightSidebar';

const App: React.FC = () => {
  const [tool, setTool] = useState<string>('select');
  const [documentTitle, setDocumentTitle] = useState<string>('Untitled');

  return (
    <div className="app flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <Header documentTitle={documentTitle} onTitleChange={setDocumentTitle} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <LeftToolbar tool={tool} setTool={setTool} />

        {/* Main Canvas */}
        <MainCanvas tool={tool} />

        {/* Right Sidebar */}
        <RightSidebar />
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar />
    </div>
  );
};

export default App;
