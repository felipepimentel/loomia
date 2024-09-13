import React, { useState, useCallback } from 'react';
import Whiteboard from './components/Whiteboard';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import './styles/App.css';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('cursor');
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<any[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);

  const handleClear = useCallback(() => {
    setHistory([...history, []]);
    setHistoryStep(history.length);
  }, [history]);

  const handleUndo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
    }
  }, [historyStep]);

  const handleRedo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
    }
  }, [historyStep, history]);

  const handleZoomIn = useCallback(() => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  }, []);

  const updateHistory = useCallback((newShapes: any[]) => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [history, historyStep]);

  const handleSave = useCallback(() => {
    // Implement save functionality
    console.log('Save');
  }, []);

  const handleExport = useCallback(() => {
    // Implement export functionality
    console.log('Export');
  }, []);

  const handleNew = useCallback(() => {
    // Implement new document functionality
    console.log('New');
  }, []);

  const handleToggleGrid = useCallback(() => {
    // Implement grid toggle functionality
    console.log('Toggle Grid');
  }, []);

  const handleToggleLayers = useCallback(() => {
    // Implement layers toggle functionality
    console.log('Toggle Layers');
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">Loomia</div>
        <Toolbar 
          onSave={handleSave}
          onExport={handleExport}
          onNew={handleNew}
          onToggleGrid={handleToggleGrid}
          onToggleLayers={handleToggleLayers}
        />
        <div className="user-menu">
          <button className="user-button">JD</button>
        </div>
      </header>
      <div className="app-content">
        <Sidebar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool}
          onClear={handleClear}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        <main className="whiteboard-container">
          <Whiteboard 
            activeTool={activeTool} 
            zoom={zoom} 
            shapes={history[historyStep]}
            updateHistory={updateHistory}
          />
        </main>
      </div>
    </div>
  );
};

export default App;