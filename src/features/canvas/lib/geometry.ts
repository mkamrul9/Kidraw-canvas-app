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
