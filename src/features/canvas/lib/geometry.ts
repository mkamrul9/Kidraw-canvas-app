/**
 * Ray-casting algorithm to determine if a point lies inside a polygon.
 * Used by the lasso selection tool to detect which layers fall inside the freehand selection.
 *
 * @param point - [x, y] coordinates of the test point
 * @param vs - Flat array of polygon vertices [x1, y1, x2, y2, ...]
 * @returns true if the point is inside the polygon
 */
export function isPointInPolygon(point: number[], vs: number[]): boolean {
    const x = point[0];
    const y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 2; i < vs.length; j = i, i += 2) {
        const xi = vs[i];
        const yi = vs[i + 1];
        const xj = vs[j];
        const yj = vs[j + 1];
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export type SnapPoint = {
    x: number;
    y: number;
    type: 'top' | 'right' | 'bottom' | 'left';
    elementId: string;
};

export function getSnapPoints(layer: { id: string; x: number; y: number; width: number; height: number; type: string }): SnapPoint[] {
    if (['pen', 'eraser', 'straight-line', 'arrow', 'laser'].includes(layer.type)) {
        return [];
    }
    const W = layer.width;
    const H = layer.height;
    return [
        { x: layer.x + W / 2, y: layer.y, type: 'top', elementId: layer.id },
        { x: layer.x + W, y: layer.y + H / 2, type: 'right', elementId: layer.id },
        { x: layer.x + W / 2, y: layer.y + H, type: 'bottom', elementId: layer.id },
        { x: layer.x, y: layer.y + H / 2, type: 'left', elementId: layer.id },
    ];
}

export function getSnapPointCoords(layer: { x: number; y: number; width: number; height: number }, type: 'top' | 'right' | 'bottom' | 'left') {
    const W = layer.width;
    const H = layer.height;
    switch (type) {
        case 'top': return { x: layer.x + W / 2, y: layer.y };
        case 'right': return { x: layer.x + W, y: layer.y + H / 2 };
        case 'bottom': return { x: layer.x + W / 2, y: layer.y + H };
        case 'left': return { x: layer.x, y: layer.y + H / 2 };
    }
}

