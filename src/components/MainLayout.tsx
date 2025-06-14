
import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow } from 'fabric';
import { Upload, Wand2, FileText, Image, Layers, Square, Circle as CircleIcon, Type, Move, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

  const templates: Template[] = [
    { id: 'modern', name: '现代风格', style: 'bg-gradient-to-br from-blue-500 to-cyan-400', preview: 'M' },
    { id: 'academic', name: '学术风格', style: 'bg-gradient-to-br from-gray-600 to-gray-800', preview: 'A' },
    { id: 'aws', name: 'AWS风格', style: 'bg-gradient-to-br from-orange-500 to-yellow-400', preview: 'W' },
    { id: 'minimal', name: '简约风格', style: 'bg-gradient-to-br from-indigo-500 to-purple-600', preview: 'S' }
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#F8FAFC',
    });

    setFabricCanvas(canvas);

    // Create shadow with proper Fabric.js v6 properties
    const nodeShadow = new Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 10,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    // Add sample nodes for demonstration
    const node1 = new Rect({
      left: 100,
      top: 100,
      fill: '#FFFFFF',
      stroke: '#4F46E5',
      strokeWidth: 2,
      width: 120,
      height: 80,
      rx: 8,
      ry: 8,
      shadow: nodeShadow
    });

    const text1 = new FabricText('用户界面', {
      left: 120,
      top: 125,
      fontFamily: 'system-ui',
      fontSize: 14,
      fill: '#1F2937',
      fontWeight: '500'
    });

    const node2 = new Rect({
      left: 300,
      top: 200,
      fill: '#FFFFFF',
      stroke: '#10B981',
      strokeWidth: 2,
      width: 120,
      height: 80,
      rx: 8,
      ry: 8,
      shadow: nodeShadow
    });

    const text2 = new FabricText('API网关', {
      left: 330,
      top: 225,
      fontFamily: 'system-ui',
      fontSize: 14,
      fill: '#1F2937',
      fontWeight: '500'
    });

    canvas.add(node1, text1, node2, text2);
    canvas.renderAll();

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation with animation
    setTimeout(() => {
      if (fabricCanvas) {
        fabricCanvas.clear();
        fabricCanvas.backgroundColor = '#F8FAFC';
        
        // Create shadow for new nodes
        const nodeShadow = new Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 10,
          offsetX: 0,
          offsetY: 4,
          affectStroke: false
        });
        
        // Generate nodes with organic animation
        const nodes = [
          { text: '前端组件', x: 150, y: 100, color: '#4F46E5' },
          { text: 'API层', x: 400, y: 150, color: '#10B981' },
          { text: '数据库', x: 300, y: 300, color: '#F59E0B' },
          { text: 'AI处理', x: 600, y: 200, color: '#EF4444' }
        ];

        nodes.forEach((nodeData, index) => {
          setTimeout(() => {
            const node = new Rect({
              left: nodeData.x,
              top: nodeData.y,
              fill: '#FFFFFF',
              stroke: nodeData.color,
              strokeWidth: 2,
              width: 100,
              height: 60,
              rx: 8,
              ry: 8,
              opacity: 0,
              shadow: nodeShadow
            });

            const text = new FabricText(nodeData.text, {
              left: nodeData.x + 15,
              top: nodeData.y + 20,
              fontFamily: 'system-ui',
              fontSize: 12,
              fill: '#1F2937',
              fontWeight: '500',
              opacity: 0
            });

            fabricCanvas.add(node, text);
            
            // Animate in with updated Fabric.js v6 syntax
            node.animate('opacity', 1, {
              duration: 500,
              easing: function(t: number) { return t * t * (3 - 2 * t); },
              onChange: () => fabricCanvas.renderAll()
            });
            text.animate('opacity', 1, {
              duration: 500,
              easing: function(t: number) { return t * t * (3 - 2 * t); },
              onChange: () => fabricCanvas.renderAll()
            });
          }, index * 200);
        });
      }
      setIsGenerating(false);
    }, 1500);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setInputMode('image');
    }
  };

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
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
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
                    生成中...
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
              <h2 className="text-lg font-semibold text-gray-800">无标题项目</h2>
              <Badge variant="outline" className="text-xs">未保存</Badge>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20">
              <canvas
                ref={canvasRef}
                className="block"
                style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)' }}
              />
            </div>
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
