import type { CSSProperties } from 'react';

/**
 * Generates CSS inline styles for the infinite canvas background.
 * Uses CSS radial/linear gradients instead of Konva elements for performance —
 * this avoids rendering thousands of grid lines in the canvas layer.
 * Background position syncs with camera offset and zoom level.
 */
export function getBackgroundStyle(
    backgroundColor: string,
    bgPattern: 'solid' | 'dotted' | 'grid',
    zoom: number,
    camera: { x: number; y: number },
): CSSProperties {
    const base: CSSProperties = { backgroundColor };

    if (bgPattern === 'solid') return base;

    if (bgPattern === 'dotted') {
        return {
            ...base,
            backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)',
            backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
            backgroundPosition: `${camera.x}px ${camera.y}px`,
        };
    }

    if (bgPattern === 'grid') {
        return {
            ...base,
            backgroundImage:
                'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
            backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
            backgroundPosition: `${camera.x}px ${camera.y}px`,
        };
    }

    return base;
}
