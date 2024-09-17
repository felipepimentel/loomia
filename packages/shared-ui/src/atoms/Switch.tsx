import React from 'react';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Switch: React.FC<SwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
  );
};
