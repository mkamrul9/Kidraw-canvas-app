export type Color = string;

export type LayerType = 'rectangle' | 'ellipse' | 'path' | 'text';

export type Camera = {
    x: number;
    y: number;
};

export type Layer = {
    type: LayerType;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    stroke?: Color;
};