'use client';

import { Stage, Layer as KonvaLayer, Rect, Ellipse, Line, Text, Transformer, RegularPolygon, Star as KonvaStar } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

export default function Board() {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [editingText, setEditingText] = useState<{ id: string; x: number; y: number; text: string } | null>(null);

    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    const {
        layers,
        activeTool,
        activeShape,
        activeColor,
        backgroundColor,
        bgMode,
        isDrawing,
        setIsDrawing,
        addLayer,
        updateLayer,
        removeLayer,
        saveHistory,
        selectedLayerId,
        setSelectedLayerId,
        eraserSize,
        penSize,
        camera,
        setCamera,
        zoom,
        setZoom,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const currentShapeId = useRef<string | null>(null);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (activeTool === 'select' && selectedLayerId && transformerRef.current && stageRef.current) {
            const selectedNode = stageRef.current.findOne(`#${selectedLayerId}`);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    }, [selectedLayerId, layers, activeTool]);

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        if (e.evt.ctrlKey || e.evt.metaKey) {
            const scaleBy = 1.1;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            const mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
            };

            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const clampedScale = Math.max(0.1, Math.min(newScale, 5));

            setZoom(clampedScale);
            setCamera({
                x: pointer.x - mousePointTo.x * clampedScale,
                y: pointer.y - mousePointTo.y * clampedScale,
            });
        } else {
            setCamera({
                x: camera.x - e.evt.deltaX,
                y: camera.y - e.evt.deltaY,
            });
        }
    };

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (editingText) {
            updateLayer(editingText.id, { text: editingText.text });
            setEditingText(null);
            stageRef.current?.findOne(`#${editingText.id}`)?.show();
            saveHistory();
            return;
        }

        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos || !stage) return;

        if (activeTool === 'hand') return;

        if (activeTool === 'select') {
            const clickedOnEmpty = e.target === stage || e.target.name() === 'background';
            if (clickedOnEmpty) {
                setSelectedLayerId(null);
                setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
                setIsDrawing(true);
            }
            return;
        }

        if (activeTool === 'object-eraser') return;

        if (activeTool === 'text') {
            setSelectedLayerId(null);
            const newId = uuidv4();
            addLayer({ id: newId, type: 'text', x: pos.x, y: pos.y, width: 200, height: 50, fill: activeColor, text: '' });

            const absPos = stage.getPointerPosition() || pos;
            setTimeout(() => setEditingText({ id: newId, x: absPos.x, y: absPos.y, text: '' }), 50);
            return;
        }

        setSelectedLayerId(null);
        setIsDrawing(true);
        const newId = uuidv4();
        currentShapeId.current = newId;

        addLayer({
            id: newId,
            type: activeTool === 'shape' ? activeShape : activeTool === 'eraser' ? 'eraser' : activeTool,
            x: pos.x,
            y: pos.y,
            width: 0,
            height: 0,
            fill: activeColor,
            stroke: activeTool === 'pen' ? activeColor : undefined,
            points: activeTool === 'pen' || activeTool === 'eraser' ? [pos.x, pos.y] : undefined,
            eraserSize: activeTool === 'eraser' ? eraserSize : undefined,
            penSize: activeTool === 'pen' ? penSize : undefined,
        });
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos) return;

        if (activeTool === 'select' && selectionBox) {
            setSelectionBox({
                ...selectionBox,
                width: pos.x - selectionBox.x,
                height: pos.y - selectionBox.y,
            });
            return;
        }

        if (!currentShapeId.current) return;
        const currentShape = layers.find(layer => layer.id === currentShapeId.current);
        if (!currentShape) return;

        if (activeTool === 'pen' || activeTool === 'eraser') {
            const newPoints = currentShape.points ? [...currentShape.points, pos.x, pos.y] : [pos.x, pos.y];
            updateLayer(currentShapeId.current, { points: newPoints });
        } else {
            updateLayer(currentShapeId.current, { width: pos.x - currentShape.x, height: pos.y - currentShape.y });
        }
    };

    const handlePointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'select' && selectionBox && stageRef.current) {
            const boxRect = {
                x: selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x,
                y: selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y,
                width: Math.abs(selectionBox.width),
                height: Math.abs(selectionBox.height),
            };

            const capturedLayer = layers.find(layer => {
                if (!layer.width && !layer.points) return false;
                const lx = layer.x;
                const ly = layer.y;
                return (lx >= boxRect.x && lx <= boxRect.x + boxRect.width && ly >= boxRect.y && ly <= boxRect.y + boxRect.height);
            });

            if (capturedLayer) setSelectedLayerId(capturedLayer.id);
            setSelectionBox(null);
            return;
        }

        if (currentShapeId.current) {
            currentShapeId.current = null;
            saveHistory();
        }
    };

    const getCursorClass = () => {
        if (activeTool === 'select') return 'cursor-default';
        if (activeTool === 'hand') return isDrawing ? 'cursor-grabbing' : 'cursor-grab';
        if (activeTool === 'text') return 'cursor-text';
        if (activeTool === 'object-eraser') return 'cursor-pointer';
        return 'cursor-crosshair';
    };

    return (
        <div
            className={`relative w-full h-full ${bgMode === 'dotted' ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]' : ''}`}
            style={bgMode === 'dotted' ? { backgroundPosition: `${camera.x}px ${camera.y}px` } : {}}
        >
            {editingText && (
                <textarea
                    className="absolute z-50 bg-white/90 border-2 border-indigo-500 shadow-xl rounded outline-none p-1 text-[24px] font-sans resize-none pointer-events-auto"
                    style={{ top: editingText.y, left: editingText.x, minWidth: '150px' }}
                    value={editingText.text}
                    autoFocus
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={() => {
                        updateLayer(editingText.id, { text: editingText.text });
                        setEditingText(null);
                        stageRef.current?.findOne(`#${editingText.id}`)?.show();
                        saveHistory();
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                />
            )}

            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                className={`touch-none ${getCursorClass()}`}
                x={camera.x}
                y={camera.y}
                scaleX={zoom}
                scaleY={zoom}
                draggable={activeTool === 'hand'}
                onWheel={handleWheel}
                onDragMove={(e) => {
                    if (e.target === stageRef.current) {
                        setCamera({ x: e.target.x(), y: e.target.y() });
                    }
                }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
            >
                <KonvaLayer>
                    <Rect
                        name="background"
                        x={-50000}
                        y={-50000}
                        width={100000}
                        height={100000}
                        fill={backgroundColor === 'transparent' ? null : backgroundColor}
                    />
                </KonvaLayer>

                <KonvaLayer>
                    {layers.map((layer) => {
                        const isSelected = layer.id === selectedLayerId && activeTool === 'select';
                        const commonProps = {
                            id: layer.id,
                            draggable: isSelected,
                            name: 'canvas-shape',
                            onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
                                updateLayer(layer.id, { x: event.target.x(), y: event.target.y() });
                                saveHistory();
                            },
                            onClick: () => {
                                if (activeTool === 'select') setSelectedLayerId(layer.id);
                                if (activeTool === 'object-eraser') {
                                    removeLayer(layer.id);
                                    saveHistory();
                                }
                            },
                            onTap: () => {
                                if (activeTool === 'select') setSelectedLayerId(layer.id);
                                if (activeTool === 'object-eraser') {
                                    removeLayer(layer.id);
                                    saveHistory();
                                }
                            },
                        };

                        const radius = Math.max(Math.abs(layer.width), Math.abs(layer.height)) / 2;

                        if (layer.type === 'rectangle') return <Rect key={layer.id} {...commonProps} x={layer.x} y={layer.y} width={layer.width} height={layer.height} fill={layer.fill} opacity={0.5} cornerRadius={4} />;
                        if (layer.type === 'ellipse') return <Ellipse key={layer.id} {...commonProps} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} fill={layer.fill} opacity={0.5} />;

                        if (layer.type === 'triangle') return <RegularPolygon key={layer.id} {...commonProps} sides={3} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={0.5} />;
                        if (layer.type === 'diamond') return <RegularPolygon key={layer.id} {...commonProps} sides={4} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={0.5} />;
                        if (layer.type === 'star') return <KonvaStar key={layer.id} {...commonProps} numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} fill={layer.fill} opacity={0.5} />;

                        if (layer.type === 'pen') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={0.5} lineCap="round" lineJoin="round" />;

                        if (layer.type === 'text') return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={24} fontFamily="sans-serif" onDblClick={(event) => { if (activeTool === 'select') { setEditingText({ id: layer.id, x: event.target.absolutePosition().x, y: event.target.absolutePosition().y, text: layer.text || '' }); event.target.hide(); } }} />;
                        if (layer.type === 'eraser') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;
                        return null;
                    })}

                    {selectionBox && (
                        <Rect
                            x={selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x}
                            y={selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y}
                            width={Math.abs(selectionBox.width)}
                            height={Math.abs(selectionBox.height)}
                            fill="rgba(79, 70, 229, 0.1)"
                            stroke="#4f46e5"
                            strokeWidth={1 / zoom}
                        />
                    )}

                    {activeTool === 'select' && selectedLayerId && (
                        <Transformer
                            ref={transformerRef}
                            boundBoxFunc={(oldBox, newBox) => (newBox.width < 5 || newBox.height < 5 ? oldBox : newBox)}
                        />
                    )}
                </KonvaLayer>
            </Stage>
        </div>
    );
}