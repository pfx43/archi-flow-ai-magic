import React from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricText, Shadow, Line } from 'fabric';

interface ArchitectureNode {
  id: string;
  label: string;
  type: 'input' | 'process' | 'output' | 'neural' | 'encoder' | 'decoder';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface ArchitectureConnection {
  from: string;
  to: string;
  type: 'forward' | 'backward' | 'bidirectional';
}

export class ArchitectureGenerator {
  private canvas: FabricCanvas;

  constructor(canvas: FabricCanvas) {
    this.canvas = canvas;
  }

  generateMultiModalArchitecture() {
    this.canvas.clear();
    this.addDotGridBackground();

    const nodes: ArchitectureNode[] = [
      // Input nodes
      { id: 'prompt', label: 'Prompt', type: 'input', x: 50, y: 200, width: 120, height: 60, color: '#3B82F6' },
      { id: 'und_image', label: 'Und. Image', type: 'input', x: 50, y: 300, width: 120, height: 60, color: '#F59E0B' },
      { id: 'gen_image', label: 'Gen. Image', type: 'input', x: 50, y: 400, width: 120, height: 60, color: '#EF4444' },

      // Encoder nodes
      { id: 'text_encoder', label: 'Text\nEncoder', type: 'encoder', x: 250, y: 200, width: 100, height: 80, color: '#3B82F6' },
      { id: 'und_encoder', label: 'Und.\nEncoder', type: 'encoder', x: 250, y: 300, width: 100, height: 80, color: '#F59E0B' },
      { id: 'gen_encoder', label: 'Gen.\nEncoder', type: 'encoder', x: 250, y: 400, width: 100, height: 80, color: '#EF4444' },

      // Neural network core
      { id: 'mamba2', label: 'Mamba-2', type: 'neural', x: 500, y: 300, width: 120, height: 100, color: '#10B981' },

      // Output heads
      { id: 'text_head', label: 'Text\nHead', type: 'decoder', x: 700, y: 200, width: 100, height: 80, color: '#3B82F6' },
      { id: 'image_head', label: 'Image\nHead', type: 'decoder', x: 700, y: 400, width: 100, height: 80, color: '#EF4444' },

      // Final outputs
      { id: 'text_output', label: 'The dog is cute', type: 'output', x: 850, y: 200, width: 140, height: 60, color: '#3B82F6' },
      { id: 'image_output', label: 'Generated Image', type: 'output', x: 850, y: 400, width: 140, height: 60, color: '#EF4444' },
    ];

    const connections: ArchitectureConnection[] = [
      { from: 'prompt', to: 'text_encoder', type: 'forward' },
      { from: 'und_image', to: 'und_encoder', type: 'forward' },
      { from: 'gen_image', to: 'gen_encoder', type: 'forward' },
      { from: 'text_encoder', to: 'mamba2', type: 'forward' },
      { from: 'und_encoder', to: 'mamba2', type: 'forward' },
      { from: 'gen_encoder', to: 'mamba2', type: 'forward' },
      { from: 'mamba2', to: 'text_head', type: 'forward' },
      { from: 'mamba2', to: 'image_head', type: 'forward' },
      { from: 'text_head', to: 'text_output', type: 'forward' },
      { from: 'image_head', to: 'image_output', type: 'forward' },
    ];

    this.createNodes(nodes);
    this.createConnections(nodes, connections);
    this.canvas.renderAll();
  }

  generateSpectralDomainArchitecture() {
    this.canvas.clear();
    this.addDotGridBackground();

    const nodes: ArchitectureNode[] = [
      // Node Construction
      { id: 'input_nodes', label: 'Node Construction\n(GRU layers)', type: 'process', x: 50, y: 50, width: 150, height: 120, color: '#8B5CF6' },
      
      // Speaker Interaction Graph
      { id: 'speaker_graph', label: 'Speaker Interaction\nGraph', type: 'neural', x: 300, y: 50, width: 140, height: 80, color: '#06B6D4' },
      
      // Context Interaction Graph
      { id: 'context_graph', label: 'Context Interaction\nGraph', type: 'neural', x: 300, y: 150, width: 140, height: 80, color: '#F97316' },
      
      // Aggregation layers
      { id: 'local_agg', label: 'Local\nAggregation', type: 'process', x: 500, y: 80, width: 120, height: 60, color: '#3B82F6' },
      { id: 'freq_agg', label: 'Frequency-aware\nAggregation', type: 'process', x: 500, y: 160, width: 120, height: 60, color: '#10B981' },
      
      // Final layers
      { id: 'attention', label: 'Attention\nLayer', type: 'neural', x: 700, y: 100, width: 100, height: 80, color: '#6366F1' },
      { id: 'classifier', label: 'Emotion\nClassifier', type: 'output', x: 700, y: 200, width: 100, height: 80, color: '#EF4444' },
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

    this.createNodes(nodes);
    this.createConnections(nodes, connections);
    this.canvas.renderAll();
  }

  generateFromData(nodes: ArchitectureNode[], connections: ArchitectureConnection[]) {
    this.canvas.clear();
    this.addDotGridBackground();
    this.createNodes(nodes);
    this.createConnections(nodes, connections);
    this.canvas.renderAll();
  }

  private addDotGridBackground() {
    const spacing = 20;
    const canvasWidth = this.canvas.width || 1200;
    const canvasHeight = this.canvas.height || 800;

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
        this.canvas.add(dot);
        this.canvas.sendObjectToBack(dot);
      }
    }
  }

  private createNodes(nodes: ArchitectureNode[]) {
    const shadow = new Shadow({
      color: 'rgba(0,0,0,0.15)',
      blur: 8,
      offsetX: 0,
      offsetY: 4,
      affectStroke: false
    });

    nodes.forEach(node => {
      const rect = new Rect({
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        fill: '#FFFFFF',
        stroke: node.color,
        strokeWidth: 2,
        rx: node.type === 'neural' ? 15 : 8,
        ry: node.type === 'neural' ? 15 : 8,
        shadow,
      });

      const text = new FabricText(node.label, {
        left: node.x + node.width / 2,
        top: node.y + node.height / 2,
        originX: 'center',
        originY: 'center',
        fontFamily: 'system-ui',
        fontSize: 12,
        fill: '#1F2937',
        fontWeight: '500',
        textAlign: 'center',
      });

      rect.set('nodeId', node.id);
      text.set('nodeId', node.id);

      this.canvas.add(rect, text);
    });
  }

  private createConnections(nodes: ArchitectureNode[], connections: ArchitectureConnection[]) {
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from);
      const toNode = nodes.find(n => n.id === conn.to);
      
      if (!fromNode || !toNode) return;

      const line = new Line([
        fromNode.x + fromNode.width,
        fromNode.y + fromNode.height / 2,
        toNode.x,
        toNode.y + toNode.height / 2
      ], {
        stroke: '#6B7280',
        strokeWidth: 2,
        selectable: false,
        evented: false,
      });

      // Add arrow head
      const arrowHead = new Rect({
        left: toNode.x - 8,
        top: toNode.y + toNode.height / 2 - 4,
        width: 8,
        height: 8,
        fill: '#6B7280',
        angle: 45,
        selectable: false,
        evented: false,
      });
      arrowHead.set('isArrowHead', true);

      this.canvas.add(line, arrowHead);
      this.canvas.sendObjectToBack(line);
      this.canvas.sendObjectToBack(arrowHead);
    });
  }
}
