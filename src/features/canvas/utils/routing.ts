export type Point = { x: number; y: number };
export type BoundingBox = { x: number; y: number; width: number; height: number; id: string };

// Helper to check if a line segment intersects an obstacle
const intersectsObstacle = (p1: Point, p2: Point, obstacles: BoundingBox[], padding: number = 20): boolean => {
    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    for (const obs of obstacles) {
        const obsLeft = obs.x - padding;
        const obsRight = obs.x + obs.width + padding;
        const obsTop = obs.y - padding;
        const obsBottom = obs.y + obs.height + padding;

        // Strict inequality checks: arrows can touch the padding edges, but not cross INSIDE
        if (maxX > obsLeft && minX < obsRight && maxY > obsTop && minY < obsBottom) {
            return true;
        }
    }
    return false;
};

type Node = {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    parent: Node | null;
    dir: 'H' | 'V' | null; // Direction we traveled to get to this node
};

export function getOrthogonalPath(start: Point, end: Point, startObsId?: string, endObsId?: string, allObstacles: BoundingBox[] = []): number[] {
    const padding = 25;
    
    // Filter out the start and end obstacles so we don't treat them as solid walls at the origin/destination
    const obstacles = allObstacles.filter(o => o.id !== startObsId && o.id !== endObsId);

    // 1. Generate sparse grid coordinates
    const xCoords = new Set<number>();
    const yCoords = new Set<number>();

    xCoords.add(start.x);
    xCoords.add(end.x);
    yCoords.add(start.y);
    yCoords.add(end.y);

    for (const obs of obstacles) {
        xCoords.add(obs.x - padding);
        xCoords.add(obs.x + obs.width + padding);
        yCoords.add(obs.y - padding);
        yCoords.add(obs.y + obs.height + padding);
    }

    const xs = Array.from(xCoords).sort((a, b) => a - b);
    const ys = Array.from(yCoords).sort((a, b) => a - b);

    // Find start and end indices
    const startXIdx = xs.indexOf(start.x);
    const startYIdx = ys.indexOf(start.y);
    const endXIdx = xs.indexOf(end.x);
    const endYIdx = ys.indexOf(end.y);

    // 2. A* Pathfinding Data Structures
    const openList: Node[] = [];
    const closedSet = new Set<string>();

    const startNode: Node = { x: startXIdx, y: startYIdx, g: 0, h: 0, f: 0, parent: null, dir: null };
    openList.push(startNode);

    const getHash = (x: number, y: number, dir: 'H' | 'V' | null) => `${x},${y},${dir}`;

    let finalNode: Node | null = null;
    let iterations = 0;
    const MAX_ITERATIONS = 1000; // Safeguard against massive loops

    // 3. A* Loop
    while (openList.length > 0 && iterations < MAX_ITERATIONS) {
        iterations++;

        // Pop node with lowest f cost
        openList.sort((a, b) => a.f - b.f);
        const current = openList.shift()!;

        if (current.x === endXIdx && current.y === endYIdx) {
            finalNode = current;
            break;
        }

        const hash = getHash(current.x, current.y, current.dir);
        if (closedSet.has(hash)) continue;
        closedSet.add(hash);

        // Check neighbors (up, down, left, right)
        const neighbors = [
            { nx: current.x - 1, ny: current.y, ndir: 'H' as const },
            { nx: current.x + 1, ny: current.y, ndir: 'H' as const },
            { nx: current.x, ny: current.y - 1, ndir: 'V' as const },
            { nx: current.x, ny: current.y + 1, ndir: 'V' as const }
        ];

        for (const { nx, ny, ndir } of neighbors) {
            // Bounds check
            if (nx < 0 || nx >= xs.length || ny < 0 || ny >= ys.length) continue;

            const curPt = { x: xs[current.x], y: ys[current.y] };
            const nPt = { x: xs[nx], y: ys[ny] };

            // Intersection check: Does the line segment between current and neighbor hit an obstacle?
            if (intersectsObstacle(curPt, nPt, obstacles, padding)) {
                continue;
            }

            // Calculate costs
            const dist = Math.hypot(nPt.x - curPt.x, nPt.y - curPt.y);
            const turnPenalty = current.dir !== null && current.dir !== ndir ? 100 : 0;
            const g = current.g + dist + turnPenalty;
            
            const manhattanToTarget = Math.abs(nPt.x - end.x) + Math.abs(nPt.y - end.y);
            const h = manhattanToTarget;
            const f = g + h;

            openList.push({
                x: nx,
                y: ny,
                g,
                h,
                f,
                parent: current,
                dir: ndir
            });
        }
    }

    // 4. Trace back path
    const path: Point[] = [];
    if (finalNode) {
        let curr: Node | null = finalNode;
        while (curr) {
            path.push({ x: xs[curr.x], y: ys[curr.y] });
            curr = curr.parent;
        }
        path.reverse();
    } else {
        // Fallback: Just draw a straight line if A* fails
        path.push(start, end);
    }

    // 5. Simplify collinear points
    const simplified: Point[] = [];
    if (path.length > 0) {
        simplified.push(path[0]);
        for (let i = 1; i < path.length - 1; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];

            // If the point forms a straight line between prev and next, skip it
            const isCollinearX = prev.x === curr.x && curr.x === next.x;
            const isCollinearY = prev.y === curr.y && curr.y === next.y;
            
            if (!isCollinearX && !isCollinearY) {
                simplified.push(curr);
            }
        }
        if (path.length > 1) {
            simplified.push(path[path.length - 1]);
        }
    }

    return simplified.flatMap(p => [p.x, p.y]);
}
