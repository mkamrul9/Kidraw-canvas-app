'use client';

import { Stage, Layer as KonvaLayer, Rect, Line, Transformer } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

import LayerRenderer from './LayerRenderer';
import { getBackgroundStyle } from '@/features/canvas/lib/background';
import { isPointInPolygon } from '@/features/canvas/lib/geometry';
import { useCanvasExport } from '@/features/canvas/hooks/useCanvasExport';
import { LASER_FADE_INTERVAL_MS, COMMENT_WIDTH, COMMENT_HEIGHT, COMMENT_FILL, IMAGE_MAX_WIDTH } from '@/features/canvas/constants';

export default function Board() {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [editingText, setEditingText] = useState<{ id: string; x: number; y: number; text: string } | null>(null);
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [lassoPoints, setLassoPoints] = useState<number[]>([]);
    const [laserPoints, setLaserPoints] = useState<number[]>([]);

    const {
        layers, activeTool, activeShape, activeColor, backgroundColor, bgPattern,
        activeOpacity, isDrawing, setIsDrawing, addLayer, updateLayer, removeLayer,
        saveHistory, selectedLayerIds, setSelectedLayerIds, setSelectedLayerId,
        eraserSize, penSize, camera, setCamera, zoom, setZoom, isLocked,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const currentShapeId = useRef<string | null>(null);

    // ─── Hooks ───────────────────────────────────────────
    useCanvasExport(stageRef);

    // ─── Effects ─────────────────────────────────────────
    useEffect(() => {
        const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setLaserPoints((prev) => (prev.length > 0 ? prev.slice(2) : [])), LASER_FADE_INTERVAL_MS);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleInsertImage = (event: Event) => {
            const customEvent = event as CustomEvent<string>;
            const src = customEvent.detail;
            if (!src) return;
            const img = new window.Image();
            img.src = src;
            img.onload = () => {
                const scale = Math.min(1, IMAGE_MAX_WIDTH / img.width);
                addLayer({
                    id: uuidv4(), type: 'image',
                    x: (-camera.x + dimensions.width / 2) / zoom - (img.width * scale) / 2,
                    y: (-camera.y + dimensions.height / 2) / zoom - (img.height * scale) / 2,
                    width: img.width * scale, height: img.height * scale,
                    fill: 'transparent', src, opacity: activeOpacity,
                });
                saveHistory();
            };
        };
        window.addEventListener('insert-image', handleInsertImage);
        return () => window.removeEventListener('insert-image', handleInsertImage);
    }, [camera, zoom, dimensions, activeOpacity, addLayer, saveHistory]);

    useEffect(() => {
        if ((activeTool === 'select' || activeTool === 'lasso') && selectedLayerIds.length > 0 && transformerRef.current && stageRef.current) {
            const nodes = selectedLayerIds.map((id) => stageRef.current?.findOne(`#${id}`)).filter(Boolean) as Konva.Node[];
            if (nodes.length > 0) {
                transformerRef.current.nodes(nodes);
                transformerRef.current.getLayer()?.batchDraw();
            }
        }
    }, [selectedLayerIds, layers, activeTool]);

    // ─── Wheel Handler ───────────────────────────────────
    const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = e.target.getStage();
        if (!stage) return;

        if (e.evt.ctrlKey || e.evt.metaKey) {
            const scaleBy = 1.1;
            const oldScale = stage.scaleX();
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const mousePointTo = { x: (pointer.x - stage.x()) / oldScale, y: (pointer.y - stage.y()) / oldScale };
            const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
            const clampedScale = Math.max(0.1, Math.min(newScale, 5));
            setZoom(clampedScale);
            setCamera({ x: pointer.x - mousePointTo.x * clampedScale, y: pointer.y - mousePointTo.y * clampedScale });
        } else {
            setCamera({ x: camera.x - e.evt.deltaX, y: camera.y - e.evt.deltaY });
        }
    }, [camera, setCamera, setZoom]);

    // ─── Pointer Handlers ────────────────────────────────
    const handlePointerDown = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (editingText) {
            updateLayer(editingText.id, { text: editingText.text });
            setEditingText(null);
            stageRef.current?.findOne(`#${editingText.id}`)?.show();
            saveHistory();
            return;
        }
        if (isLocked && activeTool !== 'hand') return;

        const stage = e.target.getStage();
        const pos = stage?.getRelativePointerPosition();
        if (!pos || !stage) return;

        if (activeTool === 'hand') return;
        if (activeTool === 'laser') { setIsDrawing(true); setLaserPoints([pos.x, pos.y]); return; }
        if (activeTool === 'lasso') {
            if (e.target === stage || e.target.name() === 'background') { setSelectedLayerIds([]); setLassoPoints([pos.x, pos.y]); setIsDrawing(true); }
            return;
        }
        if (activeTool === 'select') {
            if (e.target === stage || e.target.name() === 'background') { setSelectedLayerId(null); setSelectionBox({ x: pos.x, y: pos.y, width: 0, height: 0 }); setIsDrawing(true); }
            return;
        }
        if (activeTool === 'object-eraser') return;

        if (activeTool === 'text' || activeTool === 'comment') {
            setSelectedLayerId(null);
            const newId = uuidv4();
            if (activeTool === 'comment') {
                addLayer({ id: newId, type: 'comment', x: pos.x, y: pos.y, width: COMMENT_WIDTH, height: COMMENT_HEIGHT, fill: COMMENT_FILL, text: '' });
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
            x: pos.x, y: pos.y, width: 0, height: 0, fill: activeColor,
            stroke: activeTool === 'pen' ? activeColor : undefined,
            points: activeTool === 'pen' || activeTool === 'eraser' ? [pos.x, pos.y] : undefined,
            eraserSize: activeTool === 'eraser' ? eraserSize : undefined,
            penSize: activeTool === 'pen' ? penSize : undefined,
            opacity: activeOpacity,
        });
    }, [editingText, isLocked, activeTool, activeShape, activeColor, activeOpacity, eraserSize, penSize, addLayer, updateLayer, saveHistory, setIsDrawing, setSelectedLayerId, setSelectedLayerIds]);

    const handlePointerMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!isDrawing) return;
        const pos = e.target.getStage()?.getRelativePointerPosition();
        if (!pos) return;

        if (activeTool === 'laser') { setLaserPoints((prev) => [...prev, pos.x, pos.y]); return; }
        if (activeTool === 'lasso') { setLassoPoints((prev) => [...prev, pos.x, pos.y]); return; }
        if (activeTool === 'select' && selectionBox) { setSelectionBox({ ...selectionBox, width: pos.x - selectionBox.x, height: pos.y - selectionBox.y }); return; }

        if (!currentShapeId.current) return;
        const currentShape = layers.find((layer) => layer.id === currentShapeId.current);
        if (!currentShape) return;

        if (activeTool === 'pen' || activeTool === 'eraser') {
            updateLayer(currentShapeId.current, { points: [...(currentShape.points || []), pos.x, pos.y] });
        } else {
            updateLayer(currentShapeId.current, { width: pos.x - currentShape.x, height: pos.y - currentShape.y });
        }
    }, [isDrawing, activeTool, selectionBox, layers, updateLayer]);

    const handlePointerUp = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'laser') return;

        if (activeTool === 'lasso' && lassoPoints.length > 4) {
            const capturedIds: string[] = [];
            layers.forEach((layer) => {
                const cx = layer.x + (layer.width ? layer.width / 2 : 0);
                const cy = layer.y + (layer.height ? layer.height / 2 : 0);
                if (isPointInPolygon([cx, cy], lassoPoints)) capturedIds.push(layer.id);
            });
            if (capturedIds.length > 0) setSelectedLayerIds(capturedIds);
            setLassoPoints([]);
            return;
        }

        if (activeTool === 'select' && selectionBox && stageRef.current) {
            const boxRect = {
                x: selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x,
                y: selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y,
                width: Math.abs(selectionBox.width), height: Math.abs(selectionBox.height),
            };
            const capturedIds: string[] = [];
            layers.forEach((layer) => {
                if (!layer.width && !layer.points) return;
                if (layer.x >= boxRect.x && layer.x <= boxRect.x + boxRect.width && layer.y >= boxRect.y && layer.y <= boxRect.y + boxRect.height) {
                    capturedIds.push(layer.id);
                }
            });
            if (capturedIds.length > 0) { setSelectedLayerIds(capturedIds); setSelectedLayerId(capturedIds[0]); }
            setSelectionBox(null);
            return;
        }

        if (currentShapeId.current) { currentShapeId.current = null; saveHistory(); }
    }, [isDrawing, activeTool, lassoPoints, selectionBox, layers, setIsDrawing, setSelectedLayerIds, setSelectedLayerId, saveHistory]);

    // ─── Layer Callbacks ─────────────────────────────────
    const handleLayerDragEnd = useCallback((id: string, x: number, y: number) => { updateLayer(id, { x, y }); saveHistory(); }, [updateLayer, saveHistory]);

    const handleLayerClick = useCallback((id: string) => {
        if (!isLocked && activeTool === 'select') setSelectedLayerId(id);
        if (!isLocked && activeTool === 'object-eraser') { removeLayer(id); saveHistory(); }
    }, [isLocked, activeTool, setSelectedLayerId, removeLayer, saveHistory]);

    const handleTextDblClick = useCallback((id: string, x: number, y: number, text: string) => {
        setEditingText({ id, x, y, text });
    }, []);

    // ─── Render ──────────────────────────────────────────
    return (
        <div className={`relative w-full h-full ${activeTool === 'hand' ? (isDrawing ? 'cursor-grabbing' : 'cursor-grab') : ''}`} style={getBackgroundStyle(backgroundColor, bgPattern, zoom, camera)}>
            {editingText && (
                <textarea
                    className="absolute z-50 shadow-xl rounded outline-none p-2 text-[20px] font-sans resize-none pointer-events-auto"
                    style={{
                        top: editingText.y, left: editingText.x, minWidth: '200px',
                        backgroundColor: activeTool === 'comment' ? '#fef08a' : 'rgba(255,255,255,0.9)',
                        border: activeTool === 'comment' ? '1px solid #eab308' : '2px solid #6366f1'
                    }}
                    value={editingText.text}
                    autoFocus
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={() => { updateLayer(editingText.id, { text: editingText.text }); setEditingText(null); stageRef.current?.findOne(`#${editingText.id}`)?.show(); saveHistory(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                />
            )}

            <Stage
                ref={stageRef}
                width={dimensions.width} height={dimensions.height}
                className={`touch-none ${activeTool === 'laser' ? 'cursor-crosshair' : ''}`}
                x={camera.x} y={camera.y} scaleX={zoom} scaleY={zoom}
                draggable={activeTool === 'hand'}
                onWheel={handleWheel}
                onDragMove={(e) => { if (e.target === stageRef.current) setCamera({ x: e.target.x(), y: e.target.y() }); }}
                onMouseDown={handlePointerDown} onMouseMove={handlePointerMove} onMouseUp={handlePointerUp}
                onTouchStart={handlePointerDown} onTouchMove={handlePointerMove} onTouchEnd={handlePointerUp}
            >
                <KonvaLayer>
                    {layers.map((layer) => (
                        <LayerRenderer
                            key={layer.id}
                            layer={layer}
                            isSelected={selectedLayerIds.includes(layer.id) && (activeTool === 'select' || activeTool === 'lasso')}
                            isLocked={isLocked}
                            activeTool={activeTool}
                            onDragEnd={handleLayerDragEnd}
                            onClick={handleLayerClick}
                            onTextDblClick={handleTextDblClick}
                        />
                    ))}

                    {laserPoints.length > 0 && (
                        <Line points={laserPoints} stroke="#ef4444" strokeWidth={6} tension={0.5} lineCap="round" lineJoin="round" shadowColor="#ef4444" shadowBlur={15} />
                    )}

                    {lassoPoints.length > 0 && !isLocked && (
                        <Line points={lassoPoints} stroke="#4f46e5" strokeWidth={2} dash={[5, 5]} closed fill="rgba(79, 70, 229, 0.1)" />
                    )}

                    {selectionBox && !isLocked && (
                        <Rect
                            x={selectionBox.width < 0 ? selectionBox.x + selectionBox.width : selectionBox.x}
                            y={selectionBox.height < 0 ? selectionBox.y + selectionBox.height : selectionBox.y}
                            width={Math.abs(selectionBox.width)} height={Math.abs(selectionBox.height)}
                            fill="rgba(79, 70, 229, 0.1)" stroke="#4f46e5" strokeWidth={1 / zoom}
                        />
                    )}

                    {(activeTool === 'select' || activeTool === 'lasso') && selectedLayerIds.length > 0 && !isLocked && (
                        <Transformer ref={transformerRef} boundBoxFunc={(oldBox, newBox) => newBox.width < 5 || newBox.height < 5 ? oldBox : newBox} />
                    )}
                </KonvaLayer>
            </Stage>
        </div>
    );
}
