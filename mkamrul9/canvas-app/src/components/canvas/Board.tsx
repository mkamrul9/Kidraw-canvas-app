'use client';

import { Stage, Layer as KonvaLayer, Rect, Ellipse, Line, Text, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

export default function Board() {
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    const [editingText, setEditingText] = useState<{
        id: string;
        x: number;
        y: number;
        text: string;
    } | null>(null);

    const {
        layers,
        activeTool,
        activeColor,
        backgroundColor,
        isDrawing,
        setIsDrawing,
        addLayer,
        updateLayer,
        saveHistory,
        selectedLayerId,
        setSelectedLayerId,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        const handleExport = async () => {
            if (!stageRef.current) return;

            const format = window.confirm('Click OK for PNG (Transparent/High Quality) or Cancel for JPEG (Smaller file)')
                ? 'png'
                : 'jpeg';
            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

            const dataURL = stageRef.current.toDataURL({ pixelRatio: 2, mimeType });

            try {
                const response = await fetch(dataURL);
                const blob = await response.blob();

                if ('showSaveFilePicker' in window) {
                    const handle = await (window as { showSaveFilePicker: (options: unknown) => Promise<any> }).showSaveFilePicker({
                        suggestedName: `my-whiteboard.${format}`,
                        types: [{ description: 'Image File', accept: { [mimeType]: [`.${format}`] } }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } else {
                    const link = document.createElement('a');
                    link.download = `my-whiteboard.${format}`;
                    link.href = dataURL;
                    link.click();
                }
            } catch (err) {
                console.log('User cancelled save or error occurred', err);
            }
        };
        window.addEventListener('export-canvas', handleExport);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('export-canvas', handleExport);
        };
    }, []);

    useEffect(() => {
        if (!selectedLayerId || !transformerRef.current || !stageRef.current) return;
        const selectedNode = stageRef.current.findOne(`#${selectedLayerId}`);
        if (selectedNode) {
            transformerRef.current.nodes([selectedNode]);
            transformerRef.current.getLayer()?.batchDraw();
        }
    }, [selectedLayerId, layers]);

    const handlePointerDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (!stage || !pos) return;

        if (activeTool === 'select') {
            const clickedOnEmpty = e.target === stage || e.target.name() === 'background';
            if (clickedOnEmpty) {
                setSelectedLayerId(null);
            }
            return;
        }

        setSelectedLayerId(null);
        setIsDrawing(true);

        const newId = uuidv4();

        addLayer({
            id: newId,
            type: activeTool,
            x: pos.x,
            y: pos.y,
            width: activeTool === 'text' ? 150 : 0,
            height: activeTool === 'text' ? 50 : 0,
            fill: activeColor,
            stroke: activeTool === 'pen' ? activeColor : undefined,
            points: activeTool === 'pen' ? [pos.x, pos.y] : undefined,
            text: activeTool === 'text' ? 'Double click to edit' : undefined,
        });

        if (activeTool === 'text') {
            setIsDrawing(false);
            saveHistory();
        } else {
            setSelectedLayerId(newId);
        }
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing || activeTool === 'select' || activeTool === 'text' || !selectedLayerId) return;

        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        const currentShape = layers.find(layer => layer.id === selectedLayerId);
        if (!currentShape) return;

        if (activeTool === 'pen') {
            const newPoints = currentShape.points ? [...currentShape.points, pos.x, pos.y] : [pos.x, pos.y];
            updateLayer(selectedLayerId, { points: newPoints });
        } else {
            updateLayer(selectedLayerId, {
                width: pos.x - currentShape.x,
                height: pos.y - currentShape.y,
            });
        }
    };

    const handlePointerUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            saveHistory();
        }
    };

    const handleTextDblClick = (e: Konva.KonvaEventObject<MouseEvent>, layer: { id: string; text?: string }) => {
        if (activeTool !== 'select') return;
        const textNode = e.target;
        const absPos = textNode.absolutePosition();
        setEditingText({
            id: layer.id,
            x: absPos.x,
            y: absPos.y,
            text: layer.text || '',
        });
        textNode.hide();
    };

    return (
        <div className="relative w-full h-full">
            {editingText && (
                <textarea
                    className="absolute z-50 bg-white/90 border-2 border-indigo-500 shadow-xl rounded outline-none p-1 text-[24px] font-sans resize-none"
                    style={{ top: editingText.y, left: editingText.x, minWidth: '150px' }}
                    value={editingText.text}
                    autoFocus
                    onChange={(event) => setEditingText({ ...editingText, text: event.target.value })}
                    onBlur={() => {
                        updateLayer(editingText.id, { text: editingText.text });
                        setEditingText(null);
                        stageRef.current?.findOne(`#${editingText.id}`)?.show();
                        saveHistory();
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault();
                            event.currentTarget.blur();
                        }
                    }}
                />
            )}

            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                className="touch-none cursor-crosshair"
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
                        x={0}
                        y={0}
                        width={dimensions.width}
                        height={dimensions.height}
                        fill={backgroundColor}
                    />

                    {layers.map((layer) => {
                        const isSelected = layer.id === selectedLayerId;
                        const commonProps = {
                            id: layer.id,
                            draggable: activeTool === 'select' && isSelected,
                            onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
                                updateLayer(layer.id, { x: event.target.x(), y: event.target.y() });
                                saveHistory();
                            },
                            onClick: () => activeTool === 'select' && setSelectedLayerId(layer.id),
                            onTap: () => activeTool === 'select' && setSelectedLayerId(layer.id),
                        };

                        if (layer.type === 'rectangle') {
                            return (
                                <Rect
                                    key={layer.id}
                                    {...commonProps}
                                    x={layer.x}
                                    y={layer.y}
                                    width={layer.width}
                                    height={layer.height}
                                    fill={layer.fill}
                                    opacity={0.85}
                                    cornerRadius={4}
                                />
                            );
                        }
                        if (layer.type === 'ellipse') {
                            return (
                                <Ellipse
                                    key={layer.id}
                                    {...commonProps}
                                    x={layer.x + layer.width / 2}
                                    y={layer.y + layer.height / 2}
                                    radiusX={Math.abs(layer.width / 2)}
                                    radiusY={Math.abs(layer.height / 2)}
                                    fill={layer.fill}
                                    opacity={0.85}
                                />
                            );
                        }
                        if (layer.type === 'pen') {
                            return (
                                <Line
                                    key={layer.id}
                                    {...commonProps}
                                    points={layer.points || []}
                                    stroke={layer.stroke}
                                    strokeWidth={4}
                                    tension={0.5}
                                    lineCap="round"
                                    lineJoin="round"
                                />
                            );
                        }
                        if (layer.type === 'text') {
                            return (
                                <Text
                                    key={layer.id}
                                    {...commonProps}
                                    x={layer.x}
                                    y={layer.y}
                                    text={layer.text}
                                    fill={layer.fill}
                                    fontSize={24}
                                    fontFamily="sans-serif"
                                    onDblClick={(event) => handleTextDblClick(event, layer)}
                                />
                            );
                        }
                        return null;
                    })}

                    {selectedLayerId && (
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