'use client';

import { Stage, Layer as KonvaLayer, Rect, Line, Transformer, Circle, Group, Arrow } from 'react-konva';
import Konva from 'konva';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { v4 as uuidv4 } from 'uuid';

import LayerRenderer from './LayerRenderer';
import { getBackgroundStyle } from '@/features/canvas/lib/background';
import { isPointInPolygon, getSnapPoints, getSnapPointCoords, SnapPoint } from '@/features/canvas/lib/geometry';
import { useCanvasExport } from '@/features/canvas/hooks/useCanvasExport';
import { LASER_FADE_INTERVAL_MS, COMMENT_WIDTH, COMMENT_HEIGHT, COMMENT_FILL, IMAGE_MAX_WIDTH, STICKY_WIDTH, STICKY_HEIGHT, DEFAULT_STICKY_FILL } from '@/features/canvas/constants';
import { renderPDFPages } from '@/features/canvas/lib/pdf';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Shapes, Loader2 } from 'lucide-react';
import CommentOverlay from './CommentOverlay';

export default function Board() {
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [editingText, setEditingText] = useState<{ id: string; x: number; y: number; text: string } | null>(null);
    const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [lassoPoints, setLassoPoints] = useState<number[]>([]);
    const [laserPoints, setLaserPoints] = useState<number[]>([]);
    const [activeSnapPoint, setActiveSnapPoint] = useState<SnapPoint | null>(null);
    const [hoveredShapeId, setHoveredShapeId] = useState<string | null>(null);
    const [isDraggingFile, setIsDraggingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const { data: session } = useSession();
    const [cursorChat, setCursorChat] = useState<{ x: number; y: number; text: string; isOpen: boolean; isEditing: boolean } | null>(null);
    const cursorChatTimerRef = useRef<any>(null);
    const cursorChatInputRef = useRef<HTMLInputElement>(null);

    const {
        layers, activeTool, activeShape, activeColor, backgroundColor, bgPattern,
        activeOpacity, isDrawing, setIsDrawing, addLayer, updateLayer, removeLayer,
        saveHistory, selectedLayerIds, setSelectedLayerIds, setSelectedLayerId,
        eraserSize, penSize, camera, setCamera, zoom, setZoom, isLocked,
    } = useCanvasStore();

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);
    const currentShapeId = useRef<string | null>(null);
    const hoverTimeoutRef = useRef<any>(null);

    const processUploadedFile = useCallback(async (file: File, x: number, y: number) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const src = ev.target?.result as string;
                if (!src) return;
                const img = new window.Image();
                img.src = src;
                img.onload = () => {
                    const scale = Math.min(1, IMAGE_MAX_WIDTH / img.width);
                    const width = img.width * scale;
                    const height = img.height * scale;
                    addLayer({
                        id: uuidv4(),
                        type: 'image',
                        x: x - width / 2,
                        y: y - height / 2,
                        width,
                        height,
                        fill: 'transparent',
                        src,
                        opacity: activeOpacity,
                    });
                    saveHistory();
                };
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/pdf') {
            try {
                setUploadProgress(0);
                const { pages, width, height } = await renderPDFPages(file, (pct) => {
                    setUploadProgress(pct);
                });
                
                if (pages.length > 0) {
                    addLayer({
                        id: uuidv4(),
                        type: 'pdf',
                        x: x - width / 2,
                        y: y - height / 2,
                        width,
                        height,
                        fill: 'transparent',
                        opacity: activeOpacity,
                        pdfPages: pages,
                        pdfPageIndex: 0,
                    });
                    saveHistory();
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to parse PDF file.');
            } finally {
                setUploadProgress(null);
            }
        } else {
            toast.error('Unsupported file format. Please upload images or PDFs.');
        }
    }, [activeOpacity, addLayer, saveHistory]);

    const resetCursorChatTimer = useCallback((durationMs = 6000) => {
        if (cursorChatTimerRef.current) {
            clearTimeout(cursorChatTimerRef.current);
        }
        cursorChatTimerRef.current = setTimeout(() => {
            setCursorChat(null);
        }, durationMs);
    }, []);

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
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                const active = document.activeElement;
                if (
                    active &&
                    (active.tagName === 'INPUT' ||
                        active.tagName === 'TEXTAREA' ||
                        active.getAttribute('contenteditable') === 'true')
                ) {
                    return;
                }

                e.preventDefault();

                const stage = stageRef.current;
                const pos = stage?.getPointerPosition() || { x: window.innerWidth / 2, y: window.innerHeight / 2 };

                setCursorChat({
                    x: pos.x,
                    y: pos.y,
                    text: '',
                    isOpen: true,
                    isEditing: true,
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!cursorChat || !cursorChat.isOpen) return;

        const handleMouseMove = (e: MouseEvent) => {
            setCursorChat((prev) => {
                if (!prev) return null;
                // Only update position coordinates, keeping other state attributes intact
                return { ...prev, x: e.clientX, y: e.clientY };
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [cursorChat?.isOpen]);

    useEffect(() => {
        if (cursorChat && cursorChat.isOpen) {
            resetCursorChatTimer(6000);
        } else {
            if (cursorChatTimerRef.current) {
                clearTimeout(cursorChatTimerRef.current);
                cursorChatTimerRef.current = null;
            }
        }
    }, [cursorChat?.isOpen, cursorChat?.isEditing, resetCursorChatTimer]);

    useEffect(() => {
        if (cursorChat?.isEditing) {
            const timer = setTimeout(() => {
                cursorChatInputRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [cursorChat?.isEditing]);

    useEffect(() => {
        const handleInsertFile = async (event: Event) => {
            const customEvent = event as CustomEvent<File>;
            const file = customEvent.detail;
            if (!file) return;

            const centerX = (-camera.x + dimensions.width / 2) / zoom;
            const centerY = (-camera.y + dimensions.height / 2) / zoom;
            await processUploadedFile(file, centerX, centerY);
        };
        window.addEventListener('insert-file', handleInsertFile as EventListener);
        return () => window.removeEventListener('insert-file', handleInsertFile as EventListener);
    }, [camera, zoom, dimensions, processUploadedFile]);

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
            (document.activeElement as HTMLElement)?.blur();
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
        if (activeTool === 'comment') return; // Handled by CommentOverlay

        const storeLayers = useCanvasStore.getState().layers;

        if (activeTool === 'frame') {
            setSelectedLayerId(null);
            setIsDrawing(true);
            const newId = uuidv4();
            currentShapeId.current = newId;
            addLayer({
                id: newId,
                type: 'frame',
                x: pos.x, y: pos.y, width: 0, height: 0, fill: 'rgba(148, 163, 184, 0.03)',
                text: `Frame ${storeLayers.filter(l => l.type === 'frame').length + 1}`,
                opacity: activeOpacity,
            });
            return;
        }

        if (activeTool === 'shape' && activeShape === 'arrow') {
            setSelectedLayerId(null);
            setIsDrawing(true);
            const newId = uuidv4();
            currentShapeId.current = newId;

            const allSnaps = storeLayers.flatMap((l) => getSnapPoints(l));
            let startX = pos.x;
            let startY = pos.y;
            let startBinding: any = undefined;

            let closestSnap = null;
            let minDistance = 20;
            for (const snap of allSnaps) {
                const dist = Math.hypot(snap.x - pos.x, snap.y - pos.y);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestSnap = snap;
                }
            }

            if (closestSnap) {
                startX = closestSnap.x;
                startY = closestSnap.y;
                startBinding = { elementId: closestSnap.elementId, snapPoint: closestSnap.type };
            }

            addLayer({
                id: newId,
                type: 'arrow',
                x: startX, y: startY, width: 0, height: 0, fill: activeColor,
                opacity: activeOpacity,
                startBinding,
            });
            return;
        }

        if (activeTool === 'text' || activeTool === 'sticky') {
            setSelectedLayerId(null);
            const newId = uuidv4();
            if (activeTool === 'sticky') {
                const finalColor = activeColor !== '#000000' ? activeColor : DEFAULT_STICKY_FILL;
                addLayer({ id: newId, type: 'sticky', x: pos.x, y: pos.y, width: STICKY_WIDTH, height: STICKY_HEIGHT, fill: finalColor, text: '', opacity: activeOpacity });
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
        const storeLayers = useCanvasStore.getState().layers;
        const currentShape = storeLayers.find((layer) => layer.id === currentShapeId.current);
        if (!currentShape) return;

        if (activeTool === 'pen' || activeTool === 'eraser') {
            updateLayer(currentShapeId.current, { points: [...(currentShape.points || []), pos.x, pos.y] });
        } else {
            if (currentShape.type === 'arrow') {
                const allSnaps = storeLayers.flatMap((l) => getSnapPoints(l)).filter(s => s.elementId !== currentShape.startBinding?.elementId);
                let endX = pos.x;
                let endY = pos.y;
                let hoverSnap = null;

                let minDistance = 20;
                for (const snap of allSnaps) {
                    const dist = Math.hypot(snap.x - pos.x, snap.y - pos.y);
                    if (dist < minDistance) {
                        minDistance = dist;
                        hoverSnap = snap;
                    }
                }

                if (hoverSnap) {
                    endX = hoverSnap.x;
                    endY = hoverSnap.y;
                    setActiveSnapPoint(hoverSnap);
                } else {
                    setActiveSnapPoint(null);
                }

                updateLayer(currentShapeId.current, {
                    width: endX - currentShape.x,
                    height: endY - currentShape.y,
                });
            } else {
                updateLayer(currentShapeId.current, { width: pos.x - currentShape.x, height: pos.y - currentShape.y });
            }
        }
    }, [isDrawing, activeTool, selectionBox, updateLayer]);

    const handlePointerUp = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'laser') return;

        const storeLayers = useCanvasStore.getState().layers;

        if (activeTool === 'lasso' && lassoPoints.length > 4) {
            const capturedIds: string[] = [];
            storeLayers.forEach((layer) => {
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
            storeLayers.forEach((layer) => {
                if (!layer.width && !layer.points) return;
                if (layer.x >= boxRect.x && layer.x <= boxRect.x + boxRect.width && layer.y >= boxRect.y && layer.y <= boxRect.y + boxRect.height) {
                    capturedIds.push(layer.id);
                }
            });
            if (capturedIds.length > 0) { setSelectedLayerIds(capturedIds); setSelectedLayerId(capturedIds[0]); }
            setSelectionBox(null);
            return;
        }

        if (currentShapeId.current) {
            const currentShape = storeLayers.find((layer) => layer.id === currentShapeId.current);
            if (currentShape && currentShape.type === 'arrow' && activeSnapPoint) {
                updateLayer(currentShapeId.current, {
                    endBinding: { elementId: activeSnapPoint.elementId, snapPoint: activeSnapPoint.type }
                });
            }
            currentShapeId.current = null;
            setActiveSnapPoint(null);
            saveHistory();
        }
    }, [isDrawing, activeTool, lassoPoints, selectionBox, setIsDrawing, setSelectedLayerIds, setSelectedLayerId, saveHistory]);

    // ─── Layer Callbacks ─────────────────────────────────
    const recalculateConnectedArrows = useCallback((draggedId: string, nextX: number, nextY: number) => {
        const storeLayers = useCanvasStore.getState().layers;
        const connectedArrows = storeLayers.filter(
            (layer) =>
                layer.type === 'arrow' &&
                (layer.startBinding?.elementId === draggedId || layer.endBinding?.elementId === draggedId)
        );

        connectedArrows.forEach((arrow) => {
            let startX = arrow.x;
            let startY = arrow.y;
            if (arrow.startBinding) {
                const startBinding = arrow.startBinding;
                const shape = startBinding.elementId === draggedId
                    ? { ...storeLayers.find((l) => l.id === draggedId)!, x: nextX, y: nextY }
                    : storeLayers.find((l) => l.id === startBinding.elementId);
                if (shape) {
                    const pt = getSnapPointCoords(shape, startBinding.snapPoint);
                    startX = pt.x;
                    startY = pt.y;
                }
            }

            let endX = arrow.x + arrow.width;
            let endY = arrow.y + arrow.height;
            if (arrow.endBinding) {
                const endBinding = arrow.endBinding;
                const shape = endBinding.elementId === draggedId
                    ? { ...storeLayers.find((l) => l.id === draggedId)!, x: nextX, y: nextY }
                    : storeLayers.find((l) => l.id === endBinding.elementId);
                if (shape) {
                    const pt = getSnapPointCoords(shape, endBinding.snapPoint);
                    endX = pt.x;
                    endY = pt.y;
                }
            }

            updateLayer(arrow.id, {
                x: startX,
                y: startY,
                width: endX - startX,
                height: endY - startY,
            });
        });
    }, [updateLayer]);

    const handleLayerDragMove = useCallback((id: string, x: number, y: number) => {
        const storeLayers = useCanvasStore.getState().layers;
        const frame = storeLayers.find((l) => l.id === id);

        if (frame && frame.type === 'frame') {
            const dx = x - frame.x;
            const dy = y - frame.y;
            updateLayer(id, { x, y });

            const children = storeLayers.filter((l) => l.parentId === id);
            children.forEach((child) => {
                const nextChildX = child.x + dx;
                const nextChildY = child.y + dy;
                updateLayer(child.id, { x: nextChildX, y: nextChildY });
                recalculateConnectedArrows(child.id, nextChildX, nextChildY);
            });
        } else {
            updateLayer(id, { x, y });
            recalculateConnectedArrows(id, x, y);
        }
    }, [updateLayer, recalculateConnectedArrows]);

    const checkShapeFrameContainment = useCallback((shapeId: string, sx: number, sy: number) => {
        const storeLayers = useCanvasStore.getState().layers;
        const shape = storeLayers.find((l) => l.id === shapeId);
        if (!shape || shape.type === 'frame') return;

        const sw = shape.width || 0;
        const sh = shape.height || 0;
        const cx = sx + sw / 2;
        const cy = sy + sh / 2;

        const frames = storeLayers.filter((l) => l.type === 'frame');
        let containingFrameId: string | undefined = undefined;

        for (const frame of frames) {
            const fx1 = frame.width < 0 ? frame.x + frame.width : frame.x;
            const fx2 = frame.width < 0 ? frame.x : frame.x + frame.width;
            const fy1 = frame.height < 0 ? frame.y + frame.height : frame.y;
            const fy2 = frame.height < 0 ? frame.y : frame.y + frame.height;

            if (cx >= fx1 && cx <= fx2 && cy >= fy1 && cy <= fy2) {
                containingFrameId = frame.id;
                break;
            }
        }

        if (shape.parentId !== containingFrameId) {
            updateLayer(shapeId, { parentId: containingFrameId });
        }
    }, [updateLayer]);

    const updateAllFramesContainment = useCallback(() => {
        const storeLayers = useCanvasStore.getState().layers;
        const shapes = storeLayers.filter((l) => l.type !== 'frame' && l.type !== 'arrow');
        const frames = storeLayers.filter((l) => l.type === 'frame');

        shapes.forEach((shape) => {
            const sw = shape.width || 0;
            const sh = shape.height || 0;
            const cx = shape.x + sw / 2;
            const cy = shape.y + sh / 2;

            let containingFrameId: string | undefined = undefined;
            for (const frame of frames) {
                const fx1 = frame.width < 0 ? frame.x + frame.width : frame.x;
                const fx2 = frame.width < 0 ? frame.x : frame.x + frame.width;
                const fy1 = frame.height < 0 ? frame.y + frame.height : frame.y;
                const fy2 = frame.height < 0 ? frame.y : frame.y + frame.height;

                if (cx >= fx1 && cx <= fx2 && cy >= fy1 && cy <= fy2) {
                    containingFrameId = frame.id;
                    break;
                }
            }

            if (shape.parentId !== containingFrameId) {
                updateLayer(shape.id, { parentId: containingFrameId });
            }
        });
    }, [updateLayer]);

    const handleLayerDragEnd = useCallback((id: string, x: number, y: number) => {
        const storeLayers = useCanvasStore.getState().layers;
        const frame = storeLayers.find((l) => l.id === id);

        if (frame && frame.type === 'frame') {
            const dx = x - frame.x;
            const dy = y - frame.y;
            updateLayer(id, { x, y });

            const children = storeLayers.filter((l) => l.parentId === id);
            children.forEach((child) => {
                const nextChildX = child.x + dx;
                const nextChildY = child.y + dy;
                updateLayer(child.id, { x: nextChildX, y: nextChildY });
                recalculateConnectedArrows(child.id, nextChildX, nextChildY);
            });
            updateAllFramesContainment();
        } else {
            updateLayer(id, { x, y });
            recalculateConnectedArrows(id, x, y);
            checkShapeFrameContainment(id, x, y);
        }
        saveHistory();
    }, [updateLayer, recalculateConnectedArrows, checkShapeFrameContainment, updateAllFramesContainment, saveHistory]);

    const handleLayerTransform = useCallback((id: string, x: number, y: number, width: number, height: number) => {
        updateLayer(id, { x, y, width, height });
        recalculateConnectedArrows(id, x, y);
    }, [updateLayer, recalculateConnectedArrows]);

    const handleLayerTransformEnd = useCallback((id: string, x: number, y: number, width: number, height: number) => {
        updateLayer(id, { x, y, width, height });
        recalculateConnectedArrows(id, x, y);
        const storeLayers = useCanvasStore.getState().layers;
        const layer = storeLayers.find((l) => l.id === id);
        if (layer?.type === 'frame') {
            updateAllFramesContainment();
        } else {
            checkShapeFrameContainment(id, x, y);
        }
        saveHistory();
    }, [updateLayer, recalculateConnectedArrows, checkShapeFrameContainment, updateAllFramesContainment, saveHistory]);

    const handleLayerClick = useCallback((id: string) => {
        if (!isLocked && activeTool === 'select') setSelectedLayerId(id);
        if (!isLocked && activeTool === 'object-eraser') { removeLayer(id); saveHistory(); }
    }, [isLocked, activeTool, setSelectedLayerId, removeLayer, saveHistory]);

    const handleTextDblClick = useCallback((id: string, x: number, y: number, text: string) => {
        setEditingText({ id, x, y, text });
    }, []);

    const handlePdfPageChange = useCallback((id: string, pageIndex: number) => {
        updateLayer(id, { pdfPageIndex: pageIndex });
        saveHistory();
    }, [updateLayer, saveHistory]);

    const handleMouseEnter = useCallback((id: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        setHoveredShapeId(id);
    }, []);

    const handleMouseLeave = useCallback((id: string) => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredShapeId((prev) => (prev === id ? null : prev));
        }, 800);
    }, []);

    // ─── Render ──────────────────────────────────────────
    const editingLayer = editingText ? layers.find((l) => l.id === editingText.id) : null;
    const isSticky = editingLayer?.type === 'sticky';
    const isComment = editingLayer?.type === 'comment';
    const isFrame = editingLayer?.type === 'frame';

    const getStickyFontSize = (textStr: string = '', w: number, h: number) => {
        const textLength = textStr.length || 1;
        const textPadding = 24;
        const area = Math.max(100, (w - textPadding) * (h - textPadding));
        const calculated = Math.sqrt(area / textLength / 0.7);
        return Math.min(24, Math.max(12, Math.floor(calculated)));
    };

    const textareaStyle = (() => {
        if (!editingText || !editingLayer) return {};
        const bg = isSticky || isComment ? (editingLayer.fill || '#fef08a') : 'rgba(255,255,255,0.9)';
        const textCol = '#0f172a';
        
        if (isFrame) {
            return {
                top: editingText.y,
                left: editingText.x,
                width: '140px',
                height: '26px',
                backgroundColor: '#0B0F19',
                color: '#94a3b8',
                fontSize: `${14 * zoom}px`,
                padding: '2px 6px',
                border: '1px solid #475569',
                borderRadius: '4px',
                lineHeight: '1.2',
                fontWeight: 'bold',
            };
        }

        if (isSticky) {
            const fs = getStickyFontSize(editingText.text, editingLayer.width, editingLayer.height);
            const pad = 20 * zoom;
            return {
                top: editingText.y,
                left: editingText.x,
                width: `${editingLayer.width * zoom}px`,
                height: `${editingLayer.height * zoom}px`,
                backgroundColor: bg,
                color: textCol,
                fontSize: `${fs * zoom}px`,
                padding: `${pad}px`,
                textAlign: 'center' as const,
                border: 'none',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                borderRadius: '4px',
                lineHeight: '1.4',
            };
        }

        if (isComment) {
            return {
                top: editingText.y,
                left: editingText.x,
                width: `${COMMENT_WIDTH * zoom}px`,
                height: `${COMMENT_HEIGHT * zoom}px`,
                backgroundColor: bg,
                color: textCol,
                fontSize: `${16 * zoom}px`,
                padding: `${10 * zoom}px`,
                border: '1px solid #eab308',
                borderRadius: '4px',
            };
        }

        return {
            top: editingText.y,
            left: editingText.x,
            minWidth: '200px',
            backgroundColor: 'rgba(255,255,255,0.9)',
            border: '2px solid #6366f1',
            color: editingLayer.fill || '#000000',
            fontSize: `${20 * zoom}px`,
            padding: '8px',
        };
    })();

    return (
        <div
            className={`relative w-full h-full ${activeTool === 'hand' ? (isDrawing ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
            style={getBackgroundStyle(backgroundColor, bgPattern, zoom, camera)}
            onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'copy';
                setIsDraggingFile(true);
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingFile(false);
            }}
            onDrop={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsDraggingFile(false);

                const files = e.dataTransfer.files;
                if (!files || files.length === 0) return;

                const file = files[0];
                const rect = stageRef.current?.container().getBoundingClientRect();
                if (!rect) return;

                const clientX = e.clientX - rect.left;
                const clientY = e.clientY - rect.top;
                const dropX = (clientX - camera.x) / zoom;
                const dropY = (clientY - camera.y) / zoom;

                await processUploadedFile(file, dropX, dropY);
            }}
        >
            {editingText && (
                <textarea
                    className="absolute z-50 shadow-xl rounded outline-none resize-none pointer-events-auto font-sans"
                    style={textareaStyle}
                    value={editingText.text}
                    autoFocus
                    onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
                    onBlur={() => { updateLayer(editingText.id, { text: editingText.text }); setEditingText(null); saveHistory(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                />
            )}

            {cursorChat && cursorChat.isOpen && (
                <div
                    className={`absolute z-[100] pointer-events-none select-none flex flex-col items-start transition-all duration-75 ease-out animate-cursor-chat-pop ${
                        !cursorChat.isEditing ? 'animate-cursor-chat-fade-out' : ''
                    }`}
                    style={{
                        left: `${cursorChat.x}px`,
                        top: `${cursorChat.y}px`,
                    }}
                >
                    {/* Beautiful custom Figma-style mouse cursor */}
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]"
                    >
                        <path
                            d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                            fill="#8b5cf6"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinejoin="miter"
                        />
                    </svg>

                    {/* Chat Bubble Container */}
                    <div className="ml-4 mt-3 flex flex-col pointer-events-auto items-start">
                        {/* Username label */}
                        <div className="bg-violet-700/95 backdrop-blur-sm text-[10px] text-violet-100 font-bold px-2.5 py-0.5 rounded-t-lg border-t border-x border-violet-500/30 w-fit select-none">
                            {session?.user?.name || 'You'}
                        </div>

                        {/* Speech bubble */}
                        <div className="flex items-center gap-2 bg-violet-600 border border-violet-500/80 text-white text-sm px-3.5 py-2 shadow-2xl rounded-r-xl rounded-bl-xl rounded-tl-none min-h-[38px] max-w-[280px] min-w-[140px] transform origin-top-left">
                            {cursorChat.isEditing ? (
                                <input
                                    ref={cursorChatInputRef}
                                    type="text"
                                    placeholder="Say something..."
                                    className="bg-transparent text-white placeholder-violet-200/50 border-none outline-none font-sans text-sm w-full py-0.5 focus:ring-0 focus:outline-none"
                                    value={cursorChat.text}
                                    onChange={(e) => {
                                        setCursorChat((prev) => {
                                            if (!prev) return null;
                                            return { ...prev, text: e.target.value };
                                        });
                                        resetCursorChatTimer(6000);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            e.currentTarget.blur();
                                        } else if (e.key === 'Escape') {
                                            e.preventDefault();
                                            setCursorChat(null);
                                        }
                                    }}
                                    onBlur={() => {
                                        setCursorChat((prev) => {
                                            if (!prev) return null;
                                            if (!prev.isEditing) return prev; // If already editing is set to false, don't execute blur logic
                                            if (prev.text.trim()) {
                                                return { ...prev, isEditing: false };
                                            }
                                            return null;
                                        });
                                    }}
                                />
                            ) : (
                                <span className="break-words whitespace-pre-wrap font-sans text-sm font-medium pr-1 select-text">
                                    {cursorChat.text}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isDraggingFile && (
                <div className="absolute inset-0 bg-indigo-600/10 backdrop-blur-[2px] border-4 border-dashed border-indigo-500 rounded-3xl m-4 flex flex-col items-center justify-center gap-3 z-[100] pointer-events-none animate-in fade-in zoom-in duration-200">
                    <div className="bg-indigo-600 p-4 rounded-full shadow-lg border border-indigo-400">
                        <Shapes className="w-8 h-8 text-white animate-bounce" />
                    </div>
                    <span className="font-extrabold text-indigo-400 text-lg uppercase tracking-wider">Drop images or PDFs here</span>
                </div>
            )}

            {uploadProgress !== null && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0B0F19]/90 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 z-[110] min-w-[280px]">
                    <div className="flex items-center gap-2 text-white">
                        <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                        <span className="font-bold text-sm">Processing Document...</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="bg-violet-600 h-full rounded-full transition-all duration-150 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{uploadProgress}%</span>
                </div>
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
                    {(() => {
                        const sortedLayers = [...layers].sort((a, b) => {
                            if (a.type === 'frame' && b.type !== 'frame') return -1;
                            if (a.type !== 'frame' && b.type === 'frame') return 1;
                            return 0;
                        });
                        return sortedLayers.map((layer) => (
                            <LayerRenderer
                                key={layer.id}
                                layer={layer}
                                isSelected={selectedLayerIds.includes(layer.id) && (activeTool === 'select' || activeTool === 'lasso')}
                                isLocked={isLocked}
                                activeTool={activeTool}
                                onDragEnd={handleLayerDragEnd}
                                onDragMove={handleLayerDragMove}
                                onClick={handleLayerClick}
                                onTextDblClick={handleTextDblClick}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onTransform={handleLayerTransform}
                                onTransformEnd={handleLayerTransformEnd}
                                onPdfPageChange={handlePdfPageChange}
                            />
                        ));
                    })()}

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

                    {activeSnapPoint && (
                        <Circle
                            x={activeSnapPoint.x}
                            y={activeSnapPoint.y}
                            radius={6}
                            fill="#3b82f6"
                            stroke="#ffffff"
                            strokeWidth={1.5}
                            shadowColor="#3b82f6"
                            shadowBlur={6}
                        />
                    )}

                    {hoveredShapeId && (
                        <Group>
                            {(() => {
                                const hl = layers.find(l => l.id === hoveredShapeId);
                                if (!hl) return null;
                                const snaps = getSnapPoints(hl);
                                const getArrowPoints = (type: 'top' | 'right' | 'bottom' | 'left', x: number, y: number) => {
                                    const len = 12 * (1 / zoom);
                                    const gap = 14 * (1 / zoom);
                                    switch (type) {
                                        case 'top': return [x, y - gap, x, y - gap - len];
                                        case 'bottom': return [x, y + gap, x, y + gap + len];
                                        case 'left': return [x - gap, y, x - gap - len, y];
                                        case 'right': return [x + gap, y, x + gap + len, y];
                                    }
                                };
                                return snaps.map((snap, idx) => (
                                    <Arrow
                                        key={`connector-${hoveredShapeId}-${idx}`}
                                        points={getArrowPoints(snap.type, snap.x, snap.y)}
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        strokeWidth={2.5 * (1 / zoom)}
                                        pointerLength={5 * (1 / zoom)}
                                        pointerWidth={5 * (1 / zoom)}
                                        onMouseEnter={(e) => {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            const stage = e.target.getStage();
                                            if (stage) stage.container().style.cursor = 'pointer';
                                            const shape = e.target as Konva.Shape;
                                            shape.stroke('#2563eb');
                                            shape.fill('#2563eb');
                                            shape.getLayer()?.batchDraw();
                                        }}
                                        onMouseLeave={(e) => {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            hoverTimeoutRef.current = setTimeout(() => {
                                                setHoveredShapeId(null);
                                            }, 800);
                                            const stage = e.target.getStage();
                                            if (stage) stage.container().style.cursor = 'default';
                                            const shape = e.target as Konva.Shape;
                                            shape.stroke('#3b82f6');
                                            shape.fill('#3b82f6');
                                            shape.getLayer()?.batchDraw();
                                        }}
                                        onMouseDown={(e) => {
                                            e.cancelBubble = true;
                                            setSelectedLayerId(null);
                                            setIsDrawing(true);
                                            const newId = uuidv4();
                                            currentShapeId.current = newId;

                                            addLayer({
                                                id: newId,
                                                type: 'arrow',
                                                x: snap.x,
                                                y: snap.y,
                                                width: 0,
                                                height: 0,
                                                fill: activeColor,
                                                opacity: activeOpacity,
                                                startBinding: { elementId: hoveredShapeId, snapPoint: snap.type }
                                            });
                                        }}
                                    />
                                ));
                            })()}
                        </Group>
                    )}
                </KonvaLayer>
            </Stage>
            <CommentOverlay />
        </div>
    );
}
