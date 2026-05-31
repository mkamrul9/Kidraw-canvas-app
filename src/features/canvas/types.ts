export type Color = string;

// Added arrow, straight-line, and hexagon
export type ShapeType = 'rectangle' | 'ellipse' | 'triangle' | 'diamond' | 'star' | 'arrow' | 'straight-line' | 'hexagon';

export type LayerType = ShapeType | 'pen' | 'pencil' | 'text' | 'eraser' | 'comment' | 'image' | 'embed' | 'sticky' | 'frame' | 'pdf' | 'group' | 'code';

export type Tool = 'select' | 'lasso' | 'hand' | 'shape' | 'pen' | 'pencil' | 'text' | 'eraser' | 'object-eraser' | 'comment' | 'laser' | 'image' | 'embed' | 'sticky' | 'frame' | 'pdf' | 'code';

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
    opacity?: number;
    src?: string;
    embedUrl?: string;
    startBinding?: { elementId: string; snapPoint: 'top' | 'right' | 'bottom' | 'left' };
    endBinding?: { elementId: string; snapPoint: 'top' | 'right' | 'bottom' | 'left' };
    parentId?: string;
    fontSize?: number;
    pdfPages?: string[];
    pdfPageIndex?: number;
    zIndex?: number;
    codeLanguage?: string;
};
