
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image } from 'lucide-react';

interface TopBarProps {
  toggleFullscreen: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ toggleFullscreen, onExportPNG, onExportSVG }) => {
  return (
    <div className={`absolute top-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10`} style={{ left: '20rem', right: '0' }}>
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">架构图设计</h2>
        <Badge variant="outline" className="text-xs">实时编辑</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          全屏模式
        </Button>
        <Button variant="outline" size="sm" onClick={onExportPNG}>
          <Image className="w-4 h-4 mr-2" />
          导出PNG
        </Button>
        <Button variant="outline" size="sm" onClick={onExportSVG}>
          导出SVG
        </Button>
      </div>
    </div>
  );
};
