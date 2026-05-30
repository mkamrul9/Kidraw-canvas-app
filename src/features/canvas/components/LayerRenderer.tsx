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
    onClick: (id: string) => void;
    onTextDblClick: (id: string, x: number, y: number, text: string) => void;
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
    onClick,
    onTextDblClick,
}: LayerRendererProps) {
    const commonProps = {
        id: layer.id,
        draggable: isSelected && !isLocked,
        name: 'canvas-shape',
        onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
            onDragEnd(layer.id, event.target.x(), event.target.y());
        },
        onClick: () => onClick(layer.id),
    };

    const shapeOpacity = layer.opacity ?? 1;
    const radius = Math.max(Math.abs(layer.width), Math.abs(layer.height)) / 2;

    // ─── Image ──────────────────────────────────────────
    if (layer.type === 'image') {
        return <URLImage key={layer.id} layer={layer} {...commonProps} />;
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
                            event.target.hide();
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
        return <Text key={layer.id} {...commonProps} x={layer.x} y={layer.y} text={layer.text} fill={layer.fill} fontSize={DEFAULT_FONT_SIZE} fontFamily={DEFAULT_FONT_FAMILY} opacity={shapeOpacity} onDblClick={(event) => { if (activeTool === 'select' && !isLocked) { onTextDblClick(layer.id, event.target.absolutePosition().x, event.target.absolutePosition().y, layer.text || ''); event.target.hide(); } }} />;

    if (layer.type === 'eraser')
        return <Line key={layer.id} {...commonProps} points={layer.points || []} stroke="#ffffff" strokeWidth={layer.eraserSize || 20} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation="destination-out" />;

    return null;
}
