import React from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow, Line, Polygon, Path } from 'fabric';
import { Theme } from '@/lib/themes';

type Palette = Theme['palette'];

interface ArchitectureNode {
  id: string;
  label: string;
  type: 'input' | 'process' | 'output' | 'neural' | 'encoder' | 'decoder' | 'attention' | 'embedding' | 'pooling' | 'classifier';
  shape?: 'rectangle' | 'circle' | 'diamond' | 'triangle' | 'hexagon' | 'ellipse';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
}

interface ArchitectureConnection {
  from: string;
  to: string;
  type: 'forward' | 'backward' | 'bidirectional' | 'attention' | 'residual';
  style?: 'solid' | 'dashed' | 'dotted';
}

export class ArchitectureGenerator {
  private canvas: FabricCanvas;

  constructor(canvas: FabricCanvas) {
    this.canvas = canvas;
  }

  private clearDiagramElements() {
    const diagramElements = this.canvas.getObjects().filter(obj => obj.get('isDiagramElement'));
    diagramElements.forEach(obj => this.canvas.remove(obj));
  }

  // Enhanced multimodal architecture with more detailed components
  generateMultiModalArchitecture(palette: Palette) {
    this.clearDiagramElements();

    const nodes: ArchitectureNode[] = [
      // Input modalities
      { id: 'prompt', label: 'Prompt', type: 'input', shape: 'rectangle', x: 50, y: 200, width: 120, height: 60 },
      { id: 'und_image', label: 'Und. Image', type: 'input', shape: 'rectangle', x: 50, y: 300, width: 120, height: 60 },
      { id: 'gen_image', label: 'Gen. Image', type: 'input', shape: 'rectangle', x: 50, y: 400, width: 120, height: 60 },

      // Encoders with different shapes
      { id: 'text_encoder', label: 'Text\nEncoder', type: 'encoder', shape: 'hexagon', x: 250, y: 200, width: 100, height: 80 },
      { id: 'und_encoder', label: 'Und.\nEncoder', type: 'encoder', shape: 'hexagon', x: 250, y: 300, width: 100, height: 80 },
      { id: 'gen_encoder', label: 'Gen.\nEncoder', type: 'encoder', shape: 'hexagon', x: 250, y: 400, width: 100, height: 80 },

      // Embedding and feature processing
      { id: 'mmu_embedding', label: 'MMU\nEmbedding', type: 'embedding', shape: 'ellipse', x: 400, y: 150, width: 100, height: 60 },
      { id: 't2i_embedding', label: 'T2I\nEmbedding', type: 'embedding', shape: 'ellipse', x: 400, y: 350, width: 100, height: 60 },

      // Neural network core with attention
      { id: 'mamba2', label: 'Mamba-2', type: 'neural', shape: 'circle', x: 550, y: 280, width: 120, height: 120 },
      { id: 'attention', label: 'Attention\nLayer', type: 'attention', shape: 'diamond', x: 550, y: 150, width: 100, height: 80 },

      // Output heads with different shapes
      { id: 'text_head', label: 'Text\nHead', type: 'decoder', shape: 'triangle', x: 750, y: 200, width: 100, height: 80 },
      { id: 'image_head', label: 'Image\nHead', type: 'decoder', shape: 'triangle', x: 750, y: 380, width: 100, height: 80 },

      // Final outputs
      { id: 'text_output', label: 'The dog is cute', type: 'output', shape: 'rectangle', x: 900, y: 200, width: 140, height: 60 },
      { id: 'image_output', label: 'Generated Image', type: 'output', shape: 'rectangle', x: 900, y: 380, width: 140, height: 60 },
    ];

    const connections: ArchitectureConnection[] = [
      { from: 'prompt', to: 'text_encoder', type: 'forward' },
      { from: 'und_image', to: 'und_encoder', type: 'forward' },
      { from: 'gen_image', to: 'gen_encoder', type: 'forward' },
      { from: 'text_encoder', to: 'mmu_embedding', type: 'forward' },
      { from: 'und_encoder', to: 'mamba2', type: 'forward' },
      { from: 'gen_encoder', to: 't2i_embedding', type: 'forward' },
      { from: 'mmu_embedding', to: 'attention', type: 'attention', style: 'dashed' },
      { from: 'attention', to: 'mamba2', type: 'forward' },
      { from: 't2i_embedding', to: 'mamba2', type: 'forward' },
      { from: 'mamba2', to: 'text_head', type: 'forward' },
      { from: 'mamba2', to: 'image_head', type: 'forward' },
      { from: 'text_head', to: 'text_output', type: 'forward' },
      { from: 'image_head', to: 'image_output', type: 'forward' },
      // Residual connections
      { from: 'attention', to: 'text_head', type: 'residual', style: 'dotted' },
    ];

    this.createNodes(nodes, palette);
    this.createConnections(nodes, connections, palette);
    this.canvas.renderAll();
  }

