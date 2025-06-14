import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow } from 'fabric';
import { Upload, Wand2, FileText, Image, Layers, Square, Circle as CircleIcon, Type, Move, Settings, Brain, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoubaoApiConfig } from '@/components/DoubaoApiConfig';
import { ImageUploadHandler } from '@/components/ImageUploadHandler';
import { ArchitectureGenerator } from '@/components/ArchitectureGenerator';

interface Template {
  id: string;
  name: string;
  style: string;
  preview: string;
}

export const MainLayout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'simple' | 'long' | 'image'>('simple');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'text'>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [apiKey, setApiKey] = useState('66517a68-24bb-4f60-94dc-1fe4c3b89e26');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [archGenerator, setArchGenerator] = useState<ArchitectureGenerator | null>(null);

  const templates: Template[] = [
    { id: 'modern', name: '现代风格', style: 'bg-gradient-to-br from-blue-500 to-cyan-400', preview: 'M' },
    { id: 'academic', name: '学术风格', style: 'bg-gradient-to-br from-gray-600 to-gray-800', preview: 'A' },
    { id: 'aws', name: 'AWS风格', style: 'bg-gradient-to-br from-orange-500 to-yellow-400', preview: 'W' },
    { id: 'minimal', name: '简约风格', style: 'bg-gradient-to-br from-indigo-500 to-purple-600', preview: 'S' }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth - (isFullscreen ? 0 : 320),
      height: window.innerHeight - (isFullscreen ? 0 : 64),
      backgroundColor: '#FFFFFF',
    });

    setFabricCanvas(canvas);
    
    const generator = new ArchitectureGenerator(canvas);
    setArchGenerator(generator);

    // Add dot grid background
    addDotGridBackground(canvas);

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - (isFullscreen ? 0 : 320),
        height: window.innerHeight - (isFullscreen ? 0 : 64),
      });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [isFullscreen]);

  const addDotGridBackground = (canvas: FabricCanvas) => {
    const spacing = 20;
    const canvasWidth = canvas.width || 1200;
    const canvasHeight = canvas.height || 800;

    for (let x = 0; x <= canvasWidth; x += spacing) {
      for (let y = 0; y <= canvasHeight; y += spacing) {
        const dot = new Circle({
          left: x,
          top: y,
          radius: 1,
          fill: '#E5E7EB',
          selectable: false,
          evented: false,
        });
        canvas.add(dot);
        canvas.sendToBack(dot);
      }
    }
  };

  const callDoubaoApi = async (content: string) => {
    try {
      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'doubao-seed-1-6-250615',
          messages: [
            {
              role: 'user',
              content: `请分析以下内容并提取出关键的架构组件，以JSON格式返回，包含节点名称和它们之间的关系：${content}`
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('豆包API调用失败:', error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim() || !archGenerator) return;
    
    setIsGenerating(true);
    
    try {
      // Determine architecture type based on input
      if (inputText.includes('multimodal') || inputText.includes('多模态') || inputText.includes('text') && inputText.includes('image')) {
        archGenerator.generateMultiModalArchitecture();
      } else if (inputText.includes('spectral') || inputText.includes('频谱') || inputText.includes('graph') || inputText.includes('图')) {
        archGenerator.generateSpectralDomainArchitecture();
      } else {
        // Call Doubao API for intelligent analysis
        const aiResponse = await callDoubaoApi(inputText);
        console.log('豆包API响应:', aiResponse);
        
        // Generate based on AI response
        if (aiResponse.includes('multimodal') || aiResponse.includes('encoder')) {
          archGenerator.generateMultiModalArchitecture();
        } else {
          archGenerator.generateSpectralDomainArchitecture();
        }
      }
    } catch (error) {
      console.error('生成失败:', error);
      // Fallback to default generation
      if (archGenerator) {
        archGenerator.generateMultiModalArchitecture();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setInputMode('image');
    console.log('图片上传成功:', file.name);
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (!fabricCanvas) return;

    // Create shadow for new elements
    const elementShadow = new Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 10,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 200,
        top: 200,
        fill: '#FFFFFF',
        stroke: '#4F46E5',
        strokeWidth: 2,
        width: 100,
        height: 60,
        rx: 8,
        ry: 8,
        shadow: elementShadow
      });
      fabricCanvas.add(rect);
      fabricCanvas.renderAll();
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 200,
        top: 200,
        fill: '#FFFFFF',
        stroke: '#22D3EE',
        strokeWidth: 2,
        radius: 40,
        shadow: elementShadow
      });
      fabricCanvas.add(circle);
      fabricCanvas.renderAll();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Floating controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button onClick={toggleFullscreen} variant="outline" size="sm">
            退出全屏
          </Button>
          <Button onClick={() => archGenerator?.generateMultiModalArchitecture()} variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            多模态架构
          </Button>
          <Button onClick={() => archGenerator?.generateSpectralDomainArchitecture()} variant="outline" size="sm">
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
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        {/* Left Sidebar - Tools & Templates */}
        <div className="w-80 bg-white/30 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col gap-6">
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
          <DoubaoApiConfig apiKey={apiKey} onApiKeyChange={setApiKey} />

          {/* Input Section */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
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
                  className="min-h-[100px] bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
                />
              </div>

              <div className="flex gap-2">
                <ImageUploadHandler
                  fabricCanvas={fabricCanvas}
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
                  <div className="flex items-center">
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
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
            <h3 className="text-sm font-medium text-gray-700 mb-3">快速生成</h3>
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => archGenerator?.generateMultiModalArchitecture()}
                className="w-full justify-start"
              >
                <Brain className="w-4 h-4 mr-2" />
                多模态架构
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => archGenerator?.generateSpectralDomainArchitecture()}
                className="w-full justify-start"
              >
                <Network className="w-4 h-4 mr-2" />
                频谱域架构
              </Button>
            </div>
          </Card>

          {/* Tools */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
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
                onClick={() => setActiveTool('text')}
                className="justify-start"
              >
                <Type className="w-4 h-4 mr-2" />
                文本
              </Button>
            </div>
          </Card>

          {/* Templates */}
          <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30 flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">模板风格</h3>
              <Layers className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'bg-white/70 shadow-md ring-2 ring-indigo-500/20'
                      : 'hover:bg-white/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md ${template.style} flex items-center justify-center text-white font-bold text-sm`}>
                    {template.preview}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{template.name}</span>
                  {selectedTemplate === template.id && (
                    <Badge variant="secondary" className="ml-auto text-xs">当前</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Center Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="h-16 bg-white/30 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800">架构图设计</h2>
              <Badge variant="outline" className="text-xs">实时编辑</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                全屏模式
              </Button>
              <Button variant="outline" size="sm">
                <Image className="w-4 h-4 mr-2" />
                导出PNG
              </Button>
              <Button variant="outline" size="sm">
                导出SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProperties(!showProperties)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-white relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="block w-full h-full"
            />
          </div>
        </div>

        {/* Right Properties Panel */}
        {showProperties && (
          <div className="w-80 bg-white/30 backdrop-blur-xl border-l border-white/20 p-6 animate-slide-in-right">
            <Card className="p-4 bg-white/50 backdrop-blur-sm border-white/30">
              <h3 className="text-sm font-medium text-gray-700 mb-4">属性面板</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-2">填充颜色</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-white border rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-indigo-500 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-emerald-500 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-amber-500 rounded cursor-pointer"></div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-2">边框颜色</label>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-800 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-indigo-600 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-emerald-600 rounded cursor-pointer"></div>
                    <div className="w-8 h-8 bg-red-500 rounded cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
