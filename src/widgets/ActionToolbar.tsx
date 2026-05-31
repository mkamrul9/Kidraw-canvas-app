'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Button } from '@/shared/components/ui/button';
import { ToolButton } from '@/shared/components/ToolButton';
import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Download, Cloud, RefreshCcw, Lock, Unlock, Image as ImageIcon, FileImage, PenTool, FileText, Group, Ungroup, Palette } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked, toggleLock, selectedLayerIds, selectedLayerId, layers, groupLayers, ungroupLayers, isSketchMode, toggleSketchMode } = useCanvasStore();
    const [resetOpen, setResetOpen] = useState(false);

    const selectedLayer = selectedLayerId ? layers.find(l => l.id === selectedLayerId) : null;
    const isGroupSelected = selectedLayer?.type === 'group';
    const canGroup = selectedLayerIds.length > 1;

    const handleExport = (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
        window.dispatchEvent(new CustomEvent('export-canvas', { detail: format }));
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 top-6 right-6 bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-1 p-1.5 transition-all">
                <ToolButton icon={<Palette className="w-4 h-4" />} label={isSketchMode ? "Disable Sketch Mode" : "Enable Sketch Mode"} onClick={toggleSketchMode} isActive={isSketchMode} className={isSketchMode ? "!bg-violet-500 !text-white" : ""} />
                
                <ToolButton icon={<MessageSquare className="w-4 h-4" />} label="Add Comment (C)" onClick={() => setActiveTool('comment')} isActive={activeTool === 'comment'} />
                <ToolButton icon={isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} label={isLocked ? "Unlock Board" : "Lock Board"} onClick={toggleLock} isActive={isLocked} className={isLocked ? "!bg-amber-500 !text-white" : ""} />

                {(canGroup || isGroupSelected) && <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>}
                {canGroup && (
                    <ToolButton icon={<Group className="w-4 h-4" />} label="Group (Ctrl+G)" onClick={() => groupLayers(selectedLayerIds)} />
                )}
                {isGroupSelected && (
                    <ToolButton icon={<Ungroup className="w-4 h-4" />} label="Ungroup (Ctrl+Shift+G)" onClick={() => ungroupLayers(selectedLayerId!)} />
                )}

                <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>

                {/* CUSTOM RESET DIALOG */}
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                    <Tooltip><TooltipTrigger asChild><DialogTrigger asChild>
                        <Button variant="ghost" size="icon" disabled={isLocked} className="w-10 h-10 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"><RefreshCcw className="w-4 h-4" /></Button>
                    </DialogTrigger></TooltipTrigger><TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Reset Board</TooltipContent></Tooltip>

                    <DialogContent className="bg-[#0B0F19] border border-white/10 text-slate-50 sm:max-w-[450px] shadow-[0_0_100px_rgba(239,68,68,0.15)] rounded-2xl p-0 overflow-hidden">
                        <DialogHeader className="px-6 pt-6 mb-2">
                            <DialogTitle className="text-2xl font-bold text-white">Reset Workspace?</DialogTitle>
                            <DialogDescription className="text-slate-400">This will permanently clear all shapes, images, and text from the canvas. This action cannot be undone.</DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="px-6 py-4 border-t border-white/5 bg-[#05070B] flex gap-2 sm:justify-end">
                            <Button variant="ghost" onClick={() => setResetOpen(false)} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">Cancel</Button>
                            <Button onClick={() => { clear(); setResetOpen(false); toast.success("Workspace reset."); }} className="bg-red-600 text-white hover:bg-red-700 rounded-xl font-bold">Yes, Reset Canvas</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-10 h-10 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"><Download className="w-4 h-4" /></Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Export Board</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="end" className="w-44 bg-[#0B0F19] border-slate-700 text-slate-300">
                        <DropdownMenuItem onClick={() => handleExport('png')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><ImageIcon className="w-4 h-4 mr-2" /> PNG Image</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('jpeg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><FileImage className="w-4 h-4 mr-2" /> JPEG Image</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('svg')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><PenTool className="w-4 h-4 mr-2" /> SVG Vector</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('pdf')} className="cursor-pointer focus:bg-violet-600 focus:text-white"><FileText className="w-4 h-4 mr-2" /> PDF Document</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ToolButton icon={<Cloud className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />} label={isSaving ? "Saving..." : "Save to Cloud"} onClick={() => boardId && saveToCloud(boardId)} className="hover:!text-blue-400 hover:!bg-blue-500/10" />
            </div>
        </TooltipProvider>
    );
}
