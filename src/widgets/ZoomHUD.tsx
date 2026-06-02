'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { ZoomIn, ZoomOut, Share2, Map as MapIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { ToolButton } from '@/shared/components/ToolButton';
import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';


const PADDING = 1000; // Extra padding around the world bounds

function MinimapOverlay() {
    const { layers, camera, zoom, setCamera } = useCanvasStore();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const svgRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    if (dimensions.width === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    layers.forEach(layer => {
        const x = layer.x;
        const y = layer.y;
        const w = layer.width || 0;
        const h = layer.height || 0;
        
        if (layer.points && layer.points.length > 0) {
            for (let i = 0; i < layer.points.length; i += 2) {
                const px = x + layer.points[i];
                const py = y + layer.points[i+1];
                if (px < minX) minX = px;
                if (px > maxX) maxX = px;
                if (py < minY) minY = py;
                if (py > maxY) maxY = py;
            }
        } else {
            const left = Math.min(x, x + w);
            const right = Math.max(x, x + w);
            const top = Math.min(y, y + h);
            const bottom = Math.max(y, y + h);
            if (left < minX) minX = left;
            if (right > maxX) maxX = right;
            if (top < minY) minY = top;
            if (bottom > maxY) maxY = bottom;
        }
    });

    if (minX === Infinity) {
        minX = 0; minY = 0; maxX = 1000; maxY = 1000;
    }

    const viewportX = -camera.x / zoom;
    const viewportY = -camera.y / zoom;
    const viewportW = dimensions.width / zoom;
    const viewportH = dimensions.height / zoom;

    minX = Math.min(minX, viewportX) - PADDING;
    minY = Math.min(minY, viewportY) - PADDING;
    maxX = Math.max(maxX, viewportX + viewportW) + PADDING;
    maxY = Math.max(maxY, viewportY + viewportH) + PADDING;

    const worldWidth = maxX - minX;
    const worldHeight = maxY - minY;

    const scale = Math.min(200 / worldWidth, 120 / worldHeight); // Fit in the small box
    
    const mapWidth = worldWidth * scale;
    const mapHeight = worldHeight * scale;

    const worldToMinimap = (wx: number, wy: number) => {
        return {
            x: (wx - minX) * scale,
            y: (wy - minY) * scale
        };
    };

    const updateCamera = (e: React.PointerEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const wx = (mx / scale) + minX;
        const wy = (my / scale) + minY;

        const newCamX = -(wx * zoom) + (dimensions.width / 2);
        const newCamY = -(wy * zoom) + (dimensions.height / 2);

        setCamera({ x: newCamX, y: newCamY });
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        isDragging.current = true;
        updateCamera(e);
        if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging.current) return;
        updateCamera(e);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        isDragging.current = false;
        if (svgRef.current && svgRef.current.hasPointerCapture(e.pointerId)) {
            svgRef.current.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <div className="bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 w-56 h-36 relative overflow-hidden select-none flex items-center justify-center">
            <div 
                className="border border-slate-700 bg-white overflow-hidden rounded cursor-crosshair touch-none relative"
                style={{ width: mapWidth, height: mapHeight }}
            >
                <svg
                    ref={svgRef}
                    width={mapWidth}
                    height={mapHeight}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    className="w-full h-full"
                >
                    {layers.map(layer => {
                        if (layer.type === 'pen' || layer.type === 'pencil' || layer.type === 'eraser') {
                            if (!layer.points || layer.points.length === 0) return null;
                            let lMinX = Infinity, lMinY = Infinity, lMaxX = -Infinity, lMaxY = -Infinity;
                            for (let i = 0; i < layer.points.length; i += 2) {
                                const px = layer.x + layer.points[i];
                                const py = layer.y + layer.points[i+1];
                                if (px < lMinX) lMinX = px;
                                if (px > lMaxX) lMaxX = px;
                                if (py < lMinY) lMinY = py;
                                if (py > lMaxY) lMaxY = py;
                            }
                            const pos = worldToMinimap(lMinX, lMinY);
                            const sizeX = (lMaxX - lMinX) * scale;
                            const sizeY = (lMaxY - lMinY) * scale;
                            return <rect key={layer.id} x={pos.x} y={pos.y} width={Math.max(1, sizeX)} height={Math.max(1, sizeY)} fill={layer.stroke || layer.fill || '#475569'} opacity={0.6} />;
                        }

                        if (layer.type === 'arrow' || layer.type === 'straight-line') {
                            const pts = layer.points || [0, 0, layer.width || 0, layer.height || 0];
                            const p1 = worldToMinimap(layer.x + pts[0], layer.y + pts[1]);
                            const p2 = worldToMinimap(layer.x + pts[2], layer.y + pts[3]);
                            return <line key={layer.id} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={layer.fill || '#475569'} strokeWidth={Math.max(1, (layer.penSize || 4) * scale)} opacity={0.8} />;
                        }

                        const pos = worldToMinimap(Math.min(layer.x, layer.x + (layer.width || 0)), Math.min(layer.y, layer.y + (layer.height || 0)));
                        const width = Math.abs(layer.width || 0) * scale;
                        const height = Math.abs(layer.height || 0) * scale;

                        if (layer.type === 'ellipse') {
                            return <ellipse key={layer.id} cx={pos.x + width/2} cy={pos.y + height/2} rx={width/2} ry={height/2} fill={layer.fill || '#475569'} opacity={0.8} />;
                        }

                        return <rect key={layer.id} x={pos.x} y={pos.y} width={Math.max(1, width)} height={Math.max(1, height)} fill={layer.fill || (layer.type === 'embed' ? '#1e293b' : '#475569')} opacity={0.8} />;
                    })}

                    <rect 
                        x={(viewportX - minX) * scale} 
                        y={(viewportY - minY) * scale} 
                        width={viewportW * scale} 
                        height={viewportH * scale} 
                        fill="rgba(139, 92, 246, 0.15)"
                        stroke="#8b5cf6"
                        strokeWidth={1.5}
                        className="pointer-events-none"
                    />
                </svg>
            </div>
        </div>
    );
}

export default function ZoomHUD() {
    const { zoom, setZoom, setCamera } = useCanvasStore();
    const [showMinimap, setShowMinimap] = useState(false);
    const [shareSetting, setShareSetting] = useState('VIEW');

    const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
    const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));
    const resetView = () => { setZoom(1); setCamera({ x: 0, y: 0 }); };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!", { description: "Share setting applied." });
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-[100] bottom-4 left-4 sm:bottom-6 sm:left-6 flex flex-col items-start gap-4 pointer-events-none">
                {showMinimap && <MinimapOverlay />}

                <div className="bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 flex items-center gap-1 pointer-events-auto">
                    <Dialog>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                    <Button variant="default" size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 mr-1 font-bold shadow-md"><Share2 className="w-3 h-3 mr-2" /> Share</Button>
                                </DialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white text-xs">Share Workspace</TooltipContent>
                        </Tooltip>
                        <DialogContent className="bg-[#0B0F19] border-slate-700 text-slate-50">
                            <DialogHeader><DialogTitle className="text-white">Share Workspace</DialogTitle></DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-300">Access Role:</span>
                                    <select className="border border-slate-700 bg-[#0B0F19] text-white rounded p-2 text-sm outline-none w-full" value={shareSetting} onChange={(e) => setShareSetting(e.target.value)}>
                                        <option value="VIEW">Viewer</option><option value="COMMENT">Commenter</option><option value="EDIT">Editor</option>
                                    </select>
                                </div>
                                <Button onClick={copyLink} className="w-full bg-violet-600 hover:bg-violet-700 text-white">Copy Link</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                    <ToolButton icon={<MapIcon className="w-4 h-4" />} label="Toggle Minimap" onClick={() => setShowMinimap(!showMinimap)} isActive={showMinimap} size="sm" tooltipSide="top" />
                    <ToolButton icon={<ZoomOut className="w-4 h-4" />} label="Zoom Out" onClick={handleZoomOut} size="sm" tooltipSide="top" />

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-xs font-bold text-slate-300 w-12 text-center cursor-pointer hover:text-white select-none" onClick={resetView}>{Math.round(zoom * 100)}%</div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white text-xs">Reset View</TooltipContent>
                    </Tooltip>

                    <ToolButton icon={<ZoomIn className="w-4 h-4" />} label="Zoom In" onClick={handleZoomIn} size="sm" tooltipSide="top" />
                </div>
            </div>
        </TooltipProvider>
    );
}
