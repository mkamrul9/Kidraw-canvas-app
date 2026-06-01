import { Layer } from '../types';

export function exportToReactCode(layers: Layer[]): string {
    if (layers.length === 0) return '';

    // Calculate bounding box of all layers
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    layers.forEach((layer) => {
        if (layer.x < minX) minX = layer.x;
        if (layer.y < minY) minY = layer.y;
        if (layer.x + layer.width > maxX) maxX = layer.x + layer.width;
        if (layer.y + layer.height > maxY) maxY = layer.y + layer.height;
    });

    const containerWidth = maxX - minX + 40; // Add some padding
    const containerHeight = maxY - minY + 40;

    const elementsCode = layers.map((layer) => {
        // Adjust coordinates relative to the bounding box
        const x = layer.x - minX + 20;
        const y = layer.y - minY + 20;
        
        const w = layer.width;
        const h = layer.height;
        const color = layer.fill || '#e2e8f0';

        // Basic absolute positioning
        const positionClass = `absolute left-[${Math.round(x)}px] top-[${Math.round(y)}px] w-[${Math.round(w)}px] h-[${Math.round(h)}px]`;

        if (layer.type === 'rectangle' || layer.type === 'sticky') {
            const rounded = layer.type === 'sticky' ? 'rounded-none' : 'rounded-md';
            return `        <div className="${positionClass} bg-[${color}] ${rounded} shadow-sm flex items-center justify-center p-2">\n${layer.text ? `            <span className="text-white text-center">${layer.text}</span>\n` : ''}        </div>`;
        }
        
        if (layer.type === 'ellipse') {
            return `        <div className="${positionClass} bg-[${color}] rounded-full shadow-sm flex items-center justify-center p-2">\n${layer.text ? `            <span className="text-white text-center">${layer.text}</span>\n` : ''}        </div>`;
        }

        if (layer.type === 'text') {
            return `        <span className="absolute left-[${Math.round(x)}px] top-[${Math.round(y)}px] text-[${color}] text-lg font-sans">\n            ${layer.text}\n        </span>`;
        }

        // For other shapes (diamonds, triangles, lines, arrows), we would ideally generate an SVG. 
        // For simplicity, we fallback to a generic colored block or just skip.
        return `        {/* Export for layer type ${layer.type} is not fully supported yet */}`;
    }).filter(code => code !== '').join('\n');

    return `<div className="relative w-[${Math.round(containerWidth)}px] h-[${Math.round(containerHeight)}px] bg-white overflow-hidden">\n${elementsCode}\n</div>`;
}
