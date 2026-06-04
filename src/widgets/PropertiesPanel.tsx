'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Plus, Blend, Grid, ChevronsUp, ChevronsDown, ChevronUp, ChevronDown, Layers, Palette, X, Wand2, Minus, MoreHorizontal, Type } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { ToolButton } from '@/shared/components/ToolButton';
import { DEFAULT_COLORS } from '@/shared/constants';
import AiToolbar from './AiToolbar';

export default function PropertiesPanel() {
    const { activeColor, setActiveColor, bgPattern, setBgPattern, backgroundColor, setBackgroundColor, customColors, addCustomColor, activeOpacity, setOpacity, selectedLayerId, updateLayer, saveHistory, bringToFront, sendToBack, bringForward, sendBackward, activeRoughness, setActiveRoughness, activeBowing, setActiveBowing, isSketchMode, layers, selectedLayerIds, activeDashPattern, setActiveDashPattern, activeFontFamily, setActiveFontFamily, isReadOnly } = useCanvasStore();

    const [activeMenu, setActiveMenu] = useState<'opacity' | 'bg' | 'arrange' | 'sketch' | 'stroke' | 'font' | null>(null);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const op = parseFloat(e.target.value);
        setOpacity(op);
        if (selectedLayerIds.length > 0) {
            selectedLayerIds.forEach(id => updateLayer(id, { opacity: op }));
            saveHistory();
        }
    };

    const handleRoughnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setActiveRoughness(val);
        if (selectedLayerIds.length > 0) {
            selectedLayerIds.forEach(id => updateLayer(id, { roughness: val }));
            saveHistory();
        }
    };

    const handleBowingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setActiveBowing(val);
        if (selectedLayerIds.length > 0) {
            selectedLayerIds.forEach(id => updateLayer(id, { bowing: val }));
            saveHistory();
        }
    };

    const isSelectedSketch = selectedLayerIds.length > 0 
        ? layers.find(l => l.id === selectedLayerIds[0])?.isSketch ?? isSketchMode 
        : isSketchMode;

    if (isReadOnly) return null;

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 right-4 sm:right-6 top-1/2 -translate-y-1/2 bg-[#0B0F19] rounded-2xl shadow-2xl border border-slate-700 w-14 flex flex-col items-center py-2 sm:py-3 gap-2 transition-all">
                
                <div className="sm:hidden w-full flex justify-center">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileExpanded(!isMobileExpanded)} className="text-slate-300 w-10 h-10">
                        {isMobileExpanded ? <X className="w-5 h-5" /> : <Palette className="w-5 h-5" />}
                    </Button>
                </div>

                <div className={`${isMobileExpanded ? 'flex' : 'hidden'} sm:flex flex-col items-center gap-2 w-full pb-2 sm:pb-0`}>
                    <div className="relative w-full flex justify-center">
                    <ToolButton icon={<Blend className="w-4 h-4" />} label="Opacity Settings" onClick={() => setActiveMenu(activeMenu === 'opacity' ? null : 'opacity')} isActive={activeMenu === 'opacity'} tooltipSide="left" tooltipClassName="mr-2" />
                    {activeMenu === 'opacity' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-56 flex flex-col gap-4 z-50">
                            <div className="flex justify-between items-center text-sm font-bold text-white border-b border-slate-800 pb-2">
                                <span>Opacity</span>
                                <span className="text-violet-400">{Math.round(activeOpacity * 100)}%</span>
                            </div>
                            <input type="range" min="0.1" max="1" step="0.05" value={activeOpacity} onChange={handleOpacityChange} className="w-full cursor-pointer accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none" />
                        </div>
                    )}
                </div>

                {selectedLayerId && (
                    <div className="relative w-full flex justify-center">
                        <ToolButton icon={<Layers className="w-4 h-4" />} label="Arrange Layer" onClick={() => setActiveMenu(activeMenu === 'arrange' ? null : 'arrange')} isActive={activeMenu === 'arrange'} tooltipSide="left" tooltipClassName="mr-2" />
                        {activeMenu === 'arrange' && (
                            <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-2 flex flex-col gap-1 w-40 z-50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">Layer Order</span>
                                <Button variant="ghost" size="sm" onClick={() => bringToFront(selectedLayerId)} className="justify-start text-xs text-slate-300 hover:text-white hover:bg-slate-800"><ChevronsUp className="w-4 h-4 mr-2" /> Bring to Front</Button>
                                <Button variant="ghost" size="sm" onClick={() => bringForward(selectedLayerId)} className="justify-start text-xs text-slate-300 hover:text-white hover:bg-slate-800"><ChevronUp className="w-4 h-4 mr-2" /> Bring Forward</Button>
                                <Button variant="ghost" size="sm" onClick={() => sendBackward(selectedLayerId)} className="justify-start text-xs text-slate-300 hover:text-white hover:bg-slate-800"><ChevronDown className="w-4 h-4 mr-2" /> Send Backward</Button>
                                <Button variant="ghost" size="sm" onClick={() => sendToBack(selectedLayerId)} className="justify-start text-xs text-slate-300 hover:text-white hover:bg-slate-800"><ChevronsDown className="w-4 h-4 mr-2" /> Send to Back</Button>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative w-full flex justify-center">
                    <ToolButton icon={<Minus className="w-4 h-4" />} label="Stroke Style" onClick={() => setActiveMenu(activeMenu === 'stroke' ? null : 'stroke')} isActive={activeMenu === 'stroke'} tooltipSide="left" tooltipClassName="mr-2" />
                    {activeMenu === 'stroke' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-60 flex flex-col gap-2 z-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stroke Dash</span>
                            <div className="flex bg-[#05070B] p-1 rounded-lg border border-slate-800">
                                <button onClick={() => setActiveDashPattern([])} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${activeDashPattern.length === 0 ? 'bg-violet-600 shadow-md text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                                    <Minus className="w-4 h-4" />
                                </button>
                                <button onClick={() => setActiveDashPattern([15, 10])} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${activeDashPattern[0] === 15 ? 'bg-violet-600 shadow-md text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                                    <Minus className="w-4 h-4 opacity-75" />
                                </button>
                                <button onClick={() => setActiveDashPattern([5, 5])} className={`flex-1 py-1.5 flex items-center justify-center rounded-md transition-all ${activeDashPattern[0] === 5 ? 'bg-violet-600 shadow-md text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative w-full flex justify-center">
                    <ToolButton icon={<Type className="w-4 h-4" />} label="Typography" onClick={() => setActiveMenu(activeMenu === 'font' ? null : 'font')} isActive={activeMenu === 'font'} tooltipSide="left" tooltipClassName="mr-2" />
                    {activeMenu === 'font' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-60 flex flex-col gap-2 z-50">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Font Family</span>
                            <div className="flex flex-col gap-1 mt-1">
                                {[
                                    { name: 'Sans Serif', value: 'sans-serif', preview: 'sans-serif' },
                                    { name: 'Serif', value: 'serif', preview: 'serif' },
                                    { name: 'Monospace', value: 'monospace', preview: 'monospace' },
                                    { name: 'Handwritten', value: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', cursive", preview: "'Comic Sans MS', cursive" }
                                ].map((font) => (
                                    <button 
                                        key={font.name}
                                        onClick={() => setActiveFontFamily(font.value)} 
                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${activeFontFamily === font.value ? 'bg-violet-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                                        style={{ fontFamily: font.preview }}
                                    >
                                        {font.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {(isSelectedSketch || isSketchMode) && (
                    <div className="relative w-full flex justify-center">
                        <ToolButton icon={<Wand2 className="w-4 h-4" />} label="Sketch Settings" onClick={() => setActiveMenu(activeMenu === 'sketch' ? null : 'sketch')} isActive={activeMenu === 'sketch'} tooltipSide="left" tooltipClassName="mr-2" />
                        {activeMenu === 'sketch' && (
                            <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-56 flex flex-col gap-4 z-50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sketch Parameters</span>
                                
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-xs text-slate-300">
                                        <span>Roughness</span>
                                        <span className="text-violet-400 font-mono">{activeRoughness.toFixed(1)}</span>
                                    </div>
                                    <input type="range" min="0" max="5" step="0.1" value={activeRoughness} onChange={handleRoughnessChange} className="w-full cursor-pointer accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none" />
                                </div>

                                <div className="flex flex-col gap-2 mt-2">
                                    <div className="flex justify-between items-center text-xs text-slate-300">
                                        <span>Bowing</span>
                                        <span className="text-violet-400 font-mono">{activeBowing.toFixed(1)}</span>
                                    </div>
                                    <input type="range" min="0" max="5" step="0.1" value={activeBowing} onChange={handleBowingChange} className="w-full cursor-pointer accent-violet-500 h-2 bg-slate-800 rounded-lg appearance-none" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="relative w-full flex justify-center">
                    <ToolButton icon={<Grid className="w-4 h-4" />} label="Background Settings" onClick={() => setActiveMenu(activeMenu === 'bg' ? null : 'bg')} isActive={activeMenu === 'bg'} tooltipSide="left" tooltipClassName="mr-2" />
                    {activeMenu === 'bg' && (
                        <div className="absolute right-16 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-slate-700 p-4 w-60 flex flex-col gap-4 z-50">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canvas Pattern</span>
                            <div className="flex bg-[#05070B] p-1 rounded-lg border border-slate-800">
                                {['solid', 'dotted', 'grid'].map((pat) => (
                                    <button key={pat} onClick={() => setBgPattern(pat as 'solid' | 'dotted' | 'grid')} className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${bgPattern === pat ? 'bg-violet-600 shadow-md text-white' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}>
                                        {pat}
                                    </button>
                                ))}
                            </div>

                            <div className="h-[1px] bg-slate-800 w-full"></div>

                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Canvas Color</span>
                            <label className="w-full h-10 rounded-lg border-2 border-slate-700 cursor-pointer overflow-hidden relative shadow-inner hover:border-violet-500 transition-colors">
                                <div className="absolute inset-0" style={{ backgroundColor }}></div>
                                <input type="color" value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => setBackgroundColor(e.target.value)} />
                            </label>
                        </div>
                    )}
                </div>

                <div className="w-8 h-[1px] bg-slate-700 my-1"></div>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <label className="relative w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                            <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)] opacity-90"></div>
                            <div className="absolute inset-[3px] bg-[#0B0F19] rounded-full flex items-center justify-center"><Plus className="w-3 h-3 text-white" /></div>
                            <input type="color" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onInput={(e) => setActiveColor((e.target as HTMLInputElement).value)} onBlur={(e) => addCustomColor((e.target as HTMLInputElement).value)} />
                        </label>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-slate-900 border-slate-700 text-white text-xs mr-2">Custom Color</TooltipContent>
                </Tooltip>

                <div className="flex flex-col gap-2 mt-2">
                    {[...customColors, ...DEFAULT_COLORS].slice(0, 6).map((color, index) => (
                        <button key={`${color}-${index}`} onClick={() => setActiveColor(color)} className={`w-6 h-6 rounded-full border-2 transition-all shadow-md ${activeColor === color ? 'border-violet-500 scale-125' : 'border-slate-700 hover:scale-110'}`} style={{ backgroundColor: color }} />
                    ))}
                </div>

                <AiToolbar />
                </div>
            </div>
        </TooltipProvider>
    );
}
