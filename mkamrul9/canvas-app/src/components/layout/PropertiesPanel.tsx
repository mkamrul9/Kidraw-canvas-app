'use client';

import { useCanvasStore } from '../../store/useCanvasStore';
import { Plus } from 'lucide-react';

const DEFAULT_COLORS = ['#0f172a', '#64748b', '#e11d48', '#d97706', '#059669', '#4f46e5', '#7c3aed', '#ffffff'];
const OPACITIES = [0.25, 0.5, 0.75, 1];

export default function PropertiesPanel() {
    const { activeColor, setActiveColor, bgPattern, setBgPattern, backgroundColor, setBackgroundColor, customColors, addCustomColor, activeOpacity, setOpacity, selectedLayerId, updateLayer, saveHistory } = useCanvasStore();

    const handleOpacityChange = (op: number) => {
        setOpacity(op);
        if (selectedLayerId) { updateLayer(selectedLayerId, { opacity: op }); saveHistory(); }
    };

    return (
        <div className="absolute z-50 right-6 top-[40%] bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 w-16 flex flex-col items-center py-4 gap-3 transition-all">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Opacity</span>
            <div className="flex flex-col gap-1 w-full px-2">
                {OPACITIES.map((op) => (
                    <button key={op} onClick={() => handleOpacityChange(op)} className={`w-full py-1 text-[10px] font-bold rounded transition-all ${activeOpacity === op ? 'bg-indigo-500 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {op * 100}%
                    </button>
                ))}
            </div>

            <div className="w-8 h-[1px] bg-slate-200 my-1"></div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color</span>
            <label className="relative w-9 h-9 rounded-full cursor-pointer flex items-center justify-center shadow-sm hover:scale-105 transition-transform" title="Pick Custom Color">
                <div className="absolute inset-0 rounded-full bg-[conic-gradient(red,yellow,green,blue,magenta,red)] opacity-80"></div>
                <div className="absolute inset-[3px] bg-white rounded-full flex items-center justify-center"><Plus className="w-4 h-4 text-slate-600" /></div>
                <input type="color" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onInput={(e) => setActiveColor((e.target as HTMLInputElement).value)} onBlur={(e) => addCustomColor((e.target as HTMLInputElement).value)} />
            </label>
            <div className="flex flex-col gap-2 mt-1">
                {[...customColors, ...DEFAULT_COLORS].slice(0, 5).map((color, index) => (
                    <button key={`${color}-${index}`} onClick={() => setActiveColor(color)} className={`w-7 h-7 rounded-full border-2 transition-all shadow-sm ${activeColor === color ? 'border-indigo-500 scale-125' : 'border-slate-100 hover:scale-110'}`} style={{ backgroundColor: color }} />
                ))}
            </div>

            <div className="w-8 h-[1px] bg-slate-200 my-1"></div>

            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pattern</span>
            <div className="flex flex-col gap-1 w-full px-2">
                {['solid', 'dotted', 'grid'].map((pat) => (
                    <button key={pat} onClick={() => setBgPattern(pat as 'solid' | 'dotted' | 'grid')} className={`w-full py-1 text-[10px] font-bold rounded transition-all capitalize ${bgPattern === pat ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        {pat}
                    </button>
                ))}
            </div>

            <label className="relative w-9 h-9 rounded-md border-2 border-slate-300 cursor-pointer overflow-hidden mt-1 shadow-sm hover:border-slate-400 transition-colors" title="Change Background Color">
                <div className="absolute inset-0" style={{ backgroundColor }}></div>
                <input type="color" value={backgroundColor} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => setBackgroundColor(e.target.value)} />
            </label>
        </div>
    );
}