  generateSpectralDomainArchitecture(palette: Palette) {
    this.clearDiagramElements();

    const nodes: ArchitectureNode[] = [
      // Node Construction
      { id: 'input_nodes', label: 'Node Construction\n(GRU layers)', type: 'process', x: 50, y: 50, width: 150, height: 120 },
      
      // Speaker Interaction Graph
      { id: 'speaker_graph', label: 'Speaker Interaction\nGraph', type: 'neural', x: 300, y: 50, width: 140, height: 80 },
      
      // Context Interaction Graph
      { id: 'context_graph', label: 'Context Interaction\nGraph', type: 'neural', x: 300, y: 150, width: 140, height: 80 },
      
      // Aggregation layers
      { id: 'local_agg', label: 'Local\nAggregation', type: 'process', x: 500, y: 80, width: 120, height: 60 },
      { id: 'freq_agg', label: 'Frequency-aware\nAggregation', type: 'process', x: 500, y: 160, width: 120, height: 60 },
      
      // Final layers
      { id: 'attention', label: 'Attention\nLayer', type: 'neural', x: 700, y: 100, width: 100, height: 80 },
      { id: 'classifier', label: 'Emotion\nClassifier', type: 'output', x: 700, y: 200, width: 100, height: 80 },
    ];

    const connections: ArchitectureConnection[] = [
      { from: 'input_nodes', to: 'speaker_graph', type: 'forward' },
      { from: 'input_nodes', to: 'context_graph', type: 'forward' },
      { from: 'speaker_graph', to: 'local_agg', type: 'forward' },
      { from: 'context_graph', to: 'freq_agg', type: 'forward' },
      { from: 'local_agg', to: 'attention', type: 'forward' },
      { from: 'freq_agg', to: 'attention', type: 'forward' },
      { from: 'attention', to: 'classifier', type: 'forward' },
    ];

    this.createNodes(nodes, palette);
    this.createConnections(nodes, connections, palette);
    this.canvas.renderAll();
  }

  generateFromData(nodes: ArchitectureNode[], connections: ArchitectureConnection[], palette: Palette) {
    this.clearDiagramElements();
    this.createNodes(nodes, palette);
    this.createConnections(nodes, connections, palette);
    this.canvas.renderAll();
  }

