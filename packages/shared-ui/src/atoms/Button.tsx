import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'small' | 'medium' | 'large' | 'icon';
};

export const Button: React.FC<ButtonProps> = ({ variant = 'default', size = 'medium', children, ...props }) => {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...props}>
      {children}
    </button>
  );
};
