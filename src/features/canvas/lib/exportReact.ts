import { Layer } from '../types';

interface LayoutItem {
    layer: Layer;
    x: number;
    y: number;
    width: number;
    height: number;
}

function renderElement(item: LayoutItem): string {
    const layer = item.layer;
    const w = Math.round(item.width);
    const h = Math.round(item.height);
    const color = layer.fill || '#e2e8f0';

    let content = layer.text ? `\n    <span className="text-white text-center font-sans">${layer.text}</span>\n` : '';

    if (layer.type === 'text') {
        return `<span className="text-[${color}] text-lg font-sans w-[${w}px] h-[${h}px] flex items-center">${layer.text}</span>`;
    }

    if (layer.type === 'ellipse') {
        return `<div className="bg-[${color}] rounded-full shadow-sm flex items-center justify-center w-[${w}px] h-[${h}px] shrink-0">${content}</div>`;
    }

    if (layer.type === 'rectangle' || layer.type === 'sticky') {
        const rounded = layer.type === 'sticky' ? 'rounded-none' : 'rounded-xl';
        return `<div className="bg-[${color}] ${rounded} shadow-sm flex items-center justify-center w-[${w}px] h-[${h}px] shrink-0">${content}</div>`;
    }

    // Fallback
    return `<div className="bg-slate-200 border border-slate-300 rounded-md w-[${w}px] h-[${h}px] shrink-0 flex items-center justify-center text-slate-400 text-xs text-center p-2">\n    ${layer.type}\n</div>`;
}

function generateLayout(items: LayoutItem[], isVertical: boolean): string {
    if (items.length === 0) return '';

    if (items.length === 1) {
        return renderElement(items[0]);
    }

    // Try to split items by projecting them onto the primary axis.
    // If isVertical is true, we look for items stacked vertically (non-overlapping Y).
    // If isVertical is false, we look for items side-by-side (non-overlapping X).

    type Interval = { min: number; max: number; items: LayoutItem[] };
    const groups: Interval[] = [];

    // Sort items by primary axis
    const sortedItems = [...items].sort((a, b) => isVertical ? a.y - b.y : a.x - b.x);

    // Merge overlapping intervals
    for (const item of sortedItems) {
        const min = isVertical ? item.y : item.x;
        const max = isVertical ? item.y + item.height : item.x + item.width;

        let merged = false;
        for (const group of groups) {
            // Check for overlap (with small tolerance)
            const tolerance = 5;
            if (min <= group.max + tolerance && max >= group.min - tolerance) {
                group.min = Math.min(group.min, min);
                group.max = Math.max(group.max, max);
                group.items.push(item);
                merged = true;
                break;
            }
        }

        if (!merged) {
            groups.push({ min, max, items: [item] });
        }
    }

    // If we successfully split into multiple groups, generate flex container
    if (groups.length > 1) {
        // Sort groups to maintain visual order
        groups.sort((a, b) => a.min - b.min);
        
        // Calculate average gap
        let totalGap = 0;
        for (let i = 0; i < groups.length - 1; i++) {
            totalGap += Math.max(0, groups[i + 1].min - groups[i].max);
        }
        const avgGap = Math.round(totalGap / (groups.length - 1));

        // Generate inner content by flipping the axis for the next level
        const innerCode = groups.map(g => generateLayout(g.items, !isVertical)).join('\n');
        
        const flexDir = isVertical ? 'flex-col' : 'flex-row';
        const alignItems = isVertical ? 'items-center' : 'items-center'; // simplify to center for now
        
        return `<div className="flex ${flexDir} ${alignItems} gap-[${avgGap}px]">\n${innerCode.split('\n').map(l => '    ' + l).join('\n')}\n</div>`;
    }

    // If we failed to split, try flipping the axis.
    // But to prevent infinite recursion, only try flipping if we haven't already.
    // Actually, in a recursive scheme, if we started vertical and failed, we flip to horizontal.
    // Let's pass a depth or just use absolute positioning fallback if both fail.
    
    // Check if we can split on the other axis
    const altGroups: Interval[] = [];
    const altSorted = [...items].sort((a, b) => (!isVertical) ? a.y - b.y : a.x - b.x);
    for (const item of altSorted) {
        const min = (!isVertical) ? item.y : item.x;
        const max = (!isVertical) ? item.y + item.height : item.x + item.width;
        let merged = false;
        for (const group of altGroups) {
            if (min <= group.max + 5 && max >= group.min - 5) {
                group.min = Math.min(group.min, min);
                group.max = Math.max(group.max, max);
                group.items.push(item);
                merged = true;
                break;
            }
        }
        if (!merged) altGroups.push({ min, max, items: [item] });
    }

    if (altGroups.length > 1) {
        return generateLayout(items, !isVertical);
    }

    // Both axes overlap. Fallback to relative/absolute positioning box.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    items.forEach((item) => {
        if (item.x < minX) minX = item.x;
        if (item.y < minY) minY = item.y;
        if (item.x + item.width > maxX) maxX = item.x + item.width;
        if (item.y + item.height > maxY) maxY = item.y + item.height;
    });

    const w = Math.round(maxX - minX);
    const h = Math.round(maxY - minY);

    const absCode = items.map(item => {
        const relX = Math.round(item.x - minX);
        const relY = Math.round(item.y - minY);
        const elementHtml = renderElement(item);
        // Inject absolute class into the first tag
        return `    <div className="absolute left-[${relX}px] top-[${relY}px]">\n        ${elementHtml}\n    </div>`;
    }).join('\n');

    return `<div className="relative w-[${w}px] h-[${h}px]">\n${absCode}\n</div>`;
}

export function exportToReactCode(layers: Layer[]): string {
    // Filter out layers that aren't structural (like arrows, lines, freehand)
    const renderableLayers = layers.filter(l => 
        l.type === 'rectangle' || 
        l.type === 'ellipse' || 
        l.type === 'text' || 
        l.type === 'sticky' || 
        l.type === 'frame'
    );

    if (renderableLayers.length === 0) return '';

    // Calculate bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    renderableLayers.forEach((layer) => {
        if (layer.x < minX) minX = layer.x;
        if (layer.y < minY) minY = layer.y;
        if (layer.x + layer.width > maxX) maxX = layer.x + layer.width;
        if (layer.y + layer.height > maxY) maxY = layer.y + layer.height;
    });

    const items: LayoutItem[] = renderableLayers.map(layer => ({
        layer,
        x: layer.x - minX,
        y: layer.y - minY,
        width: layer.width,
        height: layer.height
    }));

    // Start by trying to split vertically (into columns / sections)
    const code = generateLayout(items, true);

    return `export default function Component() {\n    return (\n        <div className="p-8 w-full h-full bg-slate-50 flex items-center justify-center font-sans">\n${code.split('\n').map(l => '            ' + l).join('\n')}\n        </div>\n    );\n}`;
}
