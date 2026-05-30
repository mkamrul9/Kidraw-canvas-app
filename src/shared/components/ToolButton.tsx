'use client';

import type { ReactNode } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

export interface ToolButtonProps {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    className?: string;
    tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
    tooltipClassName?: string;
    size?: 'default' | 'sm';
}

/**
 * Shared tool button used across all canvas toolbars and panels.
 * Wraps a Shadcn Button with a Tooltip for accessibility.
 * Previously duplicated in Toolbar, ActionToolbar, PropertiesPanel, and ZoomHUD.
 */
export function ToolButton({
    icon,
    label,
    onClick,
    isActive = false,
    disabled = false,
    className = '',
    tooltipSide = 'bottom',
    tooltipClassName = '',
    size = 'default',
}: ToolButtonProps) {
    const sizeClass = size === 'sm' ? 'h-8 w-8 rounded-md' : 'w-10 h-10 rounded-lg';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClick}
                    disabled={disabled}
                    className={`${sizeClass} transition-colors ${
                        isActive
                            ? 'bg-violet-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                    } ${className}`}
                >
                    {icon}
                </Button>
            </TooltipTrigger>
            <TooltipContent
                side={tooltipSide}
                className={`bg-slate-900 border-slate-700 text-white text-xs ${tooltipClassName}`}
            >
                {label}
            </TooltipContent>
        </Tooltip>
    );
}
