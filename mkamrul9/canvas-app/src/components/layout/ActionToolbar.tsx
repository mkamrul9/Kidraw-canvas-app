'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Button } from '@/components/ui/button';
import { MessageSquare, Download, Cloud, Trash2, Lock, Unlock, Image as ImageIcon, FileImage, Route } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked, toggleLock } = useCanvasStore();

    const handleExport = (format: 'png' | 'jpeg' | 'svg') => {
        window.dispatchEvent(new CustomEvent('export-canvas', { detail: format }));
    };

    return (
        <div className="absolute z-50 top-6 right-6 bg-[#0B0F19]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1 p-1.5 transition-all">

            {/* Note the updated hover colors to text-white and bg-white/10 */}
            <Button variant={activeTool === 'comment' ? 'default' : 'ghost'} size="icon" onClick={() => setActiveTool('comment')} title="Add Comment (C)" className={`w-10 h-10 rounded-lg ${activeTool === 'comment' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                <MessageSquare className="w-4 h-4" />
            </Button>

            <Button variant={isLocked ? 'default' : 'ghost'} size="icon" onClick={toggleLock} title={isLocked ? "Unlock Board" : "Lock Board"} className={`w-10 h-10 rounded-lg ${isLocked ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-slate-400 hover:text-white hover:bg-white/10'}`}>
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>

            <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

            <Button variant="ghost" size="icon" onClick={() => { if (window.confirm("Are you sure you want to clear the entire board?")) clear(); }} disabled={isLocked} title="Clear Canvas" className="w-10 h-10 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4" />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" title="Export Board" className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
                        <Download className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-[#0B0F19] border-white/10 text-slate-300">
                    <DropdownMenuItem onClick={() => handleExport('png')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><ImageIcon className="w-4 h-4 mr-2" /> PNG Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('jpeg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><FileImage className="w-4 h-4 mr-2" /> JPEG Image</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport('svg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><Route className="w-4 h-4 mr-2" /> SVG Vector</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => boardId && saveToCloud(boardId)} disabled={isSaving || !boardId || isLocked} title="Save to Cloud" className="w-10 h-10 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-violet-500/10">
                <Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
            </Button>
        </div>
    );
}