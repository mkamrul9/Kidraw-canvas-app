'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MessageSquare, Download, Cloud, Trash2 } from 'lucide-react';

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked } = useCanvasStore();

    return (
        <div className="absolute z-50 top-6 right-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center gap-1 p-1.5 transition-all">

            {/* COMMENT TOOL */}
            <Button
                variant={activeTool === 'comment' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setActiveTool('comment')}
                title="Add Comment (C)"
                className="w-10 h-10 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
                <MessageSquare className="w-4 h-4" />
            </Button>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>

            {/* CLEAR CANVAS (Softened Styling) */}
            <Button
                variant="ghost"
                size="icon"
                onClick={clear}
                disabled={isLocked}
                title="Clear Canvas"
                className="w-10 h-10 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            {/* DOWNLOAD */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => window.dispatchEvent(new Event('export-canvas'))}
                title="Download as PNG"
                className="w-10 h-10 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
                <Download className="w-4 h-4" />
            </Button>

            {/* CLOUD SAVE */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => boardId && saveToCloud(boardId)}
                disabled={isSaving || !boardId || isLocked}
                title="Save to Cloud"
                className="w-10 h-10 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
                <Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>
        </div>
    );
}