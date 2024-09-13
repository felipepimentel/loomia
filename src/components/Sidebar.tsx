import React from 'react';
import { 
  MouseOutlined, 
  CreateOutlined, 
  CropSquareOutlined, 
  RadioButtonUncheckedOutlined, 
  TextFieldsOutlined, 
  ImageOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined
} from '@material-ui/icons';

interface SidebarProps {
  activeTool: string;
  setActiveTool: (tool: string) => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTool, 
  setActiveTool, 
  onClear, 
  onZoomIn, 
  onZoomOut,
  onUndo,
  onRedo
}) => {
  const tools = [
    { name: 'cursor', icon: <MouseOutlined />, label: 'Select' },
    { name: 'pen', icon: <CreateOutlined />, label: 'Draw' },
    { name: 'rectangle', icon: <CropSquareOutlined />, label: 'Rectangle' },
    { name: 'circle', icon: <RadioButtonUncheckedOutlined />, label: 'Circle' },
    { name: 'text', icon: <TextFieldsOutlined />, label: 'Text' },
    { name: 'image', icon: <ImageOutlined />, label: 'Image' },
  ];

  return (
    <div className="sidebar">
      <div className="tool-group">
        {tools.map(({ name, icon, label }) => (
          <button
            key={name}
            className={`tool-button ${activeTool === name ? 'active' : ''}`}
            onClick={() => setActiveTool(name)}
          >
            {icon}
            <span className="tool-label">{label}</span>
          </button>
        ))}
      </div>
      <div className="tool-group">
        <button className="tool-button" onClick={onZoomIn}>
          <ZoomInOutlined />
          <span className="tool-label">Zoom In</span>
        </button>
        <button className="tool-button" onClick={onZoomOut}>
          <ZoomOutOutlined />
          <span className="tool-label">Zoom Out</span>
        </button>
      </div>
      <div className="tool-group">
        <button className="tool-button" onClick={onUndo}>
          <UndoOutlined />
          <span className="tool-label">Undo</span>
        </button>
        <button className="tool-button" onClick={onRedo}>
          <RedoOutlined />
          <span className="tool-label">Redo</span>
        </button>
      </div>
      <div className="tool-group">
        <button className="tool-button" onClick={onClear}>
          <DeleteOutlined />
          <span className="tool-label">Clear All</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;