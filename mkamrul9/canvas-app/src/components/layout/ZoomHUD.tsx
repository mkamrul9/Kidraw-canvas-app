'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { ZoomIn, ZoomOut, Maximize, Share2, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function ZoomHUD() {
    const { zoom, setZoom, setCamera, layers, camera } = useCanvasStore();
    const [showMinimap, setShowMinimap] = useState(false);
    const [shareSetting, setShareSetting] = useState('VIEW');
    const [isDraggingMap, setIsDraggingMap] = useState(false);
    const mapRef = useRef<HTMLDivElement>(null);

    const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
    const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));
    const resetView = () => { setZoom(1); setCamera({ x: 0, y: 0 }); };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied!', { description: 'Anyone with the link can view/edit based on your settings.' });
    };

    const navigateMinimap = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!mapRef.current) return;
        const rect = mapRef.current.getBoundingClientRect();
        const pctX = (e.clientX - rect.left) / rect.width;
        const pctY = (e.clientY - rect.top) / rect.height;

        setCamera({
            x: -(pctX - 0.5) * 10000,
            y: -(pctY - 0.5) * 10000
        });
    };

    return (
        <div className="absolute z-50 bottom-6 left-6 flex flex-col gap-2">
            {showMinimap && (
                <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 p-2 w-56 h-36 relative overflow-hidden select-none">
                    <div className="text-[10px] font-bold text-slate-400 absolute top-2 left-2 z-10 pointer-events-none">MINIMAP</div>

                    <div
                        ref={mapRef}
                        className="absolute inset-0 m-4 border border-slate-200 bg-slate-50 overflow-hidden rounded cursor-crosshair touch-none"
                        onPointerDown={(e) => { setIsDraggingMap(true); navigateMinimap(e); e.currentTarget.setPointerCapture(e.pointerId); }}
                        onPointerMove={(e) => { if (isDraggingMap) navigateMinimap(e); }}
                        onPointerUp={(e) => { setIsDraggingMap(false); e.currentTarget.releasePointerCapture(e.pointerId); }}
                    >
                        {layers.map(layer => (
                            <div
                                key={layer.id}
                                className="absolute bg-indigo-500/40 rounded-sm pointer-events-none"
                                style={{ left: `${(layer.x / 10000) * 100 + 50}%`, top: `${(layer.y / 10000) * 100 + 50}%`, width: '4px', height: '4px' }}
                            />
                        ))}
                        <div
                            className="absolute border-2 border-red-500/70 bg-red-500/10 rounded pointer-events-none"
                            style={{
                                left: `${(-camera.x / 10000) * 100 + 50}%`,
                                top: `${(-camera.y / 10000) * 100 + 50}%`,
                                width: `${(window.innerWidth / 10000) * 100 / zoom}%`,
                                height: `${(window.innerHeight / 10000) * 100 / zoom}%`,
                                transform: 'translate(-50%, -50%)'
                            }}
                        />
                    </div>
                </div>
            )}

            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 p-2 flex items-center gap-1">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-xs px-2 mr-1"><Share2 className="w-3 h-3 mr-1" /> Share</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Share this Whiteboard</DialogTitle></DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Link Access:</span>
                                <select className="border rounded p-1 text-sm outline-none" value={shareSetting} onChange={(e) => setShareSetting(e.target.value)}>
                                    <option value="VIEW">Can View</option>
                                    <option value="COMMENT">Can Comment</option>
                                    <option value="EDIT">Can Edit</option>
                                </select>
                            </div>
                            <Button onClick={copyLink} className="w-full">Copy Link</Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>
                <Button variant={showMinimap ? 'default' : 'ghost'} size="icon" onClick={() => setShowMinimap(!showMinimap)} className="h-8 w-8"><MapIcon className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 text-slate-600"><ZoomOut className="w-4 h-4" /></Button>
                <div className="text-xs font-semibold text-slate-700 w-12 text-center cursor-pointer hover:text-indigo-600 select-none" onClick={resetView}>{Math.round(zoom * 100)}%</div>
                <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 text-slate-600"><ZoomIn className="w-4 h-4" /></Button>
            </div>
        </div>
    );
}