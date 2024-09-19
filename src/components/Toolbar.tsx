// src/components/Toolbar.tsx
import React from 'react';

// This is the Toolbar component with a default export
const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      {/* Toolbar content goes here */}
      <button className="toolbar-button">Button 1</button>
      <button className="toolbar-button">Button 2</button>
      <button className="toolbar-button">Button 3</button>
    </div>
  );
};

// Default export of the Toolbar component
export default Toolbar;
