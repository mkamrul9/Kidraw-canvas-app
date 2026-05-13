'use client';

import { Stage, Layer as KonvaLayer, Group, Rect, Ellipse, Line, Text, Transformer, RegularPolygon, Star as KonvaStar, Arrow } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef } from 'react';
import type React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export default function Board() {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [editingText, setEditingText] = useState<{ id: string; x: number; y: number; text: string } | null>(null);
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [laserPoints, setLaserPoints] = useState<number[]>([]);

    const {
        layers,
        activeTool,
        activeShape,
        activeColor,
        backgroundColor,
        bgPattern,
        activeOpacity,
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
        isLocked,
        permissionRole,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const currentShapeId = useRef<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setLaserPoints((prev) => (prev.length > 0 ? prev.slice(2) : []));
        }, 30);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);

        const handleExport = async (event: Event) => {
            if (!stageRef.current) return;
            const customEvent = event as CustomEvent<'png' | 'jpeg' | 'svg'>;
            const format = customEvent.detail;
            if (!format) return;

            try {
                let blob: Blob;

                if (format === 'svg') {
                    let svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" style="background-color:${backgroundColor}">`;
                    layers.forEach((layer) => {
                        const op = layer.opacity ?? 1;
                        if (layer.type === 'rectangle') {
                            svgString += `<rect x="${layer.x}" y="${layer.y}" width="${layer.width}" height="${layer.height}" fill="${layer.fill}" opacity="${op}" rx="4"/>`;
                        }
                        if (layer.type === 'ellipse') {
                            svgString += `<ellipse cx="${layer.x + layer.width / 2}" cy="${layer.y + layer.height / 2}" rx="${Math.abs(layer.width / 2)}" ry="${Math.abs(layer.height / 2)}" fill="${layer.fill}" opacity="${op}"/>`;
                        }
                    });
                    svgString += '</svg>';
                    blob = new Blob([svgString], { type: 'image/svg+xml' });
                } else {
                    const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                    const dataURL = stageRef.current.toDataURL({ pixelRatio: 2, mimeType });
                    blob = await (await fetch(dataURL)).blob();
                }

                if ('showSaveFilePicker' in window) {
                    const handle = await (window as { showSaveFilePicker: (options: unknown) => Promise<any> }).showSaveFilePicker({
                        suggestedName: `whiteboard.${format}`,
                        types: [{
                            description: `${format.toUpperCase()} Image`,
                            accept: { [`image/${format === 'svg' ? 'svg+xml' : format}`]: [`.${format}`] }
                        }],
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                    toast.success('Board downloaded successfully!');
                } else {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `whiteboard.${format}`;
                    link.click();
                }
            } catch (err) {
                console.log('Download cancelled or failed', err);
            }
        };

        window.addEventListener('export-canvas', handleExport);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('export-canvas', handleExport);
        };
    }, [layers, backgroundColor, dimensions]);

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

        if (isLocked && activeTool !== 'hand') return;
        if (permissionRole === 'viewer' && activeTool !== 'hand' && activeTool !== 'select') {
            toast.error('View Only Mode', { description: 'Please sign in or request edit access to draw.' });
            return;
        }

        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos || !stage) return;

        if (activeTool === 'hand') return;

        if (activeTool === 'laser') {
            setIsDrawing(true);
            setLaserPoints([pos.x, pos.y]);
            return;
        }

        if (activeTool === 'select') {
            if (e.target === stage || e.target.name() === 'background') {
                setSelectedLayerId(null);
                setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 });
                setIsDrawing(true);
            }
            return;
        }

        if (activeTool === 'object-eraser') return;

        if (activeTool === 'text' || activeTool === 'comment') {
            setSelectedLayerId(null);
            const newId = uuidv4();

            if (activeTool === 'comment') {
                addLayer({ id: newId, type: 'comment', x: pos.x, y: pos.y, width: 200, height: 100, fill: '#fef08a', text: '' });
            } else {
                addLayer({ id: newId, type: 'text', x: pos.x, y: pos.y, width: 200, height: 50, fill: activeColor, text: '', opacity: activeOpacity });
            }

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
            opacity: activeOpacity,
        });
    };

    const handlePointerMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing) return;
        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos) return;

        if (activeTool === 'laser') {
            setLaserPoints((prev) => [...prev, pos.x, pos.y]);
            return;
        }

        if (activeTool === 'select' && selectionBox) {
            setSelectionBox({ ...selectionBox, width: pos.x - selectionBox.x, height: pos.y - selectionBox.y });
            return;
        }

        if (!currentShapeId.current) return;
        const currentShape = layers.find((layer) => layer.id === currentShapeId.current);
        if (!currentShape) return;

        if (activeTool === 'pen' || activeTool === 'eraser') {
            updateLayer(currentShapeId.current, { points: [...(currentShape.points || []), pos.x, pos.y] });
        } else {
            updateLayer(currentShapeId.current, { width: pos.x - currentShape.x, height: pos.y - currentShape.y });
        }
    };

    const handlePointerUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'laser') return;

        if (activeTool === 'select' && selectionBox && stageRef.current) {
            const boxRect = {
                x: selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x,
                y: selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y,
                width: Math.abs(selectionBox.width),
                height: Math.abs(selectionBox.height),
            };

            const capturedLayer = layers.find((layer) => {
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

    const getBackgroundStyle = () => {
        const base = { backgroundColor };
        if (bgPattern === 'solid') return base;
        if (bgPattern === 'dotted') {
            return {
                ...base,
                backgroundImage: 'radial-gradient(#94a3b8 2px, transparent 2px)',
                backgroundSize: `${30 * zoom}px ${30 * zoom}px`,
                backgroundPosition: `${camera.x}px ${camera.y}px`
            };
        }
        if (bgPattern === 'grid') {
            return {
                ...base,
                backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
                backgroundSize: `${40 * zoom}px ${40 * zoom}px`,
                backgroundPosition: `${camera.x}px ${camera.y}px`
            };
        }
        return base;
    };

    return (
        <div className="relative w-full h-full" style={getBackgroundStyle()}>
            {editingText && (
                <textarea
                    className="absolute z-50 shadow-xl rounded outline-none p-2 text-[20px] font-sans resize-none pointer-events-auto"
                    style={{
                        top: editingText.y,
                        left: editingText.x,
                        minWidth: '200px',
                        backgroundColor: activeTool === 'comment' ? '#fef08a' : 'rgba(255,255,255,0.9)',
                        border: activeTool === 'comment' ? '1px solid #eab308' : '2px solid #6366f1'
                    }}
                    value={editingText.text}
                    autoFocus
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={() => {
                        updateLayer(editingText.id, { text: editingText.text });
                        setEditingText(null);
                        stageRef.current?.findOne(`#${editingText.id}`)?.show();
                        saveHistory();
                    }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                />
            )}

            <Stage
                ref={stageRef}
                width={dimensions.width}
                height={dimensions.height}
                className={`touch-none ${activeTool === 'laser' ? 'cursor-crosshair' : ''}`}
                x={camera.x}
                y={camera.y}
                scaleX={zoom}
                scaleY={zoom}
                draggable={activeTool === 'hand'}
                onWheel={handleWheel}
                onDragMove={(e) => { if (e.target === stageRef.current) setCamera({ x: e.target.x(), y: e.target.y() }); }}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
            >
                <KonvaLayer>
                    {layers.map((layer) => {
                        const isSelected = layer.id === selectedLayerId && activeTool === 'select';
                        const commonProps = {
                            id: layer.id,
                            draggable: isSelected && !isLocked,
                            name: 'canvas-shape',
                            onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => { updateLayer(layer.id, { x: event.target.x(), y: event.target.y() }); saveHistory(); },
                            onClick: () => { if (!isLocked && activeTool === 'select') setSelectedLayerId(layer.id); if (!isLocked && activeTool === 'object-eraser') { removeLayer(layer.id); saveHistory(); } },
                        };

                        const shapeOpacity = layer.opacity ?? 1;
                        const radius = Math.max(Math.abs(layer.width), Math.abs(layer.height)) / 2;

                        if (layer.type === 'comment') {
                            return (
                                <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                                    <Rect width={200} height={100} fill={layer.fill} shadowColor="black" shadowBlur={10} shadowOpacity={0.1} cornerRadius={4} />
                                    <Text
                                        x={10}
                                        y={10}
                                        text={layer.text}
                                        fill="#0f172a"
                                        fontSize={16}
                                        width={180}
                                        onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { setEditingText({ id: layer.id, x: event.target.absolutePosition().x, y: event.target.absolutePosition().y, text: layer.text || '' }); event.target.hide(); } }}
                                    />
                                </Group>
                            );
                        }

                        if (layer.type === 'rectangle') return <Rect key={layer.id} {...commonProps} x={layer.x} y={layer.y} width={layer.width} height={layer.height} fill={layer.fill} opacity={shapeOpacity} cornerRadius={4} />;
                        if (layer.type === 'ellipse') return <Ellipse key={layer.id} {...commonProps} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} fill={layer.fill} opacity={shapeOpacity} />;

                        if (layer.type === 'triangle') return <RegularPolygon key={layer.id} {...commonProps} sides={3} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'diamond') return <RegularPolygon key={layer.id} {...commonProps} sides={4} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'hexagon') return <RegularPolygon key={layer.id} {...commonProps} sides={6} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;
                        if (layer.type === 'star') return <KonvaStar key={layer.id} {...commonProps} numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} fill={layer.fill} opacity={shapeOpacity} />;

                        if (layer.type === 'straight-line') return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} stroke={layer.fill} strokeWidth={layer.penSize || 4} lineCap="round" opacity={shapeOpacity} />;
                        if (layer.type === 'arrow') return <Arrow key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} fill={layer.fill} stroke={layer.fill} strokeWidth={layer.penSize || 4} pointerLength={15} pointerWidth={15} opacity={shapeOpacity} />;

                        if (layer.type === 'pen') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={0.5} lineCap="round" lineJoin="round" opacity={shapeOpacity} />;
                        if (layer.type === 'text') return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={24} fontFamily="sans-serif" opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { setEditingText({ id: layer.id, x: event.target.absolutePosition().x, y: event.target.absolutePosition().y, text: layer.text || '' }); event.target.hide(); } }} />;
                        if (layer.type === 'eraser') return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;
                        return null;
                    })}

                    {laserPoints.length > 0 && (
                        <Line points={laserPoints} stroke="#ef4444" strokeWidth={6} tension={0.5} lineCap="round" lineJoin="round" shadowColor="#ef4444" shadowBlur={15} />
                    )}

                    {selectionBox && !isLocked && (
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

                    {activeTool === 'select' && selectedLayerId && !isLocked && (
                        <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} />
                    )}
                </KonvaLayer>
            </Stage>
        </div>
    );
}
