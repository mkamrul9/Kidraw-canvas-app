'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useCallback } from 'react';

export default function MindMapOverlay() {
    const { layers, selectedLayerId, selectedLayerIds, setSelectedLayerId, addLayer, camera, zoom, activeTool, isLocked } = useCanvasStore();

    if (activeTool !== 'select' || isLocked || !selectedLayerId || selectedLayerIds.length > 1) {
        return null;
    }

    const selectedLayer = layers.find((l) => l.id === selectedLayerId);
    if (!selectedLayer || selectedLayer.type === 'pen' || selectedLayer.type === 'pencil' || selectedLayer.type === 'eraser' || selectedLayer.type === 'arrow' || selectedLayer.type === 'straight-line' || selectedLayer.type === 'group') {
        return null;
    }

    const w = Math.abs(selectedLayer.width || 0);
    const h = Math.abs(selectedLayer.height || 0);

    // Calculate canvas-space points for the 4 buttons (offset by 25px from the shape bounds)
    const OFFSET = 25;
    const SPACING = 150; // distance to place new node

    const positions = [
        { dir: 'top', x: selectedLayer.x + w / 2, y: selectedLayer.y - OFFSET, dx: 0, dy: -(h + SPACING) },
        { dir: 'right', x: selectedLayer.x + w + OFFSET, y: selectedLayer.y + h / 2, dx: w + SPACING, dy: 0 },
        { dir: 'bottom', x: selectedLayer.x + w / 2, y: selectedLayer.y + h + OFFSET, dx: 0, dy: h + SPACING },
        { dir: 'left', x: selectedLayer.x - OFFSET, y: selectedLayer.y + h / 2, dx: -(w + SPACING), dy: 0 },
    ];

    const handleQuickAdd = (dx: number, dy: number, dir: string) => {
        const newLayerId = uuidv4();
        const arrowId = uuidv4();

        const nx = selectedLayer.x + dx;
        const ny = selectedLayer.y + dy;

        // Clone the shape
        addLayer({
            ...selectedLayer,
            id: newLayerId,
            x: nx,
            y: ny,
            text: '' // clear text for new shape
        });

        // Determine arrow binding snap points
        let startSnap: any = 'right';
        let endSnap: any = 'left';
        
        if (dir === 'top') { startSnap = 'top'; endSnap = 'bottom'; }
        if (dir === 'bottom') { startSnap = 'bottom'; endSnap = 'top'; }
        if (dir === 'left') { startSnap = 'left'; endSnap = 'right'; }
        if (dir === 'right') { startSnap = 'right'; endSnap = 'left'; }

        // Create connecting arrow
        addLayer({
            id: arrowId,
            type: 'arrow',
            x: 0, y: 0, width: 0, height: 0,
            points: [0, 0, 0, 0],
            fill: selectedLayer.stroke || selectedLayer.fill || '#0f172a',
            connectorStyle: 'curved',
            startBinding: { elementId: selectedLayer.id, snapPoint: startSnap },
            endBinding: { elementId: newLayerId, snapPoint: endSnap },
        });

        // Select the new layer
        setSelectedLayerId(newLayerId);

        // Dispatch event for Board.tsx to enter text editing mode
        const customEvent = new CustomEvent('edit-layer-text', { detail: { id: newLayerId, x: nx, y: ny } });
        window.dispatchEvent(customEvent);
    };

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[60]">
            {positions.map((pos) => {
                const screenX = pos.x * zoom + camera.x;
                const screenY = pos.y * zoom + camera.y;
                return (
                    <button
                        key={pos.dir}
                        onClick={(e) => { e.stopPropagation(); handleQuickAdd(pos.dx, pos.dy, pos.dir); }}
                        className="absolute w-6 h-6 bg-violet-600 hover:bg-violet-500 rounded-full flex items-center justify-center text-white shadow-lg pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
                        style={{ left: screenX, top: screenY }}
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                );
            })}
        </div>
    );
}
