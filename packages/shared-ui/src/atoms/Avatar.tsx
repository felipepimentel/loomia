import React from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large';
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium' }) => {
  return (
    <img
      className={`avatar avatar-${size}`}
      src={src || '/default-avatar.png'}
      alt={alt || 'User Avatar'}
    />
  );
};
