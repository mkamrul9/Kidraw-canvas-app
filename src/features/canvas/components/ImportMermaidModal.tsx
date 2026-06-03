'use client';

import { useState } from 'react';
import { X, Code2 } from 'lucide-react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { importMermaid } from '@/features/canvas/utils/importMermaid';

interface ImportMermaidModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ImportMermaidModal({ isOpen, onClose }: ImportMermaidModalProps) {
    const { addLayer, saveHistory } = useCanvasStore();
    const [code, setCode] = useState('graph TD\n  A[Start] --> B{Decision}\n  B --> C[Option 1]\n  B --> D[Option 2]');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleImport = () => {
        try {
            setError('');
            const layers = importMermaid(code);
            if (layers.length === 0) {
                setError('No valid nodes or edges found in Mermaid code.');
                return;
            }
            
            // Add layers one by one to broadcast to remote clients
            for (const layer of layers) {
                addLayer(layer);
            }
            saveHistory();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to parse Mermaid code.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-950 border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-500/20 rounded-lg">
                            <Code2 className="w-5 h-5 text-violet-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Import Mermaid.js</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <p className="text-sm text-slate-400">
                        Paste your Mermaid flowchart code below. We currently support basic <code>graph TD</code> and <code>graph LR</code> layouts with standard nodes and connections.
                    </p>
                    
                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="graph TD..."
                        className="w-full h-64 bg-zinc-900 border border-white/10 rounded-xl p-4 text-sm text-emerald-400 font-mono focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 resize-none whitespace-pre"
                        spellCheck={false}
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 bg-zinc-900/50 border-t border-white/10 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-4 py-2 text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 active:scale-95 rounded-lg transition-all"
                    >
                        Generate Diagram
                    </button>
                </div>
            </div>
        </div>
    );
}
