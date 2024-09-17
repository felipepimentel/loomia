import React from 'react';
import * as Icons from 'lucide-react';

type IconProps = {
  name: keyof typeof Icons;
  size?: number;
  className?: string;
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  const LucideIcon = Icons[name];
  return <LucideIcon size={size} className={className} />;
};
