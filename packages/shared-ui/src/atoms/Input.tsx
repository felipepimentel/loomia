import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'default' | 'outlined' | 'filled';
};

export const Input: React.FC<InputProps> = ({ variant = 'default', ...props }) => {
  return <input className={`input input-${variant}`} {...props} />;
};
