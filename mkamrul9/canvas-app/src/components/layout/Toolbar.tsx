'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MousePointer2, Square, Circle, Pen } from 'lucide-react';
import { Tool } from '../../types/canvas';

export default function Toolbar() {
    const { activeTool, setActiveTool } = useCanvasStore();

    const tools: { id: Tool; icon: React.ReactNode; label: string }[] = [
        { id: 'select', icon: <MousePointer2 className="w-4 h-4" />, label: 'Select' },
        { id: 'rectangle', icon: <Square className="w-4 h-4" />, label: 'Rectangle' },
        { id: 'ellipse', icon: <Circle className="w-4 h-4" />, label: 'Ellipse' },
        { id: 'pen', icon: <Pen className="w-4 h-4" />, label: 'Draw' },
    ];

    return (
        <div className="absolute z-50 top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-md border border-slate-200 flex gap-1 p-1">
            {tools.map((tool) => (
                <Button
                    key={tool.id}
                    variant={activeTool === tool.id ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setActiveTool(tool.id)}
                    title={tool.label}
                    className="w-10 h-10 rounded-lg"
                >
                    {tool.icon}
                </Button>
            ))}
        </div>
    );
}