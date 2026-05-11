'use client';

import { Stage, Layer as KonvaLayer, Rect, Ellipse, Line } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

export default function Board() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const { layers, activeTool, activeColor, isDrawing, setIsDrawing, addLayer, updateLayer, saveHistory } = useCanvasStore();
    const currentShapeId = useRef<string | null>(null);
    const stageRef = useRef<Konva.Stage>(null);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        const handleExport = () => {
            if (stageRef.current) {
                const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = 'my-whiteboard.png';
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };
        window.addEventListener('export-canvas', handleExport);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('export-canvas', handleExport);
        };
    }, []);

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        // If the select tool is active, don't draw anything
        if (activeTool === 'select') return;

        setIsDrawing(true);
        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const newId = uuidv4();
        currentShapeId.current = newId;

        // We configure the initial layer based on the tool
        addLayer({
            id: newId,
            type: activeTool, // This will be 'rectangle', 'ellipse', or 'pen'
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: activeColor,
            stroke: activeTool === 'pen' ? activeColor : undefined, // Pen uses stroke
            points: activeTool === 'pen' ? [pos.x, pos.y] : undefined, // Pen starts with the first point
        });
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing || activeTool === 'select' || !currentShapeId.current) return;

        const stage = e.target.getStage();
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const currentShape = layers.find(layer => layer.id === currentShapeId.current);
        if (!currentShape) return;

        // Logic for Pen Tool (Freehand)
        if (activeTool === 'pen') {
            const newPoints = currentShape.points ? [...currentShape.points, pos.x, pos.y] : [pos.x, pos.y];
            updateLayer(currentShapeId.current, { points: newPoints });
        }
        // Logic for Rectangle and Ellipse
        else {
            updateLayer(currentShapeId.current, {
                width: pos.x - currentShape.x,
                height: pos.y - currentShape.y,
            });
        }
    };

    const handlePointerUp = () => {
        setIsDrawing(false);
        currentShapeId.current = null;
        saveHistory();
    };

    return (
        <Stage
            ref={stageRef}
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
                                x={layer.width < 0 ? layer.x + layer.width : layer.x}
                                y={layer.height < 0 ? layer.y + layer.height : layer.y}
                                width={Math.abs(layer.width)}
                                height={Math.abs(layer.height)}
                                fill={layer.fill}
                                cornerRadius={4}
                            />
                        );
                    }
                    if (layer.type === 'ellipse') {
                        return (
                            <Ellipse
                                key={layer.id}
                                // Konva draws ellipses from the center, so we shift x and y by half the width/height
                                x={layer.x + layer.width / 2}
                                y={layer.y + layer.height / 2}
                                radiusX={Math.abs(layer.width / 2)}
                                radiusY={Math.abs(layer.height / 2)}
                                fill={layer.fill}
                            />
                        );
                    }
                    if (layer.type === 'pen') {
                        return (
                            <Line
                                key={layer.id}
                                points={layer.points || []}
                                stroke={layer.stroke}
                                strokeWidth={4}     // Make the line thick enough to see easily
                                tension={0.5}       // This makes the freehand line smooth instead of jagged
                                lineCap="round"     // Rounds the ends of the line
                                lineJoin="round"    // Rounds the corners where line segments meet
                            />
                        );
                    }
                    return null;
                })}
            </KonvaLayer>
        </Stage>
    );
}