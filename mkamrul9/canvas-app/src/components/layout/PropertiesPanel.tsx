'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Plus, Blend, Grid } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const DEFAULT_COLORS = ['#0f172a', '#64748b', '#e11d48', '#d97706', '#059669', '#4f46e5', '#7c3aed', '#ffffff'];

export default function PropertiesPanel() {
    const { activeColor, setActiveColor, bgPattern, setBgPattern, backgroundColor, setBackgroundColor, customColors, addCustomColor, activeOpacity, setOpacity, selectedLayerId, updateLayer, saveHistory } = useCanvasStore();

    const [activeMenu, setActiveMenu] = useState<'opacity' | 'bg' | null>(null);

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const op = parseFloat(e.target.value);
        setOpacity(op);
        if (selectedLayerId) { updateLayer(selectedLayerId, { opacity: op }); saveHistory(); }
    };

    return (
        <div className="absolute z-50 right-6 top-1/2 -translate-y-1/2 bg-[#0B0F19]/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 w-14 flex flex-col items-center py-3 gap-2 transition-all">
            <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setActiveMenu(activeMenu === 'opacity' ? null : 'opacity')} title="Opacity" className={`w-10 h-10 rounded-lg ${activeMenu === 'opacity' ? 'bg-slate-100' : ''}`}>
                    <Blend className="w-4 h-4 text-slate-600" />
                </Button>
                {activeMenu === 'opacity' && (
                    <div className="absolute right-14 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-3 w-48 flex flex-col gap-2">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                            <span>Opacity</span>
                            <span>{Math.round(activeOpacity * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0.1"
                            max="1"
                            step="0.05"
                            value={activeOpacity}
                            onChange={handleOpacityChange}
                            className="w-full cursor-pointer accent-indigo-500"
                        />
                    </div>
                )}
            </div>

            <div className="relative">
                <Button variant="ghost" size="icon" onClick={() => setActiveMenu(activeMenu === 'bg' ? null : 'bg')} title="Background Settings" className={`w-10 h-10 rounded-lg ${activeMenu === 'bg' ? 'bg-slate-100' : ''}`}>
                    <Grid className="w-4 h-4 text-slate-600" />
                </Button>
                {activeMenu === 'bg' && (
                    <div className="absolute right-14 top-0 bg-[#0B0F19] rounded-xl shadow-2xl border border-white/10 p-3 w-40 flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pattern</span>
                        <div className="flex bg-white/5 p-1 rounded-lg">
                            {['solid', 'dotted', 'grid'].map((pat) => (
                                <button
                                    key={pat}
                                    onClick={() => setBgPattern(pat as 'solid' | 'dotted' | 'grid')}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded capitalize transition-all ${bgPattern === pat ? 'bg-violet-600 shadow-sm text-white' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {pat}
                                </button>
                            ))}
                        </div>

                        <div className="h-[1px] bg-white/10"></div>

                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Canvas Color</span>
                        <label className="w-full h-8 rounded-md border border-slate-300 cursor-pointer overflow-hidden relative shadow-sm hover:border-indigo-400 transition-colors">
                            <div className="absolute inset-0" style={{ backgroundColor }}></div>
                            <input type="color" value={backgroundColor === 'transparent' ? '#ffffff' : backgroundColor} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => setBackgroundColor(e.target.value)} />
                        </label>
                    </div>
                )}
            </div>

            <div className="w-8 h-[1px] bg-white/10 my-1"></div>

            <label className="relative w-8 h-8 rounded-full cursor-pointer flex items-center justify-center shadow-sm hover:scale-105 transition-transform" title="Custom Color">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)] opacity-80"></div>
                <div className="absolute inset-[2px] bg-white rounded-full flex items-center justify-center"><Plus className="w-3 h-3 text-slate-600" /></div>
                <input type="color" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onInput={(e) => setActiveColor((e.target as HTMLInputElement).value)} onBlur={(e) => addCustomColor((e.target as HTMLInputElement).value)} />
            </label>

            <div className="flex flex-col gap-1.5 mt-1">
                {[...customColors, ...DEFAULT_COLORS].slice(0, 6).map((color, index) => (
                    <button key={`${color}-${index}`} onClick={() => setActiveColor(color)} className={`w-6 h-6 rounded-full border-2 transition-all shadow-sm ${activeColor === color ? 'border-indigo-500 scale-125' : 'border-slate-100 hover:scale-110'}`} style={{ backgroundColor: color }} />
                ))}
            </div>
        </div>
    );
}