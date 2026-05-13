export type Color = string;
export type ShapeType = 'rectangle' | 'ellipse';
export type LayerType = ShapeType | 'pen' | 'text' | 'eraser';

// Added 'hand' and 'shape'
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
    penSize?: number; // Track pen thickness
};