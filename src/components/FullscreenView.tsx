
import React from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Network } from 'lucide-react';
import { ArchitectureGenerator } from '@/components/ArchitectureGenerator';
import { Theme } from '@/lib/themes';

interface FullscreenViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  toggleFullscreen: () => void;
  archGenerator: ArchitectureGenerator | null;
  activeTheme: Theme | null;
}

export const FullscreenView: React.FC<FullscreenViewProps> = ({ canvasRef, toggleFullscreen, archGenerator, activeTheme }) => {
  return (
    <div className="min-h-screen bg-white relative">
      {/* Floating controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button onClick={toggleFullscreen} variant="outline" size="sm">
          退出全屏
        </Button>
        <Button onClick={() => archGenerator && activeTheme && archGenerator.generateMultiModalArchitecture(activeTheme.palette)} variant="outline" size="sm">
          <Brain className="w-4 h-4 mr-2" />
          多模态架构
        </Button>
        <Button onClick={() => archGenerator && activeTheme && archGenerator.generateSpectralDomainArchitecture(activeTheme.palette)} variant="outline" size="sm">
          <Network className="w-4 h-4 mr-2" />
          频谱域架构
        </Button>
      </div>

      {/* Full screen canvas */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};
