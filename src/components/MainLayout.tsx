import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow, Line } from 'fabric';
import { Upload, Wand2, FileText, Image, Layers, Square, Circle as CircleIcon, Type, Move, Settings, Brain, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DoubaoApiConfig } from '@/components/DoubaoApiConfig';
import { ImageUploadHandler } from '@/components/ImageUploadHandler';
import { ArchitectureGenerator } from '@/components/ArchitectureGenerator';
import { Theme, themes } from '@/lib/themes';
import { ThemeSelector } from '@/components/ThemeSelector';

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
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'text'>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [apiKey, setApiKey] = useState('66517a68-24bb-4f60-94dc-1fe4c3b89e26');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [archGenerator, setArchGenerator] = useState<ArchitectureGenerator | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(themes[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: activeTheme?.palette.background || '#FFFFFF',
    });

    setFabricCanvas(canvas);
    
    const generator = new ArchitectureGenerator(canvas);
    setArchGenerator(generator);
    
    if (activeTheme) {
      addDotGridBackground(canvas, activeTheme.palette.grid);
    } else {
      addDotGridBackground(canvas);
    }

    // Panning logic
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;

    canvas.on('mouse:down', function(opt) {
        const evt = opt.e;
        if (evt instanceof MouseEvent && evt.button === 1) { // Middle mouse button
            isPanning = true;
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            canvas.defaultCursor = 'grabbing';
            canvas.requestRenderAll();
        }
    });

    canvas.on('mouse:move', function(opt) {
        if (isPanning) {
            const e = opt.e;
            if (e instanceof MouseEvent) {
                const vpt = this.viewportTransform;
                if (vpt) {
                    vpt[4] += e.clientX - lastPosX;
                    vpt[5] += e.clientY - lastPosY;
                    this.requestRenderAll();
                }
                lastPosX = e.clientX;
                lastPosY = e.clientY;
            }
        }
    });

    canvas.on('mouse:up', function() {
        if (isPanning) {
            this.setViewportTransform(this.viewportTransform || [1, 0, 0, 1, 0, 0]);
            isPanning = false;
            canvas.defaultCursor = 'default';
            canvas.requestRenderAll();
        }
    });

    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (activeTheme) {
        addDotGridBackground(canvas, activeTheme.palette.grid);
      } else {
        addDotGridBackground(canvas);
      }
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [isFullscreen, activeTheme]);

  const addDotGridBackground = (canvas: FabricCanvas, color = '#E5E7EB') => {
    canvas.getObjects('rect').forEach(obj => {
        if(obj.get('type') === 'grid-dot') canvas.remove(obj)
    });
    canvas.getObjects('circle').forEach(obj => {
        if(obj.get('type') === 'grid-dot') canvas.remove(obj)
    });

    const spacing = 20;
    const canvasWidth = canvas.width || window.innerWidth;
    const canvasHeight = canvas.height || window.innerHeight;
    const gridGroup = []

    for (let x = 0; x <= canvasWidth; x += spacing) {
      for (let y = 0; y <= canvasHeight; y += spacing) {
        const dot = new Circle({
          left: x,
          top: y,
          radius: 1,
          fill: color,
          selectable: false,
          evented: false,
          // @ts-ignore
          type: 'grid-dot'
        });
        gridGroup.push(dot)
      }
    }
    canvas.add(...gridGroup);
    gridGroup.forEach(dot => canvas.sendObjectToBack(dot));
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

  const callDoubaoVisionApi = async (base64Image: string) => {
    try {
      const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'doubao-pro-32k',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `请分析这张架构图，并以JSON格式返回其节点和连接。JSON应该包含一个'nodes'数组和一个'connections'数组。
                  每个节点应有 'id', 'label', 'x', 'y'。
                  每个连接应有 'from'和 'to'，使用节点的id。
                  节点的x, y坐标应大致反映其在图像中的相对位置。`
                },
                {
                  type: 'image_url',
                  image_url: { url: base64Image }
                }
              ]
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('豆包Vision API调用失败:', error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim() || !archGenerator) return;
    
    setIsGenerating(true);
    
    try {
      const aiResponse = await callDoubaoApi(inputText);
      console.log('豆包API响应:', aiResponse);
      
      try {
        const architectureData = JSON.parse(aiResponse);
        if (architectureData.nodes && architectureData.connections) {
            const nodes = architectureData.nodes.map((n: any) => ({
                id: n.id,
                label: n.label,
                type: 'process',
                x: n.x || Math.random() * 800,
                y: n.y || Math.random() * 600,
                width: 120,
                height: 60,
                color: '#3B82F6'
            }));
            const connections = architectureData.connections;
            archGenerator.generateFromData(nodes, connections);
            setIsGenerating(false);
            return;
        }
      } catch (e) {
          console.warn("AI响应不是有效的JSON，将回退到关键词匹配。");
      }

      // Fallback to keyword matching
      if (aiResponse.includes('multimodal') || aiResponse.includes('多模态') || aiResponse.includes('encoder')) {
        archGenerator.generateMultiModalArchitecture();
      } else {
        archGenerator.generateSpectralDomainArchitecture();
      }
    } catch (error) {
      console.error('生成失败:', error);
      if (archGenerator) {
        archGenerator.generateMultiModalArchitecture();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (file: File) => {
    setInputMode('image');
    setIsGenerating(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64Image = e.target?.result as string;
        if (!base64Image || !archGenerator) return;

        const aiResponse = await callDoubaoVisionApi(base64Image);
        console.log('豆包Vision API响应:', aiResponse);
        
        const cleanedJsonResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const architectureData = JSON.parse(cleanedJsonResponse);

        if (architectureData.nodes && architectureData.connections) {
            const nodes = architectureData.nodes.map((n: any) => ({
                id: n.id,
                label: n.label,
                type: 'process',
                x: n.x || Math.random() * 800,
                y: n.y || Math.random() * 600,
                width: 120,
                height: 60,
                color: '#3B82F6'
            }));
            const connections = architectureData.connections;
            archGenerator.generateFromData(nodes, connections);
        } else {
            throw new Error("从AI响应中解析JSON失败或格式不正确");
        }
      } catch (error) {
        console.error('图片分析生成失败:', error);
        // Fallback to a default architecture on error
        if (archGenerator) {
          archGenerator.generateMultiModalArchitecture();
        }
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);
    if (!fabricCanvas || !activeTheme) return;

    // Create shadow for new elements
    const elementShadow = new Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 10,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    const palette = activeTheme.palette;

    if (tool === 'rectangle') {
      const rect = new Rect({
        left: 200,
        top: 200,
        fill: palette.nodeFill,
        stroke: palette.nodeStroke,
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
        fill: palette.nodeFill,
        stroke: palette.nodeStroke,
        strokeWidth: 2,
        radius: 40,
        shadow: elementShadow
      });
      fabricCanvas.add(circle);
      fabricCanvas.renderAll();
    } else if (tool === 'text') {
        const text = new FabricText('新文本', {
            left: 200,
            top: 200,
            fontFamily: 'system-ui',
            fontSize: 20,
            fill: palette.nodeText,
            shadow: elementShadow,
        });
        fabricCanvas.add(text);
        fabricCanvas.renderAll();
    }
  };

  const handleThemeSelect = (theme: Theme) => {
    setActiveTheme(theme);
    if (!fabricCanvas) return;
    const palette = theme.palette;

    fabricCanvas.backgroundColor = palette.background;
    addDotGridBackground(fabricCanvas, palette.grid);

    fabricCanvas.getObjects().forEach(obj => {
        const nodeId = obj.get('nodeId');
        if (nodeId) { // Is a node part
            if (obj instanceof Rect) { // Node body
                obj.set({
                    fill: palette.nodeFill,
                    stroke: palette.nodeStroke
                });
            } else if (obj instanceof FabricText) { // Node text
                obj.set('fill', palette.nodeText);
            }
        } else if (obj instanceof Line) { // Connection
            obj.set('stroke', palette.connection);
        } else if (obj.get('isArrowHead')) { // Arrow
            obj.set('fill', palette.arrow);
            obj.set('stroke', 'transparent'); 
        }
    });

    fabricCanvas.renderAll();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        {/* Center Canvas - positioned at the bottom layer */}
        <div className="absolute inset-0 z-0">
            <canvas
              ref={canvasRef}
              className="block w-full h-full"
            />
        </div>

        {/* Left Sidebar - floating on top */}
        <div className="absolute top-0 left-0 h-full w-80 bg-white/30 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col gap-6 z-20 overflow-y-auto">
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

        {/* Top Bar - floating */}
        <div className={`absolute top-0 h-16 bg-white/30 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-6 z-10`} style={{ left: '20rem', right: showProperties ? '20rem' : '0' }}>
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

        {/* Right Properties Panel - floating */}
        {showProperties && (
          <div className="absolute top-0 right-0 h-full w-80 bg-white/30 backdrop-blur-xl border-l border-white/20 p-6 animate-slide-in-right z-20">
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
  );
};
