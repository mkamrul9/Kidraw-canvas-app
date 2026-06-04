'use client';

import { Rect, Ellipse, Line, Text, Group, RegularPolygon, Star as KonvaStar, Arrow, Image as KonvaImage, Label, Tag } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import type { Layer } from '@/features/canvas/types';
import { COMMENT_WIDTH, COMMENT_HEIGHT, DEFAULT_FONT_SIZE, DEFAULT_FONT_FAMILY } from '@/features/canvas/constants';
import RoughShape from '@/features/canvas/components/RoughShape';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { getSnappingGuides, BoundingBox } from '@/features/canvas/utils/snapping';

// ─── URL Image Sub-Component ────────────────────────────────
const URLImage = ({ layer, ...props }: { layer: { src?: string; x: number; y: number; width: number; height: number; opacity?: number } }) => {
    const [img] = useImage(layer.src || '');
    return <KonvaImage image={img} x={layer.x} y={layer.y} width={layer.width} height={layer.height} opacity={layer.opacity} {...props} />;
};

// ─── Props ──────────────────────────────────────────────────
interface LayerRendererProps {
    layer: Layer;
    isSelected: boolean;
    isLocked: boolean;
    isReadOnly?: boolean;
    isSketchMode: boolean;
    activeTool: string;
    onDragEnd: (id: string, x: number, y: number) => void;
    onDragMove?: (id: string, x: number, y: number) => void;
    onClick: (id: string) => void;
    onTextDblClick: (id: string, x: number, y: number, text: string) => void;
    onMouseEnter?: (id: string) => void;
    onMouseLeave?: (id: string) => void;
    onTransform?: (id: string, x: number, y: number, width: number, height: number) => void;
    onTransformEnd?: (id: string, x: number, y: number, width: number, height: number) => void;
    onPdfPageChange?: (id: string, pageIndex: number) => void;
    isLowDetail?: boolean;
    isMagneticTarget?: boolean;
    onDblClick?: (e: any) => void;
}

/**
 * Renders a single canvas layer as the appropriate Konva element.
 * Extracted from Board.tsx to isolate rendering logic from event handling.
 */
