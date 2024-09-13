import React from 'react';
import { FiSave, FiDownload, FiPlus, FiGrid, FiLayers } from 'react-icons/fi';

interface ToolbarProps {
  onSave: () => void;
  onExport: () => void;
  onNew: () => void;
  onToggleGrid: () => void;
  onToggleLayers: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onExport,
  onNew,
  onToggleGrid,
  onToggleLayers
}) => {
  return (
    <div className="toolbar">
      <button className="toolbar-button" onClick={onNew}>
        <FiPlus />
        <span>New</span>
      </button>
      <button className="toolbar-button" onClick={onSave}>
        <FiSave />
        <span>Save</span>
      </button>
      <button className="toolbar-button" onClick={onExport}>
        <FiDownload />
        <span>Export</span>
      </button>
      <div className="toolbar-divider" />
      <button className="toolbar-button" onClick={onToggleGrid}>
        <FiGrid />
        <span>Toggle Grid</span>
      </button>
      <button className="toolbar-button" onClick={onToggleLayers}>
        <FiLayers />
        <span>Layers</span>
      </button>
    </div>
  );
};

export default Toolbar;