'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Button } from '@/shared/components/ui/button';
import { ToolButton } from '@/shared/components/ToolButton';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Download, Cloud, RefreshCcw, Lock, Unlock, Image as ImageIcon, FileImage, PenTool, FileText, Group, Ungroup, Palette, Code2, AlignStartVertical, AlignCenterVertical, AlignEndVertical, AlignStartHorizontal, AlignCenterHorizontal, AlignEndHorizontal, AlignHorizontalDistributeCenter, AlignVerticalDistributeCenter, MoreHorizontal, X, Route, Spline, Minus, History, Sparkles, Loader2, CheckCircle2, Play } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/shared/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { exportToReactCode } from '@/features/canvas/lib/exportReact';
import { exportToMermaid } from '@/features/canvas/lib/exportMermaid';
import { DropdownMenuSeparator } from '@/shared/components/ui/dropdown-menu';
import ImportMermaidModal from '@/features/canvas/components/ImportMermaidModal';
import VersionHistoryModal from '@/features/canvas/components/VersionHistoryModal';
import AiDiagramGeneratorModal from '@/features/canvas/components/AiDiagramGeneratorModal';

export default function ActionToolbar() {
    const { activeTool, setActiveTool, clear, saveToCloud, isSaving, boardId, isLocked, toggleLock, selectedLayerIds, selectedLayerId, layers, groupLayers, ungroupLayers, isSketchMode, toggleSketchMode, setExportCodeContent, alignSelectedLayers, updateLayer, saveHistory, setIsPresenting } = useCanvasStore();
    const [resetOpen, setResetOpen] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);
    const [importMermaidOpen, setImportMermaidOpen] = useState(false);
    const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
    const [aiDiagramOpen, setAiDiagramOpen] = useState(false);

    useEffect(() => {
        const handleOpenAi = () => setAiDiagramOpen(true);
        window.addEventListener('open-ai-diagram', handleOpenAi);
        return () => window.removeEventListener('open-ai-diagram', handleOpenAi);
    }, []);

    const selectedLayer = selectedLayerId ? layers.find(l => l.id === selectedLayerId) : null;
    const isGroupSelected = selectedLayer?.type === 'group';
    const canGroup = selectedLayerIds.length > 1;

    const isSelectedSketch = selectedLayerIds.length > 0
        ? layers.find(l => l.id === selectedLayerIds[0])?.isSketch ?? isSketchMode
        : isSketchMode;

    const handleSketchToggle = () => {
        if (selectedLayerIds.length > 0) {
            selectedLayerIds.forEach(id => {
                const layer = layers.find(l => l.id === id);
                if (layer) {
                    const current = layer.isSketch ?? isSketchMode;
                    updateLayer(id, { isSketch: !current });
                }
            });
            saveHistory();
        } else {
            toggleSketchMode();
        }
    };

    const handleExport = (format: 'png' | 'jpeg' | 'svg' | 'pdf') => {
        window.dispatchEvent(new CustomEvent('export-canvas', { detail: format }));
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-[100] top-4 right-4 sm:top-6 sm:right-6 bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-700 flex flex-col sm:flex-row items-end sm:items-center p-1.5 transition-all">
                
                <div className="sm:hidden flex justify-end w-full">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileExpanded(!isMobileExpanded)} className="text-slate-300 w-10 h-10">
                        {isMobileExpanded ? <X className="w-4 h-4" /> : <MoreHorizontal className="w-4 h-4" />}
                    </Button>
                </div>

                <div className={`${isMobileExpanded ? 'flex mt-2' : 'hidden'} sm:flex flex-row flex-wrap sm:flex-nowrap items-center justify-end gap-1 max-w-[140px] sm:max-w-none`}>
                    <ToolButton icon={<Palette className="w-4 h-4" />} label={isSelectedSketch ? "Disable Sketch Mode" : "Enable Sketch Mode"} onClick={handleSketchToggle} isActive={isSelectedSketch} className={isSelectedSketch ? "!bg-violet-500 !text-white" : ""} />
                
                <ToolButton icon={<MessageSquare className="w-4 h-4" />} label="Add Comment (C)" onClick={() => setActiveTool('comment')} isActive={activeTool === 'comment'} />
                <ToolButton icon={isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />} label={isLocked ? "Unlock Board" : "Lock Board"} onClick={toggleLock} isActive={isLocked} className={isLocked ? "!bg-amber-500 !text-white" : ""} />

                {(canGroup || isGroupSelected) && <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>}
                {canGroup && (
                    <>
                        <ToolButton icon={<Group className="w-4 h-4" />} label="Group (Ctrl+G)" onClick={() => groupLayers(selectedLayerIds)} />
                        <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>
                        <ToolButton icon={<AlignStartVertical className="w-4 h-4" />} label="Align Left" onClick={() => alignSelectedLayers('left')} />
                        <ToolButton icon={<AlignCenterVertical className="w-4 h-4" />} label="Align Center" onClick={() => alignSelectedLayers('center')} />
                        <ToolButton icon={<AlignEndVertical className="w-4 h-4" />} label="Align Right" onClick={() => alignSelectedLayers('right')} />
                        <div className="w-[1px] h-4 bg-slate-700 mx-0.5"></div>
                        <ToolButton icon={<AlignStartHorizontal className="w-4 h-4" />} label="Align Top" onClick={() => alignSelectedLayers('top')} />
                        <ToolButton icon={<AlignCenterHorizontal className="w-4 h-4" />} label="Align Middle" onClick={() => alignSelectedLayers('middle')} />
                        <ToolButton icon={<AlignEndHorizontal className="w-4 h-4" />} label="Align Bottom" onClick={() => alignSelectedLayers('bottom')} />
                        <div className="w-[1px] h-4 bg-slate-700 mx-0.5"></div>
                        <ToolButton icon={<AlignHorizontalDistributeCenter className="w-4 h-4" />} label="Distribute Horizontally" onClick={() => alignSelectedLayers('distribute-h')} />
                        <ToolButton icon={<AlignVerticalDistributeCenter className="w-4 h-4" />} label="Distribute Vertically" onClick={() => alignSelectedLayers('distribute-v')} />
                    </>
                )}
                {isGroupSelected && (
                    <ToolButton icon={<Ungroup className="w-4 h-4" />} label="Ungroup (Ctrl+Shift+G)" onClick={() => ungroupLayers(selectedLayerId!)} />
                )}

                {selectedLayer?.type === 'arrow' && (
                    <>
                        <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>
                        <ToolButton icon={<Route className="w-4 h-4" />} label="Orthogonal" onClick={() => { updateLayer(selectedLayerId!, { connectorStyle: 'orthogonal' }); saveHistory(); }} isActive={!selectedLayer.connectorStyle || selectedLayer.connectorStyle === 'orthogonal'} />
                        <ToolButton icon={<Spline className="w-4 h-4" />} label="Curved" onClick={() => { updateLayer(selectedLayerId!, { connectorStyle: 'curved' }); saveHistory(); }} isActive={selectedLayer.connectorStyle === 'curved'} />
                        <ToolButton icon={<Minus className="w-4 h-4" />} label="Straight" onClick={() => { updateLayer(selectedLayerId!, { connectorStyle: 'straight' }); saveHistory(); }} isActive={selectedLayer.connectorStyle === 'straight'} />
                    </>
                )}

                {selectedLayerIds.length > 0 && (
                    <>
                        <div className="w-[1px] h-8 bg-slate-700 mx-1"></div>
                        <ToolButton 
                            icon={<Code2 className="w-4 h-4" />} 
                            label="Export to React/Tailwind" 
                            onClick={() => {
                                const selected = layers.filter(l => selectedLayerIds.includes(l.id));
                                const code = exportToReactCode(selected);
                                setExportCodeContent(code);
                            }} 
                            className="!text-emerald-400 hover:!bg-emerald-500/20"
                        />
                    </>
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
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem onClick={() => {
                            const code = exportToMermaid(layers);
                            setExportCodeContent(code, 'mermaid');
                        }} className="cursor-pointer focus:bg-violet-600 focus:text-white"><Code2 className="w-4 h-4 mr-2" /> Export Mermaid (.md)</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setImportMermaidOpen(true)} className="cursor-pointer focus:bg-emerald-600 focus:text-white"><Route className="w-4 h-4 mr-2" /> Import Mermaid (.md)</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ImportMermaidModal isOpen={importMermaidOpen} onClose={() => setImportMermaidOpen(false)} />
                <VersionHistoryModal isOpen={versionHistoryOpen} onClose={() => setVersionHistoryOpen(false)} />
                <AiDiagramGeneratorModal isOpen={aiDiagramOpen} onClose={() => setAiDiagramOpen(false)} />

                <ToolButton icon={<History className="w-4 h-4" />} label="Version History" onClick={() => setVersionHistoryOpen(true)} className="hover:!bg-blue-500/20 hover:!text-blue-400" />
                <ToolButton icon={<Play className="w-4 h-4" />} label="Present Mode" onClick={() => setIsPresenting(true)} className="hover:!bg-fuchsia-500/20 hover:!text-fuchsia-400" />
                <div className="flex items-center justify-center w-10 h-10 select-none">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 opacity-50" />
                            )}
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">
                            {isSaving ? "Saving to Cloud..." : "Cloud Synced"}
                        </TooltipContent>
                    </Tooltip>
                </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
