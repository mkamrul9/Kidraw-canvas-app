'use client';

import { Stage, Layer as KonvaLayer, Rect } from 'react-konva';
import { useEffect, useRef, useState } from 'react';
import Konva from 'konva';

import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

export default function Board() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const {
        layers,
        activeTool,
        activeColor,
        isDrawing,
        setIsDrawing,
        addLayer,
        updateLayer
    } = useCanvasStore();

    // Keep track of the ID of the shape currently being drawn
    const currentShapeId = useRef<string | null>(null);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (activeTool !== 'rectangle') return;

        setIsDrawing(true);
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newId = uuidv4();
        currentShapeId.current = newId;

        // Create the initial starting point of the rectangle
        addLayer({
            id: newId,
            type: 'rectangle',
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: activeColor,
        });
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing || activeTool !== 'rectangle' || !currentShapeId.current) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        // Find the shape we are currently drawing
        const currentShape = layers.find(layer => layer.id === currentShapeId.current);
        if (!currentShape) return;

        // Calculate the new width and height based on the starting x/y and current mouse pos
        const newWidth = pos.x - currentShape.x;
        const newHeight = pos.y - currentShape.y;

        updateLayer(currentShapeId.current, {
            width: newWidth,
            height: newHeight,
        });
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        currentShapeId.current = null;
    };

    return (
        <Stage
            width={dimensions.width}
            height={dimensions.height}
            className="bg-slate-50 touch-none cursor-crosshair"
            onMouseDown={handlePointerDown}
            onMouseMove={handlePointerMove}
            onMouseUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerUp}
        >
            <KonvaLayer>
                {layers.map((layer) => {
                    if (layer.type === 'rectangle') {
                        return (
                            <Rect
                                key={layer.id}
                                x={layer.width < 0 ? layer.x + layer.width : layer.x} // Handle dragging backwards
                                y={layer.height < 0 ? layer.y + layer.height : layer.y} // Handle dragging upwards
                                width={Math.abs(layer.width)}
                                height={Math.abs(layer.height)}
                                fill={layer.fill}
                                cornerRadius={4}
                            />
                        );
                    }
                    return null;
                })}
            </KonvaLayer>
        </Stage>
    );
}