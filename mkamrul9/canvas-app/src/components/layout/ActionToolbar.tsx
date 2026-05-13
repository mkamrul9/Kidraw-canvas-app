'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MessageSquare, Download, Cloud, Trash2, Lock, Unlock, Image as ImageIcon, FileImage } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked, toggleLock } = useCanvasStore();

    const handleExport = (format: 'png' | 'jpeg' | 'svg') => {
        window.dispatchEvent(new CustomEvent('export-canvas', { detail: format }));
    };

    return (
        <div className="absolute z-50 top-6 right-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/50 flex items-center gap-1 p-1.5 transition-all">
            <Button variant={activeTool === 'comment' ? 'default' : 'ghost'} size="icon" onClick={() => setActiveTool('comment')} title="Add Comment (C)" className="w-10 h-10 rounded-lg text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                <MessageSquare className="w-4 h-4" />
            </Button>

            <Button variant={isLocked ? 'default' : 'ghost'} size="icon" onClick={toggleLock} title={isLocked ? 'Unlock Board' : 'Lock Board'} className={`w-10 h-10 rounded-lg ${isLocked ? 'bg-amber-500 hover:bg-amber-600' : 'text-slate-600'}`}>
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>

            <div className="w-[1px] h-8 bg-slate-200 mx-1"></div>

            <Button variant="ghost" size="icon" onClick={clear} disabled={isLocked} title="Clear Canvas" className="w-10 h-10 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" title="Export Board" className="w-10 h-10 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                        <Download className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => handleExport('png')} className="cursor-pointer"><ImageIcon className="w-4 h-4 mr-2" /> PNG Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('jpeg')} className="cursor-pointer"><FileImage className="w-4 h-4 mr-2" /> JPEG Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('svg')} className="cursor-pointer"><Download className="w-4 h-4 mr-2" /> SVG Vector</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => boardId && saveToCloud(boardId)} disabled={isSaving || !boardId || isLocked} title="Save to Cloud" className="w-10 h-10 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                <Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>
        </div>
    );
}