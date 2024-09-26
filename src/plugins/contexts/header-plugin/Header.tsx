import React from 'react';
import { PluginProps } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal, Share2, Download, ChevronDown } from 'lucide-react';

const Header: React.FC<PluginProps> = ({ settings }) => (
  <header className="flex items-center justify-between px-4 py-2 bg-white border-b header">
    <div className="flex items-center space-x-4">
      <span className="text-2xl font-bold">loomia</span>
      <Input className="w-40" placeholder={settings?.placeholder || "Untitled"} />
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm">
        <Share2 className="h-4 w-4 mr-2" /> Share
      </Button>
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4 mr-2" /> Export
      </Button>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg" alt="@user" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="sm">
        Present <ChevronDown className="h-4 w-4 ml-2" />
      </Button>
    </div>
  </header>
);

export default Header;
