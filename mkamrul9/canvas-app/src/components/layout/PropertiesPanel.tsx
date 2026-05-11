'use client';

import { useCanvasStore } from '../../store/useCanvasStore';

const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#a855f7', // Purple
    '#000000', // Black
    '#ffffff', // White
];

export default function PropertiesPanel() {
    const { activeColor, setActiveColor } = useCanvasStore();

    return (
        <div className="absolute z-50 right-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-md border border-slate-200 w-16 flex flex-col items-center py-3 gap-3">
            <span className="text-xs font-semibold text-slate-500 mb-1">Color</span>
            {COLORS.map((color) => (
                <button
                    key={color}
                    onClick={() => setActiveColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${activeColor === color ? 'border-slate-800 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                    style={{ backgroundColor: color }}
                    title={color}
                />
            ))}
        </div>
    );
}