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
    { name: 'cursor', icon: <MouseOutlined /> },
    { name: 'pen', icon: <CreateOutlined /> },
    { name: 'rectangle', icon: <CropSquareOutlined /> },
    { name: 'circle', icon: <RadioButtonUncheckedOutlined /> },
    { name: 'text', icon: <TextFieldsOutlined /> },
    { name: 'image', icon: <ImageOutlined /> },
  ];

  return (
    <div className="sidebar">
      {tools.map(({ name, icon }) => (
        <button
          key={name}
          className={`tool-button ${activeTool === name ? 'active' : ''}`}
          onClick={() => setActiveTool(name)}
        >
          {icon}
        </button>
      ))}
      <div className="sidebar-divider" />
      <button className="tool-button" onClick={onZoomIn}>
        <ZoomInOutlined />
      </button>
      <button className="tool-button" onClick={onZoomOut}>
        <ZoomOutOutlined />
      </button>
      <div className="sidebar-divider" />
      <button className="tool-button" onClick={onClear}>
        <DeleteOutlined />
      </button>
      <div className="sidebar-divider" />
      <button className="tool-button" onClick={onUndo}>
        <UndoOutlined />
      </button>
      <button className="tool-button" onClick={onRedo}>
        <RedoOutlined />
      </button>
    </div>
  );
};

export default Sidebar;