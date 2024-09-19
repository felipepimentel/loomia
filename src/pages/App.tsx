// src/components/ui/App.tsx
import React from 'react';
import Header from '../components/Header';
import RightSidebar from '../components/RightSidebar';
import BottomToolbar from '../components/BottomToolbar';
import Canvas from '../components/Canvas';
import LeftToolbar from '../components/LeftToolbar';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <LeftToolbar tool="select" setTool={() => {}} />
        <Canvas gridEnabled={true} />
        <RightSidebar selectedShapes={[]} selectedConnections={[]} setSelectedShapes={() => {}} setSelectedConnections={() => {}} />
      </div>
      <BottomToolbar />
    </div>
  );
};

export default App;
