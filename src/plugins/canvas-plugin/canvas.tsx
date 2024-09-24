interface CanvasProps {
  gridEnabled: boolean;
}

const Canvas: React.FC<CanvasProps> = ({ gridEnabled }) => (
  <div
    className="flex-1 relative"
    style={{
      backgroundImage: gridEnabled
        ? 'radial-gradient(circle, #d7d7d7 1px, transparent 1px)'
        : 'none',
      backgroundSize: '20px 20px',
      backgroundColor: gridEnabled ? '#f0f0f0' : 'white',
    }}
  >
    {/* Canvas content will be here */}
  </div>
);

export default Canvas;