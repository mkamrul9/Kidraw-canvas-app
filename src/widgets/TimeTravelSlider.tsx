'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Play, Pause, History } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function TimeTravelSlider() {
    const { history, historyStep, jumpToHistoryStep } = useCanvasStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Stop playing if we reach the end
    useEffect(() => {
        if (isPlaying && historyStep >= history.length - 1) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsPlaying(false);
        }
    }, [historyStep, history.length, isPlaying]);

    useEffect(() => {
        if (isPlaying) {
            playIntervalRef.current = setInterval(() => {
                const currentStep = useCanvasStore.getState().historyStep;
                const totalSteps = useCanvasStore.getState().history.length;
                if (currentStep < totalSteps - 1) {
                    jumpToHistoryStep(currentStep + 1);
                } else {
                    setIsPlaying(false);
                }
            }, 300); // 300ms per step
        } else {
            if (playIntervalRef.current) {
                clearInterval(playIntervalRef.current);
            }
        }
        return () => {
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
        };
    }, [isPlaying, jumpToHistoryStep]);

    const handlePlayPause = () => {
        // If at the end and we press play, rewind to the beginning first!
        if (!isPlaying && historyStep >= history.length - 1) {
            jumpToHistoryStep(0);
        }
        setIsPlaying(!isPlaying);
    };

    if (history.length <= 1) {
        return null; // Don't show slider if there's no history to traverse
    }

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 w-[400px]">
            <div className="bg-[#0B0F19]/90 backdrop-blur-xl border border-white/10 p-3 rounded-2xl shadow-2xl flex items-center justify-between w-full gap-4">
                <button 
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-lg"
                >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-1 fill-current" />}
                </button>
                
                <div className="flex-1 flex flex-col items-center gap-1">
                    <input 
                        type="range"
                        min={0}
                        max={history.length - 1}
                        value={historyStep}
                        onChange={(e) => {
                            setIsPlaying(false);
                            jumpToHistoryStep(parseInt(e.target.value));
                        }}
                        className="w-full accent-violet-500 h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer outline-none hover:bg-slate-700 transition-all"
                    />
                    <div className="text-[10px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                        <History className="w-3 h-3" />
                        Time Travel: Step {historyStep + 1} of {history.length}
                    </div>
                </div>
            </div>
        </div>
    );
}
