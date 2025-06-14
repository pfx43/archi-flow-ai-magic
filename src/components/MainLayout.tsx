import React, { useState, useRef, useEffect } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow, Line } from 'fabric';
import { ArchitectureGenerator } from '@/components/ArchitectureGenerator';
import { Theme, themes } from '@/lib/themes';
import { LeftSidebar } from './LeftSidebar';
import { TopBar } from './TopBar';
import { FullscreenView } from './FullscreenView';

export const MainLayout = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [inputText, setInputText] = useState('');
  const [inputMode, setInputMode] = useState<'simple' | 'long' | 'image'>('simple');
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'text'>('select');
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKey, setApiKey] = useState('66517a68-24bb-4f60-94dc-1fe4c3b89e26');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [archGenerator, setArchGenerator] = useState<ArchitectureGenerator | null>(null);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(themes[0]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#FFFFFF',
    });

    setFabricCanvas(canvas);
    
    const generator = new ArchitectureGenerator(canvas);
    setArchGenerator(generator);
    
    addDotGridBackground(canvas);

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
      addDotGridBackground(canvas);
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [isFullscreen]);

  const addDotGridBackground = (canvas: FabricCanvas) => {
    const gridDots = canvas.getObjects().filter(obj => obj.get('isGridDot'));
    gridDots.forEach(dot => canvas.remove(dot));

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
          fill: '#E5E7EB',
          selectable: false,
          evented: false,
          // @ts-ignore
          isGridDot: true
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
    if (!inputText.trim() || !archGenerator || !activeTheme) return;
    
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
            }));
            const connections = architectureData.connections;
            archGenerator.generateFromData(nodes, connections, activeTheme.palette);
            setIsGenerating(false);
            return;
        }
      } catch (e) {
          console.warn("AI响应不是有效的JSON，将回退到关键词匹配。");
      }

      // Fallback to keyword matching
      if (aiResponse.includes('multimodal') || aiResponse.includes('多模态') || aiResponse.includes('encoder')) {
        archGenerator.generateMultiModalArchitecture(activeTheme.palette);
      } else {
        archGenerator.generateSpectralDomainArchitecture(activeTheme.palette);
      }
    } catch (error) {
      console.error('生成失败:', error);
      if (archGenerator && activeTheme) {
        archGenerator.generateMultiModalArchitecture(activeTheme.palette);
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
        if (!base64Image || !archGenerator || !activeTheme) return;

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
            }));
            const connections = architectureData.connections;
            archGenerator.generateFromData(nodes, connections, activeTheme.palette);
        } else {
            throw new Error("从AI响应中解析JSON失败或格式不正确");
        }
      } catch (error) {
        console.error('图片分析生成失败:', error);
        // Fallback to a default architecture on error
        if (archGenerator && activeTheme) {
          archGenerator.generateMultiModalArchitecture(activeTheme.palette);
        }
      } finally {
        setIsGenerating(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToolClick = (tool: 'rectangle' | 'circle' | 'text') => {
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

    fabricCanvas.getObjects().forEach(obj => {
        // Skip grid dots
        if (obj.get('isGridDot')) return;
        
        // Handle node bodies (Rect, Circle)
        if (obj instanceof Rect || obj instanceof Circle) {
            // Special case for arrows
            if (obj.get('isArrowHead')) {
                obj.set('fill', palette.arrow);
                obj.set('stroke', 'transparent');
            } else {
                 obj.set({
                    fill: palette.nodeFill,
                    stroke: palette.nodeStroke
                 });
            }
        } 
        // Handle text
        else if (obj instanceof FabricText) {
            obj.set('fill', palette.nodeText);
        } 
        // Handle connection lines
        else if (obj instanceof Line) {
            obj.set('stroke', palette.connection);
        }
    });

    fabricCanvas.renderAll();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isFullscreen) {
    return (
      <FullscreenView
        canvasRef={canvasRef}
        toggleFullscreen={toggleFullscreen}
        archGenerator={archGenerator}
        activeTheme={activeTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Center Canvas - positioned at the bottom layer */}
        <div className="absolute inset-0 z-0">
            <canvas
              ref={canvasRef}
              className="block w-full h-full"
            />
        </div>

        {/* Left Sidebar */}
        <LeftSidebar
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          inputMode={inputMode}
          setInputMode={setInputMode}
          inputText={inputText}
          setInputText={setInputText}
          handleImageUpload={handleImageUpload}
          handleGenerate={handleGenerate}
          isGenerating={isGenerating}
          archGenerator={archGenerator}
          activeTheme={activeTheme}
          handleThemeSelect={handleThemeSelect}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleToolClick={handleToolClick}
        />

        {/* Top Bar */}
        <TopBar toggleFullscreen={toggleFullscreen} />
    </div>
  );
};
