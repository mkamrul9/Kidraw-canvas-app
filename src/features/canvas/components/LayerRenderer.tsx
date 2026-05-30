'use client';

import { Rect, Ellipse, Line, Text, Group, RegularPolygon, Star as KonvaStar, Arrow, Image as KonvaImage } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image';
import type { Layer } from '@/features/canvas/types';
import { COMMENT_WIDTH, COMMENT_HEIGHT, DEFAULT_FONT_SIZE, DEFAULT_FONT_FAMILY } from '@/features/canvas/constants';

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
    activeTool: string;
    onDragEnd: (id: string, x: number, y: number) => void;
    onDragMove?: (id: string, x: number, y: number) => void;
    onClick: (id: string) => void;
    onTextDblClick: (id: string, x: number, y: number, text: string) => void;
    onMouseEnter?: (id: string) => void;
    onMouseLeave?: (id: string) => void;
    onTransform?: (id: string, x: number, y: number, width: number, height: number) => void;
    onTransformEnd?: (id: string, x: number, y: number, width: number, height: number) => void;
}

/**
 * Renders a single canvas layer as the appropriate Konva element.
 * Extracted from Board.tsx to isolate rendering logic from event handling.
 */
export default function LayerRenderer({
    layer,
    isSelected,
    isLocked,
    activeTool,
    onDragEnd,
    onDragMove,
    onClick,
    onTextDblClick,
    onMouseEnter,
    onMouseLeave,
    onTransform,
    onTransformEnd,
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
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <Rect
                    width={layer.width}
                    height={layer.height}
                    fill={frameFill}
                    stroke="#475569"
                    strokeWidth={1.5}
                    dash={[8, 4]}
                    cornerRadius={2}
                />
                <Text
                    x={0}
                    y={-22}
                    text={layer.text || 'Frame'}
                    fill="#94a3b8"
                    fontSize={14}
                    fontFamily="sans-serif"
                    fontStyle="bold"
                    onDblClick={(event) => {
                        if (activeTool === 'select' && !isLocked) {
                            onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || 'Frame');
                        }
                    }}
                />
            </Group>
        );
    }

    // ─── Image ──────────────────────────────────────────
    if (layer.type === 'image') {
        return <URLImage key={layer.id} layer={layer} {...commonProps} />;
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
            </Group>
        );
    }

    // ─── Comment (sticky note) ──────────────────────────
    if (layer.type === 'comment') {
        return (
            <Group key={layer.id} {...commonProps} x={layer.x} y={layer.y}>
                <Rect width={COMMENT_WIDTH} height={COMMENT_HEIGHT} fill={layer.fill} shadowColor="black" shadowBlur={10} shadowOpacity={0.1} cornerRadius={4} />
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
            </Group>
        );
    }

    // ─── Geometric Shapes ───────────────────────────────
    if (layer.type === 'rectangle')
        return <Rect key={layer.id} {...commonProps} x={layer.x} y={layer.y} width={layer.width} height={layer.height} fill={layer.fill} opacity={shapeOpacity} cornerRadius={4} />;

    if (layer.type === 'ellipse')
        return <Ellipse key={layer.id} {...commonProps} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radiusX={Math.abs(layer.width / 2)} radiusY={Math.abs(layer.height / 2)} fill={layer.fill} opacity={shapeOpacity} />;

    if (layer.type === 'triangle')
        return <RegularPolygon key={layer.id} {...commonProps} sides={3} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;

    if (layer.type === 'diamond')
        return <RegularPolygon key={layer.id} {...commonProps} sides={4} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;

    if (layer.type === 'hexagon')
        return <RegularPolygon key={layer.id} {...commonProps} sides={6} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} radius={radius} fill={layer.fill} opacity={shapeOpacity} />;

    if (layer.type === 'star')
        return <KonvaStar key={layer.id} {...commonProps} numPoints={5} innerRadius={radius / 2} outerRadius={radius} x={layer.x + layer.width / 2} y={layer.y + layer.height / 2} fill={layer.fill} opacity={shapeOpacity} />;

    // ─── Lines & Arrows ─────────────────────────────────
    if (layer.type === 'straight-line')
        return <Line key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} stroke={layer.fill} strokeWidth={layer.penSize || 4} lineCap="round" opacity={shapeOpacity} />;

    if (layer.type === 'arrow')
        return <Arrow key={layer.id} {...commonProps} x={layer.x} y={layer.y} points={[0, 0, layer.width, layer.height]} fill={layer.fill} stroke={layer.fill} strokeWidth={layer.penSize || 4} pointerLength={15} pointerWidth={15} opacity={shapeOpacity} />;

    // ─── Freehand & Text ────────────────────────────────
    if (layer.type === 'pen')
        return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke={layer.stroke} strokeWidth={layer.penSize || 4} tension={0.5} lineCap="round" lineJoin="round" opacity={shapeOpacity} />;

    if (layer.type === 'text')
        return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={DEFAULT_FONT_SIZE} fontFamily={DEFAULT_FONT_FAMILY} opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || ''); } }} />;

    if (layer.type === 'eraser')
        return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;

    return null;
}
