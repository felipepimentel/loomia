import React from 'react';

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const colors = ['#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#f44336'];

  return (
    <div className="color-picker">
      {colors.map((c) => (
        <button
          key={c}
          className="color-swatch"
          style={{ backgroundColor: c }}
          onClick={() => onChange(c)}
        />
      ))}
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
};
