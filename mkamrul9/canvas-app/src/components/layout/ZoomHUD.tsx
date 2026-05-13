'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ZoomHUD() {
    const { zoom, setZoom, setCamera } = useCanvasStore();

    const handleZoomIn = () => setZoom(Math.min(zoom * 1.2, 5));
    const handleZoomOut = () => setZoom(Math.max(zoom / 1.2, 0.1));
    const resetView = () => {
        setZoom(1);
        setCamera({ x: 0, y: 0 });
    };

    return (
        <div className="absolute z-50 bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 p-2 flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <ZoomOut className="w-4 h-4" />
            </Button>

            <div
                className="text-xs font-semibold text-slate-700 w-12 text-center cursor-pointer hover:text-indigo-600 select-none"
                onClick={resetView}
                title="Reset to 100%"
            >
                {Math.round(zoom * 100)}%
            </div>

            <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <ZoomIn className="w-4 h-4" />
            </Button>

            <div className="w-[1px] h-6 bg-slate-200 mx-1"></div>

            <Button variant="ghost" size="icon" onClick={resetView} title="Center View" className="h-8 w-8 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                <Maximize className="w-4 h-4" />
            </Button>
        </div>
    );
}