export default function LayerRenderer({
    layer,
    isSelected,
    isLocked,
    isReadOnly = false,
    isSketchMode,
    activeTool,
    onDragEnd,
    onDragMove,
    onClick,
    onTextDblClick,
    onMouseEnter,
    onMouseLeave,
    onTransform,
    onTransformEnd,
    onPdfPageChange,
    isLowDetail = false,
    isMagneticTarget = false,
    onDblClick,
}: LayerRendererProps) {
    const isSketch = layer.isSketch ?? isSketchMode;
    const commonProps = {
        id: layer.id,
        draggable: !isLocked && !layer.isLocked && !isReadOnly && (activeTool === 'select' || activeTool === 'lasso'),
        name: 'canvas-shape',
        onDragStart: (_event: Konva.KonvaEventObject<DragEvent>) => {
            if (!isSelected) {
                onClick(layer.id);
            }
        },
        onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
            useCanvasStore.getState().setActiveGuides([]);
            onDragEnd(layer.id, event.target.x(), event.target.y());
        },
        onDragMove: (event: Konva.KonvaEventObject<DragEvent>) => {
            const node = event.target;
            const store = useCanvasStore.getState();
            
            // Bypass snapping if shift is held
            if (!event.evt.shiftKey && (layer.type === 'rectangle' || layer.type === 'ellipse' || layer.type === 'image' || layer.type === 'frame')) {
                const draggedBox: BoundingBox = {
                    x: node.x(),
                    y: node.y(),
                    width: layer.width || 0,
                    height: layer.height || 0
                };

                const otherBoxes = store.layers
                    .filter(l => l.id !== layer.id && !store.selectedLayerIds.includes(l.id) && (l.type === 'rectangle' || l.type === 'ellipse' || l.type === 'image' || l.type === 'frame' || l.type === 'text'))
                    .map(l => ({
                        x: l.x,
                        y: l.y,
                        width: l.width || 0,
                        height: l.height || 0
                    }));

                const { snappedX, snappedY, guides } = getSnappingGuides(draggedBox, otherBoxes);

                if (snappedX !== null) {
                    node.x(snappedX);
                }
                if (snappedY !== null) {
                    node.y(snappedY);
                }
                store.setActiveGuides(guides);
            } else {
                store.setActiveGuides([]);
            }

            if (onDragMove) {
                onDragMove(layer.id, node.x(), node.y());
            }
        },
        onClick: () => onClick(layer.id),
        onDblClick: onDblClick,
        onMouseEnter: () => {
            if (onMouseEnter) onMouseEnter(layer.id);
        },
        onMouseLeave: () => {
            if (onMouseLeave) onMouseLeave(layer.id);
        },
        onTransform: (event: Konva.KonvaEventObject<Event>) => {
            const node = event.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            if (onTransform) {
                const baseWidth = layer.width !== undefined ? layer.width : node.width();
                const baseHeight = layer.height !== undefined ? layer.height : node.height();
                onTransform(
                    layer.id,
                    node.x(),
                    node.y(),
                    baseWidth * scaleX,
                    baseHeight * scaleY
                );
            }
        },
        onTransformEnd: (event: Konva.KonvaEventObject<Event>) => {
            const node = event.target;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            node.scaleX(1);
            node.scaleY(1);
            if (onTransformEnd) {
                const baseWidth = layer.width !== undefined ? layer.width : node.width();
                const baseHeight = layer.height !== undefined ? layer.height : node.height();
                onTransformEnd(
                    layer.id,
                    node.x(),
                    node.y(),
                    baseWidth * scaleX,
                    baseHeight * scaleY
                );
            }
        },
    };

    const shapeOpacity = layer.opacity ?? 1;
    const radius = Math.max(Math.abs(layer.width), Math.abs(layer.height)) / 2;

    // ─── Frame (Artboard) ───────────────────────────────
    if (layer.type === 'frame') {
        const frameFill = layer.fill || 'rgba(148, 163, 184, 0.03)';
        return (
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <Rect
                    x={0}
                    y={0}
                    width={layer.width}
                    height={layer.height}
                    fill={frameFill}
                    stroke={isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}
                    strokeWidth={isSelected ? 2 : 1}
                    cornerRadius={0}
                />
                {!isLowDetail && (
                    <Text
                        text={layer.text || 'Frame'}
                        x={0}
                        y={-24}
                        fill="#94a3b8"
                        fontSize={14}
                        fontFamily={DEFAULT_FONT_FAMILY}
                        fontStyle="bold"
                        onDblClick={(event) => {
                            if (activeTool === 'select' && !isLocked && !isReadOnly) {
                                onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || 'Frame');
                            }
                        }}
                    />
                )}
            </Group>
        );
    }

    // ─── Embed Placeholder ──────────────────────────────
    if (layer.type === 'embed') {
        return (
            <Rect
                key={layer.id}
                {...commonProps}
                x={layer.x}
                y={layer.y}
                width={layer.width}
                height={layer.height}
                fill="transparent"
                stroke={isSelected ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)'}
                strokeWidth={isSelected ? 2 : 1}
                cornerRadius={12}
            />
        );
    }

    // ─── Group ──────────────────────────────────────────
    if (layer.type === 'group') {
        return (
            <Rect 
                key={layer.id} 
                {...commonProps} 
                x={layer.x} 
                y={layer.y} 
                width={layer.width} 
                height={layer.height} 
                fill="transparent"
                stroke={isMagneticTarget ? "#3b82f6" : isSelected ? "#6366f1" : "transparent"}
                strokeWidth={isMagneticTarget ? 2 : 1}
                shadowColor={isMagneticTarget ? "#3b82f6" : undefined}
                shadowBlur={isMagneticTarget ? 15 : undefined}
                dash={isMagneticTarget ? undefined : [4, 4]}
            />
        );
    }

    // ─── Image ──────────────────────────────────────────
    if (layer.type === 'image') {
        return <URLImage key={layer.id} layer={layer} {...commonProps} />;
    }

    // ─── PDF Document ───────────────────────────────────
    if (layer.type === 'pdf') {
        const pages = layer.pdfPages || [];
        const pageIdx = layer.pdfPageIndex || 0;
        const currentSrc = pages[pageIdx] || '';

        return (
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <URLImage
                    layer={{ src: currentSrc, x: 0, y: 0, width: layer.width, height: layer.height, opacity: layer.opacity }}
                />
                {pages.length > 1 && (
                    <Group
                        x={layer.width / 2 - 60}
                        y={-32}
                        onClick={(e) => e.cancelBubble = true}
                        onTouchStart={(e) => e.cancelBubble = true}
                        onMouseDown={(e) => e.cancelBubble = true}
                    >
                        <Rect
                            width={120}
                            height={26}
                            fill="#09090b"
                            stroke="#334155"
                            strokeWidth={1}
                            cornerRadius={13}
                            shadowColor="black"
                            shadowBlur={4}
                            shadowOpacity={0.2}
                        />
                        <Text
                            x={8}
                            y={7}
                            text="◀"
                            fill={pageIdx > 0 ? "#94a3b8" : "#334155"}
                            fontSize={12}
                            onClick={(e) => {
                                e.cancelBubble = true;
                                if (pageIdx > 0 && onPdfPageChange) {
                                    onPdfPageChange(layer.id, pageIdx - 1);
                                }
                            }}
                            onMouseEnter={(e) => {
                                const stage = e.target.getStage();
                                if (stage && pageIdx > 0) stage.container().style.cursor = 'pointer';
                            }}
                            onMouseLeave={(e) => {
                                const stage = e.target.getStage();
                                if (stage) stage.container().style.cursor = 'default';
                            }}
                        />
                        <Text
                            x={25}
                            y={8}
                            width={70}
                            text={`${pageIdx + 1} / ${pages.length}`}
                            fill="#ffffff"
                            fontSize={11}
                            fontStyle="bold"
                            align="center"
                            fontFamily="sans-serif"
                        />
                        <Text
                            x={102}
                            y={7}
                            text="▶"
                            fill={pageIdx < pages.length - 1 ? "#94a3b8" : "#334155"}
                            fontSize={12}
                            onClick={(e) => {
                                e.cancelBubble = true;
                                if (pageIdx < pages.length - 1 && onPdfPageChange) {
                                    onPdfPageChange(layer.id, pageIdx + 1);
                                }
                            }}
                            onMouseEnter={(e) => {
                                const stage = e.target.getStage();
                                if (stage && pageIdx < pages.length - 1) stage.container().style.cursor = 'pointer';
                            }}
                            onMouseLeave={(e) => {
                                const stage = e.target.getStage();
                                if (stage) stage.container().style.cursor = 'default';
                            }}
                        />
                    </Group>
                )}
            </Group>
        );
    }

    // ─── Sticky Note ────────────────────────────────────
    if (layer.type === 'sticky') {
        const padding = 20;
        const textWidth = Math.max(10, layer.width - padding * 2);
        
        // Font size auto-scaling heuristic to fit text in the box
        const getStickyFontSize = (textStr: string = '', w: number, h: number) => {
            const textLength = textStr.length || 1;
            const textPadding = 24;
            const area = Math.max(100, (w - textPadding) * (h - textPadding));
            const calculated = Math.sqrt(area / textLength / 0.7);
            return Math.min(24, Math.max(12, Math.floor(calculated)));
        };

        const fontSize = getStickyFontSize(layer.text, layer.width, layer.height);

        return (
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <Rect
                    width={layer.width}
                    height={layer.height}
                    fill={layer.fill}
                    shadowColor="black"
                    shadowBlur={12}
                    shadowOpacity={0.12}
                    shadowOffset={{ x: 2, y: 4 }}
                    cornerRadius={4}
                />
                {!isLowDetail && (
                    <Text
                        x={padding}
                        y={padding}
                        text={layer.text}
                        fill="#0f172a"
                        fontSize={fontSize}
                        fontFamily={isSketch ? "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive" : "sans-serif"}
                        align="center"
                        verticalAlign="middle"
                        width={textWidth}
                        height={Math.max(10, layer.height - padding * 2)}
                        wrap="word"
                        onDblClick={(event) => {
                            if (activeTool === 'select' && !isLocked && !isReadOnly) {
                                onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                            }
                        }}
                    />
                )}
            </Group>
        );
    }

    // ─── Comment (sticky note) ──────────────────────────
    if (layer.type === 'comment') {
        return (
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <Rect width={COMMENT_WIDTH} height={COMMENT_HEIGHT} fill={layer.fill} shadowColor="black" shadowBlur={10} shadowOpacity={0.1} cornerRadius={4} />
                {!isLowDetail && (
                    <Text
                        x={10}
                        y={10}
                        text={layer.text}
                        fill="#0f172a"
                        fontSize={16}
                        fontFamily={layer.fontFamily || (isSketch ? "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive" : DEFAULT_FONT_FAMILY)}
                        width={COMMENT_WIDTH - 20}
                        onDblClick={(event) => {
                            if (activeTool === 'select' && !isLocked && !isReadOnly) {
                                onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                            }
                        }}
                    />
                )}
            </Group>
        );
    }

    // ─── Geometric Shapes ───────────────────────────────
    if (layer.type === 'rectangle' || layer.type === 'ellipse' || layer.type === 'triangle' || layer.type === 'diamond' || layer.type === 'hexagon' || layer.type === 'star') {
        const textFontSize = Math.max(12, Math.min(layer.width, layer.height) * 0.2); // Responsive font size
        const textCol = layer.fill === '#ffffff' || layer.fill === '#eab308' || layer.fill === '#f97316' ? '#0f172a' : '#ffffff';

        const renderShapeContent = () => {
            if (isSketch && layer.type !== 'star' && !isLowDetail) { 
                return <RoughShape layer={{...layer, x: 0, y: 0}} commonProps={{}} />;
            }
            
            const shapeProps = layer.dashPattern?.length 
                ? { stroke: layer.fill, fill: 'transparent', strokeWidth: 4, dash: layer.dashPattern }
                : { fill: layer.fill };

            if (layer.type === 'rectangle')
                return <Rect width={layer.width} height={layer.height} cornerRadius={4} {...shapeProps} />;
            if (layer.type === 'ellipse')
                return <Ellipse x={layer.width / 2} y={layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} {...shapeProps} />;
            if (layer.type === 'triangle')
                return <RegularPolygon sides={3} x={layer.width / 2} y={layer.height / 2} radius={radius} {...shapeProps} />;
            if (layer.type === 'diamond')
                return <RegularPolygon sides={4} x={layer.width / 2} y={layer.height / 2} radius={radius} {...shapeProps} />;
            if (layer.type === 'hexagon')
                return <RegularPolygon sides={6} x={layer.width / 2} y={layer.height / 2} radius={radius} {...shapeProps} />;
            if (layer.type === 'star')
                return <KonvaStar numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.width / 2} y={layer.height / 2} {...shapeProps} />;
            return null;
        };

        return (
            <Group 
                key={layer.id} 
                {...commonProps} 
                x={layer.x} 
                y={layer.y} 
                opacity={shapeOpacity}
                onDblClick={(event) => {
                    if (activeTool === 'select' && !isLocked && !isReadOnly) {
                        onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                    }
                }}
            >
                <Group
                    shadowColor={isMagneticTarget ? "#3b82f6" : undefined}
                    shadowBlur={isMagneticTarget ? 15 : undefined}
                    shadowOpacity={isMagneticTarget ? 1 : 0}
                >
                    {renderShapeContent()}
                    {isMagneticTarget && (
                        <Rect width={layer.width} height={layer.height} stroke="#3b82f6" strokeWidth={3} cornerRadius={layer.type === 'rectangle' ? 4 : 0} listening={false} />
                    )}
                </Group>
                
                {!isLowDetail && layer.text && (
                    <Text
                        x={10}
                        y={10}
                        width={layer.width - 20}
                        height={layer.height - 20}
                        text={layer.text}
                        fill={textCol}
                        fontSize={textFontSize}
                        align="center"
                        verticalAlign="middle"
                        fontFamily={layer.fontFamily || (isSketch ? "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive" : "sans-serif")}
                    />
                )}
            </Group>
        );
    }

    // ─── Lines & Arrows ─────────────────────────────────
    if (layer.type === 'straight-line' || layer.type === 'arrow') {
        const renderTextOverlay = () => {
            if (!layer.text || isLowDetail) return null;
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, layer.width, layer.height];
            if (pts.length < 4) return null;
            
            const numSegments = pts.length / 2 - 1;
            const midSegment = Math.floor(numSegments / 2);
            const midIdx = midSegment * 2;
            const midX = (pts[midIdx] + pts[midIdx + 2]) / 2;
            const midY = (pts[midIdx + 1] + pts[midIdx + 3]) / 2;

            return (
                <Label 
                    x={midX} 
                    y={midY}
                    onDblClick={(event) => {
                        event.cancelBubble = true;
                        if (activeTool === 'select' && !isLocked && !isReadOnly) {
                            onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                        }
                    }}
                >
                    <Tag fill="#ffffff" stroke={layer.fill} strokeWidth={1} cornerRadius={4} />
                    <Text 
                        text={layer.text} 
                        fill={layer.fill} 
                        fontSize={14} 
                        fontFamily={layer.fontFamily || DEFAULT_FONT_FAMILY} 
                        padding={6} 
                    />
                </Label>
            );
        };

        const lineGroupProps = {
            ...commonProps,
            x: layer.x,
            y: layer.y,
            onDblClick: (event: any) => {
                if (activeTool === 'select' && !isLocked && !isReadOnly) {
                    onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                }
            }
        };

        if (isSketch) {
            return (
                <Group key={layer.id} {...lineGroupProps}>
                    <RoughShape layer={{...layer, x: 0, y: 0}} commonProps={{}} />
                    {renderTextOverlay()}
                </Group>
            );
        }
        
        if (layer.type === 'straight-line') {
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, layer.width, layer.height];
            return (
                <Group key={layer.id} {...lineGroupProps}>
                    <Line points={pts} stroke={layer.fill} strokeWidth={layer.penSize || 4} lineCap="round" opacity={shapeOpacity} dash={layer.dashPattern} />
                    {renderTextOverlay()}
                </Group>
            );
        }

        if (layer.type === 'arrow') {
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, layer.width, layer.height];
            return (
                <Group key={layer.id} {...lineGroupProps}>
                    <Arrow points={pts} fill={layer.fill} stroke={layer.fill} strokeWidth={layer.penSize || 4} pointerLength={15} pointerWidth={15} opacity={shapeOpacity} dash={layer.dashPattern} />
                    {renderTextOverlay()}
                </Group>
            );
        }
    }

    // ─── Freehand & Text ────────────────────────────────
    if (layer.type === 'pen' || layer.type === 'pencil') {
        if (isSketch && layer.type === 'pencil') {
            return <RoughShape key={layer.id} layer={layer} commonProps={commonProps} />;
        }
        return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={layer.type === 'pen' ? 0.5 : 0} lineCap="round" lineJoin="round" opacity={shapeOpacity} dash={layer.dashPattern} />;
    }

    if (layer.type === 'text')
        return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={layer.fontSize || DEFAULT_FONT_SIZE} fontFamily={layer.fontFamily || (isSketch ? "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive" : DEFAULT_FONT_FAMILY)} opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked && !isReadOnly) { onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || ''); } }} />;

    if (layer.type === 'eraser')
        return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;

    return null;
}
