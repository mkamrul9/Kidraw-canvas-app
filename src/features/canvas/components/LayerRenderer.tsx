'use client';

import { Rect, Ellipse, Line, Text, Group, RegularPolygon, Star as KonvaStar, Arrow, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import type { Layer } from '@/features/canvas/types';
import { COMMENT_WIDTH, COMMENT_HEIGHT, DEFAULT_FONT_SIZE, DEFAULT_FONT_FAMILY } from '@/features/canvas/constants';
import RoughShape from '@/features/canvas/components/RoughShape';

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
}

/**
 * Renders a single canvas layer as the appropriate Konva element.
 * Extracted from Board.tsx to isolate rendering logic from event handling.
 */
export default function LayerRenderer({
    layer,
    isSelected,
    isLocked,
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
}: LayerRendererProps) {
    const commonProps = {
        id: layer.id,
        draggable: isSelected && !isLocked,
        name: 'canvas-shape',
        onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
            onDragEnd(layer.id, event.target.x(), event.target.y());
        },
        onDragMove: (event: Konva.KonvaEventObject<DragEvent>) => {
            if (onDragMove) {
                onDragMove(layer.id, event.target.x(), event.target.y());
            }
        },
        onClick: () => onClick(layer.id),
        onMouseEnter: () => {
            if (onMouseEnter) onMouseEnter(layer.id);
        },
        onMouseLeave: () => {
            if (onMouseLeave) onMouseLeave(layer.id);
        },
        onTransform: (event: Konva.KonvaEventObject<any>) => {
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
        onTransformEnd: (event: Konva.KonvaEventObject<any>) => {
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
            <Group key={layer.id} x={layer.x} y={layer.y}>
                <Rect
                    {...commonProps}
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
                            if (activeTool === 'select' && !isLocked) {
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
                stroke={isSelected ? "#6366f1" : "transparent"}
                strokeWidth={1}
                dash={[4, 4]}
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
                            fill="#0B0F19"
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
                        fontFamily="sans-serif"
                        align="center"
                        verticalAlign="middle"
                        width={textWidth}
                        height={Math.max(10, layer.height - padding * 2)}
                        wrap="word"
                        onDblClick={(event) => {
                            if (activeTool === 'select' && !isLocked) {
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
                        width={COMMENT_WIDTH - 20}
                        onDblClick={(event) => {
                            if (activeTool === 'select' && !isLocked) {
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
            if (isSketchMode && layer.type !== 'star' && !isLowDetail) { 
                return <RoughShape layer={{...layer, x: 0, y: 0}} commonProps={{}} />;
            }
            if (layer.type === 'rectangle')
                return <Rect width={layer.width} height={layer.height} fill={layer.fill} cornerRadius={4} />;
            if (layer.type === 'ellipse')
                return <Ellipse x={layer.width / 2} y={layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} fill={layer.fill} />;
            if (layer.type === 'triangle')
                return <RegularPolygon sides={3} x={layer.width / 2} y={layer.height / 2} radius={radius} fill={layer.fill} />;
            if (layer.type === 'diamond')
                return <RegularPolygon sides={4} x={layer.width / 2} y={layer.height / 2} radius={radius} fill={layer.fill} />;
            if (layer.type === 'hexagon')
                return <RegularPolygon sides={6} x={layer.width / 2} y={layer.height / 2} radius={radius} fill={layer.fill} />;
            if (layer.type === 'star')
                return <KonvaStar numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.width / 2} y={layer.height / 2} fill={layer.fill} />;
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
                    if (activeTool === 'select' && !isLocked) {
                        onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || '');
                    }
                }}
            >
                {renderShapeContent()}
                
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
                        fontFamily="sans-serif"
                    />
                )}
            </Group>
        );
    }

    // ─── Lines & Arrows ─────────────────────────────────
    if (layer.type === 'straight-line' || layer.type === 'arrow') {
        if (isSketchMode) {
            return <RoughShape key={layer.id} layer={layer} commonProps={commonProps} />;
        }
        
        if (layer.type === 'straight-line') {
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, layer.width, layer.height];
            return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={pts} stroke={layer.fill} strokeWidth={layer.penSize || 4} lineCap="round" opacity={shapeOpacity} />;
        }

        if (layer.type === 'arrow') {
            const pts = layer.points && layer.points.length >= 4 ? layer.points : [0, 0, layer.width, layer.height];
            return <Arrow key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={pts} fill={layer.fill} stroke={layer.fill} strokeWidth={layer.penSize || 4} pointerLength={15} pointerWidth={15} opacity={shapeOpacity} />;
        }
    }

    // ─── Freehand & Text ────────────────────────────────
    if (layer.type === 'pen' || layer.type === 'pencil') {
        if (isSketchMode && layer.type === 'pencil') {
            return <RoughShape key={layer.id} layer={layer} commonProps={commonProps} />;
        }
        return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={layer.type === 'pen' ? 0.5 : 0} lineCap="round" lineJoin="round" opacity={shapeOpacity} />;
    }

    if (layer.type === 'text')
        return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={layer.fontSize || DEFAULT_FONT_SIZE} fontFamily={DEFAULT_FONT_FAMILY} opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || ''); } }} />;

    if (layer.type === 'eraser')
        return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;

    return null;
}
