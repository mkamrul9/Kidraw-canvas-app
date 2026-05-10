'use client';

import { Stage, Layer as KonvaLayer } from 'react-konva';
import { useEffect, useState } from 'react';
// import { useCanvasStore } from '@/store/useCanvasStore'; 

export default function Board() {
    // Since this is client-side only, window is immediately available
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Only listen for future resizes

    return (
        <Stage
            width={dimensions.width}
            height={dimensions.height}
            className="bg-slate-50 touch-none cursor-crosshair"
        >
            <KonvaLayer>
                {/* Future layers and shapes will go here */}
            </KonvaLayer>
        </Stage>
    );
}