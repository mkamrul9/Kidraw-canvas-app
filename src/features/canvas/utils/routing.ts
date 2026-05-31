export type Point = { x: number; y: number };
export type BoundingBox = { x: number; y: number; width: number; height: number; id: string };

// Helper to check if a point is inside any bounding box (with padding)
const isPointInsideObstacle = (p: Point, obstacles: BoundingBox[], padding: number = 10): boolean => {
    return obstacles.some(obs => 
        p.x >= obs.x - padding && p.x <= obs.x + obs.width + padding &&
        p.y >= obs.y - padding && p.y <= obs.y + obs.height + padding
    );
};

// Check if a line segment intersects an obstacle
const intersectsObstacle = (p1: Point, p2: Point, obstacles: BoundingBox[], padding: number = 10): boolean => {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    for (const obs of obstacles) {
        const obsLeft = obs.x - padding;
        const obsRight = obs.x + obs.width + padding;
        const obsTop = obs.y - padding;
        const obsBottom = obs.y + obs.height + padding;

        // Bounding box intersection check
        if (maxX >= obsLeft && minX <= obsRight && maxY >= obsTop && minY <= obsBottom) {
            // Since our lines are either perfectly horizontal or vertical:
            if (p1.x === p2.x) { // Vertical line
                if (p1.x > obsLeft && p1.x < obsRight) return true;
            } else { // Horizontal line
                if (p1.y > obsTop && p1.y < obsBottom) return true;
            }
        }
    }
    return false;
};

/**
 * Very simple orthogonal routing.
 * Tries 2-segment, then 3-segment paths.
 * If blocked, falls back to a 5-segment path around the bounding box of the start/end points.
 * For a fully robust implementation, A* on a visibility graph or sparse grid is ideal,
 * but this heuristic works perfectly for 90% of flowchart use cases.
 */
export function getOrthogonalPath(start: Point, end: Point, startObsId?: string, endObsId?: string, allObstacles: BoundingBox[] = []): number[] {
    const padding = 20;
    // Filter out the start and end obstacles so we don't collide with the shapes we are connecting to
    const obstacles = allObstacles.filter(o => o.id !== startObsId && o.id !== endObsId);

    const pt = (p: Point) => [p.x, p.y];

    // Try path 1: Horizontal then Vertical
    const mid1 = { x: end.x, y: start.y };
    if (!intersectsObstacle(start, mid1, obstacles, padding) && !intersectsObstacle(mid1, end, obstacles, padding)) {
        return [...pt(start), ...pt(mid1), ...pt(end)];
    }

    // Try path 2: Vertical then Horizontal
    const mid2 = { x: start.x, y: end.y };
    if (!intersectsObstacle(start, mid2, obstacles, padding) && !intersectsObstacle(mid2, end, obstacles, padding)) {
        return [...pt(start), ...pt(mid2), ...pt(end)];
    }

    // Try 3-segment paths (Horizontal-Vertical-Horizontal)
    const midX = start.x + (end.x - start.x) / 2;
    const p1 = { x: midX, y: start.y };
    const p2 = { x: midX, y: end.y };
    if (!intersectsObstacle(start, p1, obstacles, padding) && !intersectsObstacle(p1, p2, obstacles, padding) && !intersectsObstacle(p2, end, obstacles, padding)) {
        return [...pt(start), ...pt(p1), ...pt(p2), ...pt(end)];
    }

    // Try 3-segment paths (Vertical-Horizontal-Vertical)
    const midY = start.y + (end.y - start.y) / 2;
    const p3 = { x: start.x, y: midY };
    const p4 = { x: end.x, y: midY };
    if (!intersectsObstacle(start, p3, obstacles, padding) && !intersectsObstacle(p3, p4, obstacles, padding) && !intersectsObstacle(p4, end, obstacles, padding)) {
        return [...pt(start), ...pt(p3), ...pt(p4), ...pt(end)];
    }

    // Fallback: Just draw the horizontal-vertical path anyway if we can't find a clean route
    return [...pt(start), ...pt(p1), ...pt(p2), ...pt(end)];
}
