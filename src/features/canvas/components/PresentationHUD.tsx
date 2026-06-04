'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';

export default function PresentationHUD() {
    const { isPresenting, setIsPresenting, layers, setCamera, zoom, setZoom } = useCanvasStore();
    const [currentIndex, setCurrentIndex] = useState(0);

    const frames = useMemo(() => {
        return layers
            .filter(l => l.type === 'frame')
            .sort((a, b) => a.x - b.x); // Sort strictly by X coordinate (left-to-right)
    }, [layers]);

    // Keyboard navigation
    useEffect(() => {
        if (!isPresenting) return;
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsPresenting(false);
            } else if (e.key === 'ArrowRight' || e.key === 'Space') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresenting, frames, currentIndex]);

    // Auto-focus on current frame
    useEffect(() => {
        if (isPresenting && frames.length > 0) {
            const frame = frames[currentIndex];
            if (frame) {
                // Calculate scale to fit frame in viewport (with 40px padding)
                const padding = 80;
                const scaleX = (window.innerWidth - padding) / (frame.width || 100);
                const scaleY = (window.innerHeight - padding) / (frame.height || 100);
                const newZoom = Math.min(scaleX, scaleY, 2); // Max zoom 2x
                
                // Center camera on frame
                const centerX = frame.x + (frame.width || 0) / 2;
                const centerY = frame.y + (frame.height || 0) / 2;
                
                setZoom(newZoom);
                setCamera({
                    x: -centerX * newZoom + window.innerWidth / 2,
                    y: -centerY * newZoom + window.innerHeight / 2
                });
            }
        }
    }, [isPresenting, currentIndex, frames, setCamera, setZoom]);

    const handleNext = () => {
        if (frames.length === 0) return;
        setCurrentIndex(prev => Math.min(prev + 1, frames.length - 1));
    };

    const handlePrev = () => {
        if (frames.length === 0) return;
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    if (!isPresenting) return null;

    if (frames.length === 0) {
        return (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#0B0F19]/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl flex items-center p-4">
                <span className="text-slate-300 font-medium">No frames found to present. Draw a Frame first.</span>
                <Button variant="ghost" onClick={() => setIsPresenting(false)} className="ml-4 text-violet-400 hover:bg-violet-500/20">Exit</Button>
            </div>
        );
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[200] bg-[#0B0F19]/95 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl flex items-center p-2 gap-2 transition-all">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white">Previous (Left Arrow)</TooltipContent>
                </Tooltip>

                <div className="flex flex-col items-center justify-center px-4 min-w-[120px]">
                    <span className="text-sm font-bold text-white tracking-wide">
                        {currentIndex + 1} <span className="text-slate-500">/</span> {frames.length}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider truncate max-w-[100px]">
                        {frames[currentIndex]?.text || 'Frame'}
                    </span>
                </div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                            disabled={currentIndex === frames.length - 1}
                            className="rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white">Next (Right Arrow)</TooltipContent>
                </Tooltip>

                <div className="w-px h-8 bg-slate-700 mx-2" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsPresenting(false)}
                            className="rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-slate-900 border-slate-700 text-white">Exit Presentation (Esc)</TooltipContent>
                </Tooltip>
            </div>
        </TooltipProvider>
    );
}
