'use client';

import { useState } from 'react';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { ToolButton } from '@/shared/components/ToolButton';
import { Sparkles, Bot } from 'lucide-react';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

export default function AiToolbar() {
    const { selectedLayerIds } = useCanvasStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full flex justify-center mt-2 pt-2 border-t border-slate-700">
            <ToolButton 
                icon={<Bot className="w-5 h-5 text-indigo-400" />} 
                label="AI Tools" 
                onClick={() => setIsOpen(!isOpen)} 
                className="hover:!bg-indigo-500/20" 
                tooltipSide="left"
                isActive={isOpen}
            />

            {isOpen && (
                <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 flex flex-col gap-1 w-52 z-50">
                        <button 
                            onClick={() => { window.dispatchEvent(new Event('ai-clean-sketch')); setIsOpen(false); }} 
                            disabled={selectedLayerIds.length === 0} 
                            className="flex items-center gap-2 hover:bg-amber-500/10 w-full justify-start px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                        >
                            <Sparkles className="w-4 h-4 text-amber-400" />
                            <span>AI Clean Sketch</span>
                        </button>
                        <div className="h-[1px] w-full bg-slate-700/50 my-0.5"></div>
                        <button 
                            onClick={() => { window.dispatchEvent(new Event('open-ai-diagram')); setIsOpen(false); }} 
                            className="flex items-center gap-2 hover:bg-purple-500/10 w-full justify-start px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-purple-400 transition-colors" 
                        >
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span>AI Text to Diagram</span>
                        </button>
                        <div className="h-[1px] w-full bg-slate-700/50 my-0.5"></div>
                        <button 
                            onClick={() => { window.dispatchEvent(new Event('trigger-ai-explainer')); setIsOpen(false); }} 
                            className="flex items-center gap-2 hover:bg-emerald-500/10 w-full justify-start px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors" 
                        >
                            <Bot className="w-4 h-4 text-emerald-400" />
                            <span>Explain with AI</span>
                        </button>
                    </div>
                )}
            </div>
    );
}
