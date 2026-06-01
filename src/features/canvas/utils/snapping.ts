export type GuideLine = {
    orientation: 'V' | 'H';
    line: [number, number, number, number]; // [x1, y1, x2, y2]
};

export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

const SNAP_TOLERANCE = 5;

function getAxes(box: BoundingBox) {
    return {
        V: [
            box.x, // left
            box.x + box.width / 2, // center
            box.x + box.width // right
        ],
        H: [
            box.y, // top
            box.y + box.height / 2, // middle
            box.y + box.height // bottom
        ]
    };
}

export function getSnappingGuides(
    draggedBox: BoundingBox,
    otherBoxes: BoundingBox[]
): { snappedX: number | null; snappedY: number | null; guides: GuideLine[] } {
    const guides: GuideLine[] = [];
    let snappedX: number | null = null;
    let snappedY: number | null = null;

    let minDiffX = Infinity;
    let minDiffY = Infinity;

    // The axes of the box currently being dragged
    const draggedAxes = getAxes(draggedBox);

    // We keep track of the guide line coordinates. A guide line usually spans from the 
    // top-most (or left-most) point to the bottom-most (or right-most) point of the two aligned shapes.
    
    // Check Vertical Axes (snapping X coordinates)
    for (const other of otherBoxes) {
        const otherAxes = getAxes(other);

        for (let i = 0; i < draggedAxes.V.length; i++) {
            for (let j = 0; j < otherAxes.V.length; j++) {
                const diff = Math.abs(draggedAxes.V[i] - otherAxes.V[j]);
                if (diff < SNAP_TOLERANCE && diff < minDiffX) {
                    minDiffX = diff;
                    // Calculate how much we need to shift the dragged box
                    const offset = otherAxes.V[j] - draggedAxes.V[i];
                    snappedX = draggedBox.x + offset;

                    // Compute the span of the guide line
                    const minY = Math.min(draggedBox.y, other.y);
                    const maxY = Math.max(draggedBox.y + draggedBox.height, other.y + other.height);
                    
                    // Clear previous V guides and add the new best one
                    const newVGuides = guides.filter(g => g.orientation !== 'V');
                    newVGuides.push({
                        orientation: 'V',
                        line: [otherAxes.V[j], minY - 20, otherAxes.V[j], maxY + 20]
                    });
                    // We only want 1 guide per orientation in this simple array for now (we could support multiple if we didn't filter)
                    guides.length = 0;
                    guides.push(...newVGuides);
                }
            }
        }

        // Check Horizontal Axes (snapping Y coordinates)
        for (let i = 0; i < draggedAxes.H.length; i++) {
            for (let j = 0; j < otherAxes.H.length; j++) {
                const diff = Math.abs(draggedAxes.H[i] - otherAxes.H[j]);
                if (diff < SNAP_TOLERANCE && diff < minDiffY) {
                    minDiffY = diff;
                    // Calculate how much we need to shift the dragged box
                    const offset = otherAxes.H[j] - draggedAxes.H[i];
                    snappedY = draggedBox.y + offset;

                    // Compute the span of the guide line
                    const minX = Math.min(draggedBox.x, other.x);
                    const maxX = Math.max(draggedBox.x + draggedBox.width, other.x + other.width);
                    
                    const newHGuides = guides.filter(g => g.orientation !== 'H');
                    newHGuides.push({
                        orientation: 'H',
                        line: [minX - 20, otherAxes.H[j], maxX + 20, otherAxes.H[j]]
                    });
                    
                    const currentV = guides.filter(g => g.orientation === 'V');
                    guides.length = 0;
                    guides.push(...currentV, ...newHGuides);
                }
            }
        }
    }

    return { snappedX, snappedY, guides };
}
