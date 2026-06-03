'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Sparkles, X, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { Layer } from '@/features/canvas/types';

interface AiDiagramGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AiDiagramGeneratorModal({ isOpen, onClose }: AiDiagramGeneratorModalProps) {
    const { addLayers, camera, zoom } = useCanvasStore();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        
        setIsGenerating(true);
        toast.loading("AI is thinking...", { id: 'ai-gen' });

        try {
            const res = await fetch('/api/ai/generate-diagram', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await res.json();

            if (res.ok && data.layers) {
                // Determine center of screen in canvas coordinates
                const screenCenterX = window.innerWidth / 2;
                const screenCenterY = window.innerHeight / 2;
                const canvasCenterX = (screenCenterX - camera.x) / zoom;
                const canvasCenterY = (screenCenterY - camera.y) / zoom;

                const newLayers = data.layers.map((l: any) => ({
                    ...l,
                    id: l.id || uuidv4(),
                    x: l.x + canvasCenterX,
                    y: l.y + canvasCenterY,
                })) as Layer[];

                addLayers(newLayers);
                toast.success("Diagram generated!", { id: 'ai-gen' });
                setPrompt('');
                onClose();
            } else {
                toast.error(data.error || "Failed to generate.", { id: 'ai-gen' });
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred.", { id: 'ai-gen' });
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="w-full max-w-lg bg-[#0B0F19] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">Text to Diagram</h2>
                            <p className="text-xs text-slate-400">Powered by Gemini AI</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Describe a flow, architecture, or ERD... (e.g. 'Payment processing microservices architecture')"
                        className="w-full h-32 px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 resize-none"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleGenerate();
                            }
                        }}
                    />

                    <div className="flex justify-end gap-2 mt-2">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleGenerate}
                            disabled={!prompt.trim() || isGenerating}
                            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white text-sm font-bold rounded-xl flex items-center transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                            Generate
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
