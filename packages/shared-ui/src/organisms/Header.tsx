import React from 'react';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Avatar } from '../atoms/Avatar';
import { Icon } from '../atoms/Icon';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h1>loomia</h1>
        <Input placeholder="Untitled" />
        <Button variant="ghost" size="icon">
          <Icon name="MoreHorizontal" />
        </Button>
      </div>
      <div className="header-right">
        <Button variant="ghost" size="small">
          <Icon name="Share2" /> Share
        </Button>
        <Button variant="ghost" size="small">
          <Icon name="Download" /> Export
        </Button>
        <Avatar />
        <Button variant="ghost" size="small">
          Present <Icon name="ChevronDown" />
        </Button>
      </div>
    </header>
  );
};
