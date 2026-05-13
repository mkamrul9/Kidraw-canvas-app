export type Color = string;
// Added arrow, straight-line, and hexagon
export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'diamond' | 'star' | 'arrow' | 'straight-line' | 'hexagon';
export type LayerType = ShapeType | 'pen' | 'text' | 'eraser';

export type Tool = 'select' | 'hand' | 'shape' | 'pen' | 'text' | 'eraser' | 'object-eraser';

export type Camera = {
    x: number;
    y: number;
};

export type Layer = {
    id: string;
    type: LayerType;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    stroke?: Color;
    points?: number[];
    text?: string;
    eraserSize?: number;
    penSize?: number;
    opacity?: number; // NEW: Track the opacity of individual shapes!
};