export type Color = string;

export type LayerType = 'rectangle' | 'ellipse' | 'pen' | 'text';

export type Tool = 'select' | 'rectangle' | 'ellipse' | 'pen';

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
};