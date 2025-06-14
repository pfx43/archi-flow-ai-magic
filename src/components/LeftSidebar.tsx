
import React from 'react';
import { Wand2, FileText, Upload, Brain, Network, Square, Circle as CircleIcon, Type, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ImageUploadHandler } from '@/components/ImageUploadHandler';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ArchitectureGenerator } from '@/components/ArchitectureGenerator';
import { Theme } from '@/lib/themes';
import { ModelProviderConfig } from './ModelProviderConfig';

interface LeftSidebarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  modelProvider: 'doubao' | 'openrouter';
  setModelProvider: (provider: 'doubao' | 'openrouter') => void;
  openRouterApiKey: string;
  onOpenRouterApiKeyChange: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  language: 'zh' | 'en';
  setLanguage: (language: 'zh' | 'en') => void;
  inputMode: 'simple' | 'long' | 'image';
  setInputMode: (mode: 'simple' | 'long' | 'image') => void;
  inputText: string;
  setInputText: (text: string) => void;
  handleImageUpload: (file: File) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  archGenerator: ArchitectureGenerator | null;
  activeTheme: Theme | null;
  handleThemeSelect: (theme: Theme) => void;
  activeTool: string;
  setActiveTool: (tool: 'select' | 'rectangle' | 'circle' | 'text') => void;
  handleToolClick: (tool: 'rectangle' | 'circle' | 'text') => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  apiKey,
  onApiKeyChange,
  modelProvider,
  setModelProvider,
  openRouterApiKey,
  onOpenRouterApiKeyChange,
  selectedModel,
  setSelectedModel,
  language,
  setLanguage,
  inputMode,
  setInputMode,
  inputText,
  setInputText,
  handleImageUpload,
  handleGenerate,
  isGenerating,
  archGenerator,
  activeTheme,
  handleThemeSelect,
  activeTool,
  setActiveTool,
  handleToolClick
}) => {
  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-white border-r border-gray-200 p-6 flex flex-col gap-6 z-20 overflow-y-auto hide-scrollbar">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">ArchiFlow</h1>
          <p className="text-xs text-gray-500">AI架构图生成器</p>
        </div>
      </div>

      {/* API Configuration */}
      <ModelProviderConfig
        modelProvider={modelProvider}
        setModelProvider={setModelProvider}
        doubaoApiKey={apiKey}
        onDoubaoApiKeyChange={onApiKeyChange}
        openRouterApiKey={openRouterApiKey}
        onOpenRouterApiKeyChange={onOpenRouterApiKeyChange}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Input Section */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={inputMode === 'simple' ? 'default' : 'outline'}
              onClick={() => setInputMode('simple')}
              className="flex-1"
            >
              <Type className="w-4 h-4 mr-1" />
              简单描述
            </Button>
            <Button
              size="sm"
              variant={inputMode === 'long' ? 'default' : 'outline'}
              onClick={() => setInputMode('long')}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-1" />
              论文文本
            </Button>
          </div>
          
          <div className="relative">
            <Textarea
              placeholder={inputMode === 'simple' ? "描述您想要的架构图..." : "粘贴论文或技术文档内容..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] transition-all duration-300"
            />
          </div>

          <div className="flex gap-2">
            <ImageUploadHandler
              onImageUpload={handleImageUpload}
            />
            <label htmlFor="file-upload" className="flex-1">
              <Button variant="outline" className="w-full" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  上传图片
                </span>
              </Button>
            </label>
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="w-full bg-gradient-to-r from-indigo-500 to-cyan-400 hover:from-indigo-600 hover:to-cyan-500 text-white font-medium py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                豆包AI生成中...
              </div>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                智能生成
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Quick Architecture Templates */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">快速生成</h3>
        <div className="space-y-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => archGenerator && activeTheme && archGenerator.generateMultiModalArchitecture(activeTheme.palette)}
            className="w-full justify-start"
          >
            <Brain className="w-4 h-4 mr-2" />
            多模态架构
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => archGenerator && activeTheme && archGenerator.generateSpectralDomainArchitecture(activeTheme.palette)}
            className="w-full justify-start"
          >
            <Network className="w-4 h-4 mr-2" />
            频谱域架构
          </Button>
        </div>
      </Card>

      {/* Tools */}
      <Card className="p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">编辑工具</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant={activeTool === 'select' ? 'default' : 'outline'}
            onClick={() => setActiveTool('select')}
            className="justify-start"
          >
            <Move className="w-4 h-4 mr-2" />
            选择
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'rectangle' ? 'default' : 'outline'}
            onClick={() => handleToolClick('rectangle')}
            className="justify-start"
          >
            <Square className="w-4 h-4 mr-2" />
            矩形
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'circle' ? 'default' : 'outline'}
            onClick={() => handleToolClick('circle')}
            className="justify-start"
          >
            <CircleIcon className="w-4 h-4 mr-2" />
            圆形
          </Button>
          <Button
            size="sm"
            variant={activeTool === 'text' ? 'default' : 'outline'}
            onClick={() => handleToolClick('text')}
            className="justify-start"
          >
            <Type className="w-4 h-4 mr-2" />
            文本
          </Button>
        </div>
      </Card>

      {/* Themes */}
      <ThemeSelector activeTheme={activeTheme} onThemeSelect={handleThemeSelect} />
    </div>
  );
};