  private createNodes(nodes: ArchitectureNode[], palette: Palette) {
    const shadow = new Shadow({
      color: 'rgba(0,0,0,0.15)',
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    nodes.forEach(node => {
      let shape;
      const baseProps = {
        left: node.x,
        top: node.y,
        fill: node.color || palette.nodeFill,
        stroke: palette.nodeStroke,
        strokeWidth: 2,
        shadow,
      };

      switch (node.shape || 'rectangle') {
        case 'circle':
          shape = new Circle({
            ...baseProps,
            radius: Math.min(node.width, node.height) / 2,
          });
          break;
        
        case 'diamond':
          const diamondPoints = [
            { x: node.width / 2, y: 0 },
            { x: node.width, y: node.height / 2 },
            { x: node.width / 2, y: node.height },
            { x: 0, y: node.height / 2 }
          ];
          shape = new Polygon(diamondPoints, {
            ...baseProps,
          });
          break;
        
        case 'triangle':
          const trianglePoints = [
            { x: node.width / 2, y: 0 },
            { x: node.width, y: node.height },
            { x: 0, y: node.height }
          ];
          shape = new Polygon(trianglePoints, {
            ...baseProps,
          });
          break;
        
        case 'hexagon':
          const hexPoints = [
            { x: node.width * 0.25, y: 0 },
            { x: node.width * 0.75, y: 0 },
            { x: node.width, y: node.height * 0.5 },
            { x: node.width * 0.75, y: node.height },
            { x: node.width * 0.25, y: node.height },
            { x: 0, y: node.height * 0.5 }
          ];
          shape = new Polygon(hexPoints, {
            ...baseProps,
          });
          break;
        
        case 'ellipse':
          shape = new Circle({
            ...baseProps,
            radiusX: node.width / 2,
            radiusY: node.height / 2,
          });
          break;
        
        default: // rectangle
          shape = new Rect({
            ...baseProps,
            width: node.width,
            height: node.height,
            rx: node.type === 'neural' ? 15 : 8,
            ry: node.type === 'neural' ? 15 : 8,
          });
      }

      const text = new FabricText(node.label, {
        left: node.x + node.width / 2,
        top: node.y + node.height / 2,
        originX: 'center',
        originY: 'center',
        fontFamily: 'system-ui',
        fontSize: 12,
        fill: palette.nodeText,
        fontWeight: '500',
        textAlign: 'center',
      });

      shape.set('nodeId', node.id);
      shape.set('isDiagramElement', true);
      text.set('nodeId', node.id);
      text.set('isDiagramElement', true);

      this.canvas.add(shape, text);
    });
  }

  private createConnections(nodes: ArchitectureNode[], connections: ArchitectureConnection[], palette: Palette) {
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      const lineProps: any = {
        stroke: conn.type === 'attention' ? '#FF6B6B' : 
                conn.type === 'residual' ? '#4ECDC4' : palette.connection,
        strokeWidth: conn.type === 'attention' ? 3 : 2,
        selectable: false,
        evented: false,
      };

      // Add line style
      if (conn.style === 'dashed') {
        lineProps.strokeDashArray = [5, 5];
      } else if (conn.style === 'dotted') {
        lineProps.strokeDashArray = [2, 2];
      }

      const line = new Line([
        fromNode.x + fromNode.width,
        fromNode.y + fromNode.height / 2,
        toNode.x,
        toNode.y + toNode.height / 2
      ], lineProps);

      // Enhanced arrow head
      const arrowSize = conn.type === 'attention' ? 10 : 8;
      const arrowHead = new Polygon([
        { x: 0, y: 0 },
        { x: -arrowSize, y: -arrowSize/2 },
        { x: -arrowSize, y: arrowSize/2 }
      ], {
        left: toNode.x,
        top: toNode.y + toNode.height / 2,
        fill: lineProps.stroke,
        stroke: 'transparent',
        selectable: false,
        evented: false,
      });

      arrowHead.set('isArrowHead', true);
      arrowHead.set('isDiagramElement', true);
      line.set('isDiagramElement', true);

      this.canvas.add(line, arrowHead);
      this.canvas.sendObjectToBack(line);
      this.canvas.sendObjectToBack(arrowHead);
    });
  }

  // Method to create custom shapes for tools
  createShape(shapeType: string, x: number, y: number, palette: Palette) {
    const shadow = new Shadow({
      color: 'rgba(0,0,0,0.1)',
      blur: 10,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    const baseProps = {
      left: x,
      top: y,
      fill: palette.nodeFill,
      stroke: palette.nodeStroke,
      strokeWidth: 2,
      shadow
    };

    switch (shapeType) {
      case 'diamond':
        const diamondPoints = [
          { x: 50, y: 0 },
          { x: 100, y: 30 },
          { x: 50, y: 60 },
          { x: 0, y: 30 }
        ];
        return new Polygon(diamondPoints, baseProps);
      
      case 'triangle':
        const trianglePoints = [
          { x: 50, y: 0 },
          { x: 100, y: 60 },
          { x: 0, y: 60 }
        ];
        return new Polygon(trianglePoints, baseProps);
      
      default:
        return null;
    }
  }
}
