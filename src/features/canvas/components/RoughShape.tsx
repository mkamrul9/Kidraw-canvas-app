import React from 'react';
import { Shape } from 'react-konva';
import rough from 'roughjs/bin/rough';
import { Layer } from '@/features/canvas/types';
import Konva from 'konva';

interface RoughShapeProps {
    layer: Layer;
    commonProps: any;
}

export default function RoughShape({ layer, commonProps }: RoughShapeProps) {
    const drawRough = (context: Konva.Context) => {
        // roughjs expects a canvas-like object with a getContext method
        const fakeCanvas = {
            getContext: () => context._context,
            width: 10000,
            height: 10000,
        } as any;
        const rc = rough.canvas(fakeCanvas);

        const options = {
            fill: layer.fill,
            stroke: layer.stroke || '#0f172a',
            strokeWidth: layer.penSize || 2,
            roughness: 1.5,
            bowing: 1,
            fillStyle: 'hachure',
        };

        const w = layer.width || 0;
        const h = layer.height || 0;
        const radius = Math.max(Math.abs(w), Math.abs(h)) / 2;

        if (layer.type === 'rectangle') {
            rc.rectangle(0, 0, w, h, options);
        } else if (layer.type === 'ellipse') {
            rc.ellipse(w / 2, h / 2, Math.abs(w), Math.abs(h), options);
        } else if (layer.type === 'triangle') {
            const cx = w / 2;
            const cy = h / 2;
            rc.polygon([
                [cx, cy - radius],
                [cx + radius * Math.cos(Math.PI / 6), cy + radius * Math.sin(Math.PI / 6)],
                [cx - radius * Math.cos(Math.PI / 6), cy + radius * Math.sin(Math.PI / 6)]
            ], options);
        } else if (layer.type === 'diamond') {
            const cx = w / 2;
            const cy = h / 2;
            rc.polygon([
                [cx, cy - radius],
                [cx + radius, cy],
                [cx, cy + radius],
                [cx - radius, cy]
            ], options);
        } else if (layer.type === 'hexagon') {
            const cx = w / 2;
            const cy = h / 2;
            const pts: [number, number][] = [];
            for (let i = 0; i < 6; i++) {
                pts.push([
                    cx + radius * Math.cos((i * Math.PI) / 3),
                    cy + radius * Math.sin((i * Math.PI) / 3)
                ]);
            }
            rc.polygon(pts, options);
        } else if (layer.type === 'straight-line') {
            // Line points are usually in layer.points. For straight line it could be width/height fallback
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, w, h];
            if (pts.length >= 4) {
                // If the line has multiple segments, draw them sequentially
                const ptArr: [number, number][] = [];
                for (let i = 0; i < pts.length; i += 2) {
                    ptArr.push([pts[i], pts[i+1]]);
                }
                rc.linearPath(ptArr, { ...options, fill: 'none' });
            } else {
                rc.line(pts[0], pts[1], pts[2], pts[3], { ...options, fill: 'none' });
            }
        } else if (layer.type === 'arrow') {
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, w, h];
            const ptArr: [number, number][] = [];
            for (let i = 0; i < pts.length; i += 2) {
                ptArr.push([pts[i], pts[i+1]]);
            }
            rc.linearPath(ptArr, { ...options, fill: 'none' });
            
            // Draw arrow head at the end
            if (ptArr.length >= 2) {
                const end = ptArr[ptArr.length - 1];
                const prev = ptArr[ptArr.length - 2];
                const angle = Math.atan2(end[1] - prev[1], end[0] - prev[0]);
                const headLen = 15;
                const a1 = angle - Math.PI / 6;
                const a2 = angle + Math.PI / 6;
                rc.line(end[0], end[1], end[0] - headLen * Math.cos(a1), end[1] - headLen * Math.sin(a1), { ...options, fill: 'none' });
                rc.line(end[0], end[1], end[0] - headLen * Math.cos(a2), end[1] - headLen * Math.sin(a2), { ...options, fill: 'none' });
            }
        } else if (layer.type === 'pen' || layer.type === 'pencil') {
            const pts = layer.points || [];
            if (pts.length >= 4) {
                const ptArr: [number, number][] = [];
                for (let i = 0; i < pts.length; i += 2) {
                    ptArr.push([pts[i], pts[i+1]]);
                }
                if (layer.type === 'pen') {
                    rc.curve(ptArr, { ...options, fill: 'none', strokeWidth: layer.penSize || 4, bowing: 0, roughness: 1.0 });
                } else {
                    rc.linearPath(ptArr, { ...options, fill: 'none', strokeWidth: layer.penSize || 4, bowing: 0, roughness: 1.0 });
                }
            }
        }
    };

    return (
        <Shape
            {...commonProps}
            x={layer.x}
            y={layer.y}
            width={layer.width}
            height={layer.height}
            opacity={layer.opacity || 1}
            sceneFunc={(context, shape) => {
                drawRough(context);
                // We do NOT call context.fillStrokeShape(shape) because roughjs draws directly to the canvas context
            }}
            hitFunc={(context, shape) => {
                const w = shape.width() || 10;
                const h = shape.height() || 10;
                context.beginPath();
                if (layer.type === 'straight-line' || layer.type === 'arrow') {
                    // Approximate hit box for lines
                    context.rect(-10, -10, w + 20, h + 20);
                } else if (layer.type === 'pen' || layer.type === 'pencil') {
                    const pts = layer.points || [];
                    if (pts.length > 0) {
                        context.moveTo(pts[0], pts[1]);
                        for (let i = 2; i < pts.length; i += 2) {
                            context.lineTo(pts[i], pts[i+1]);
                        }
                        context.lineWidth = (layer.penSize || 4) + 10; // Fatter hit region
                        context.stroke();
                    }
                } else if (layer.type === 'ellipse') {
                    context.ellipse(w / 2, h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
                } else {
                    context.rect(0, 0, w, h);
                }
                context.closePath();
                if (layer.type !== 'pen' && layer.type !== 'pencil') {
                    context.fillStrokeShape(shape);
                }
            }}
        />
    );
}
