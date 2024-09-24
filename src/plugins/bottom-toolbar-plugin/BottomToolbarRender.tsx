// BottomToolbarRender.tsx
import React from 'react';
import BottomToolbar from './BottomToolbar';
import { PluginProps } from '@/core/types';

const BottomToolbarRender: React.FC<PluginProps & { settings: Record<string, any> }> = (props) => {
  return <BottomToolbar {...props} />;
};

export default BottomToolbarRender;
