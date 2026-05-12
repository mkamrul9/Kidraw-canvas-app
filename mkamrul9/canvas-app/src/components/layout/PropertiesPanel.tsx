'use client';

import { useCanvasStore } from '../../store/useCanvasStore';

const COLORS = [
    '#0f172a', // Slate 900 (Almost Black)
    '#64748b', // Slate 500 (Gray)
    '#e11d48', // Rose 600 (Red)
    '#d97706', // Amber 600 (Orange/Yellow)
    '#059669', // Emerald 600 (Green)
    '#4f46e5', // Indigo 600 (Blue)
    '#7c3aed', // Violet 600 (Purple)
    '#ffffff', // White
];

export default function PropertiesPanel() {
    const { activeColor, setActiveColor, backgroundColor, setBackgroundColor } = useCanvasStore();

    return (
        <div className="absolute z-50 right-6 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/50 w-16 flex flex-col items-center py-4 gap-3 transition-all">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color</span>
            {COLORS.map((color) => (
                <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all shadow-sm ${activeColor === color ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                    style={{ backgroundColor: color }}
                    title={color}
                />
            ))}
            <div className="w-8 h-[1px] bg-slate-200 my-1"></div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">BG</span>
            <button
                onClick={() => setBackgroundColor('#ffffff')}
                className="w-6 h-6 rounded-md border border-slate-300 bg-white hover:border-indigo-400 transition-colors"
                title="White BG"
            />
            <button
                onClick={() => setBackgroundColor('#1e293b')}
                className="w-6 h-6 rounded-md border border-slate-700 bg-slate-800 hover:border-indigo-400 transition-colors"
                title="Dark BG"
            />
        </div>
    );
}