import React from 'react';

export default function KidrawLogo({ 
    className = "", 
    iconSize = 18, 
    showText = true, 
    textClassName = "font-extrabold text-xl text-white tracking-tight" 
}: { 
    className?: string; 
    iconSize?: number; 
    showText?: boolean; 
    textClassName?: string;
}) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.5)] flex items-center justify-center relative overflow-hidden group border border-white/10">
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {showText && (
                <span className={textClassName}>Kidraw</span>
            )}
        </div>
    );
}
