'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback } from 'react';
import Konva from 'konva';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { EXPORT_PIXEL_RATIO } from '@/features/canvas/constants';
import { Layer } from '@/features/canvas/types';

const generateSVG = (layers: Layer[], dimensions: { width: number, height: number }, backgroundColor: string, bgPattern: string, camera: { x: number, y: number }, zoom: number) => {
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}">`;
    const baseColor = (!backgroundColor || backgroundColor === 'transparent') ? '#ffffff' : backgroundColor;
    svg += `<rect width="100%" height="100%" fill="${baseColor}" />`;
    
    if (bgPattern === 'grid' || bgPattern === 'dotted') {
        const size = (bgPattern === 'grid' ? 40 : 24) * zoom;
        svg += `<defs>`;
        if (bgPattern === 'grid') {
            svg += `<pattern id="grid" width="${size}" height="${size}" patternUnits="userSpaceOnUse" x="${camera.x % size}" y="${camera.y % size}">
                        <path d="M ${size} 0 L 0 0 0 ${size}" fill="none" stroke="#cbd5e1" stroke-width="1"/>
                        <path d="M 0 ${size} L ${size} ${size}" fill="none" stroke="#cbd5e1" stroke-width="1"/>
                    </pattern>`;
        } else {
            svg += `<pattern id="dotted" width="${size}" height="${size}" patternUnits="userSpaceOnUse" x="${camera.x % size}" y="${camera.y % size}">
                        <circle cx="2" cy="2" r="2" fill="#cbd5e1" />
                    </pattern>`;
        }
        svg += `</defs>`;
        svg += `<rect width="100%" height="100%" fill="url(#${bgPattern})" />`;
    }

    svg += `<g transform="translate(${camera.x}, ${camera.y}) scale(${zoom})">`;

    const sortedLayers = [...layers].sort((a, b) => {
        if (a.type === 'frame' && b.type !== 'frame') return -1;
        if (a.type !== 'frame' && b.type === 'frame') return 1;
        return (a.zIndex || 0) - (b.zIndex || 0);
    });

    for (const layer of sortedLayers) {
        const opacityAttr = layer.opacity !== undefined ? `opacity="${layer.opacity}"` : '';
        const fill = layer.fill || 'transparent';
        const stroke = layer.stroke || 'transparent';
        const strokeWidth = layer.type === 'pen' ? (layer.penSize || 4) : 2;

        if (layer.type === 'rectangle' || layer.type === 'frame') {
            svg += `<rect x="${layer.x}" y="${layer.y}" width="${Math.abs(layer.width)}" height="${Math.abs(layer.height)}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${opacityAttr} rx="4" />`;
        } else if (layer.type === 'ellipse') {
            const rx = Math.abs(layer.width) / 2;
            const ry = Math.abs(layer.height) / 2;
            const cx = layer.x + rx;
            const cy = layer.y + ry;
            svg += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${opacityAttr} />`;
        } else if (layer.type === 'pen' && layer.points && layer.points.length >= 4) {
            const pts = layer.points;
            let d = `M ${pts[0]} ${pts[1]} `;
            for(let i=2; i<pts.length; i+=2) {
                d += `L ${pts[i]} ${pts[i+1]} `;
            }
            svg += `<path d="${d}" fill="none" stroke="${fill}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${opacityAttr} />`;
        } else if (layer.type === 'text') {
            const fs = layer.fontSize || 16;
            svg += `<text x="${layer.x}" y="${layer.y + fs}" fill="${fill}" font-family="sans-serif" font-size="${fs}px" ${opacityAttr}>${layer.text || ''}</text>`;
        } else if (layer.type === 'image' && layer.src) {
            svg += `<image href="${layer.src}" x="${layer.x}" y="${layer.y}" width="${layer.width}" height="${layer.height}" ${opacityAttr} />`;
        } else if (layer.type === 'sticky') {
            svg += `<rect x="${layer.x}" y="${layer.y}" width="${layer.width}" height="${layer.height}" fill="${fill}" stroke="#00000010" stroke-width="1" ${opacityAttr} />`;
            if (layer.text) {
                svg += `<text x="${layer.x + 16}" y="${layer.y + 30}" fill="#1e293b" font-family="sans-serif" font-size="14px" ${opacityAttr}>${layer.text}</text>`;
            }
        }
    }
    
    svg += `</g></svg>`;
    return svg;
};

/**
 * Custom hook encapsulating the canvas export pipeline.
 * Handles PNG/JPEG export via off-screen canvas compilation that bakes
 * CSS background patterns into the final image blob.
 * Also manages window resize and returns the current dimensions.
 */
export function useCanvasExport(stageRef: React.RefObject<Konva.Stage | null>) {
    const dimensionsRef = useRef({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 });

    const handleExport = useCallback(async (e: Event) => {
        if (!stageRef.current) return;
        const format = (e as CustomEvent<string>).detail;
        if (!format) return;

        const dimensions = dimensionsRef.current;
        const { backgroundColor, bgPattern, layers } = useCanvasStore.getState();

        try {
            // Compute bounding box of all layers
            let minX = Infinity;
            let minY = Infinity;
            let maxX = -Infinity;
            let maxY = -Infinity;

            if (layers.length > 0) {
                layers.forEach(layer => {
                    if (layer.type === 'pen' && layer.points) {
                        for (let i = 0; i < layer.points.length; i += 2) {
                            minX = Math.min(minX, layer.points[i]);
                            minY = Math.min(minY, layer.points[i+1]);
                            maxX = Math.max(maxX, layer.points[i]);
                            maxY = Math.max(maxY, layer.points[i+1]);
                        }
                    } else {
                        const w = Math.abs(layer.width || 0);
                        const h = Math.abs(layer.height || 0);
                        minX = Math.min(minX, layer.x);
                        minY = Math.min(minY, layer.y);
                        maxX = Math.max(maxX, layer.x + w);
                        maxY = Math.max(maxY, layer.y + h);
                    }
                });
                // Add padding around the bounding box
                minX -= 40;
                minY -= 40;
                maxX += 40;
                maxY += 40;
            } else {
                // If empty, just export the current visible viewport
                const camera = useCanvasStore.getState().camera;
                const zoom = useCanvasStore.getState().zoom;
                minX = -camera.x / zoom;
                minY = -camera.y / zoom;
                maxX = minX + dimensions.width / zoom;
                maxY = minY + dimensions.height / zoom;
            }

            const exportWidth = maxX - minX;
            const exportHeight = maxY - minY;

            if (format === 'svg') {
                const svgString = generateSVG(layers, { width: exportWidth, height: exportHeight }, backgroundColor, bgPattern, { x: -minX, y: -minY }, 1);
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                
                if ('showSaveFilePicker' in window) {
                    const handle = await (window as any).showSaveFilePicker({ 
                        suggestedName: `kidraw-export.svg`,
                        types: [{ description: 'SVG Vector', accept: { 'image/svg+xml': ['.svg'] } }]
                    });
                    const writable = await handle.createWritable();
                    await writable.write(blob);
                    await writable.close();
                } else {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'kidraw-export.svg';
                    link.click();
                    URL.revokeObjectURL(url);
                }
                toast.success("SVG Exported successfully!");
                return;
            }

            const stage = stageRef.current;
            const oldScale = stage.scale();
            const oldPos = stage.position();

            // Temporarily reset stage scale and position to map 1:1 with absolute layer coordinates
            stage.scale({ x: 1, y: 1 });
            stage.position({ x: 0, y: 0 });

            // 1. Get raw transparent drawing directly from the bounding box area
            const konvaDataURL = stage.toDataURL({ 
                x: minX,
                y: minY,
                width: exportWidth,
                height: exportHeight,
                pixelRatio: EXPORT_PIXEL_RATIO 
            });

            // Restore stage back to its original viewing state immediately
            stage.scale(oldScale || { x: 1, y: 1 });
            stage.position(oldPos || { x: 0, y: 0 });

            // 2. Create off-screen compiler canvas
            const canvas = document.createElement('canvas');
            canvas.width = exportWidth * EXPORT_PIXEL_RATIO;
            canvas.height = exportHeight * EXPORT_PIXEL_RATIO;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // 3. Draw Solid Background
            const baseColor = (!backgroundColor || backgroundColor === 'transparent') ? '#ffffff' : backgroundColor;
            ctx.fillStyle = baseColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 4. Draw Pattern natively (Grid or Dots)
            if (bgPattern === 'grid' || bgPattern === 'dotted') {
                ctx.strokeStyle = '#cbd5e1';
                ctx.fillStyle = '#cbd5e1';
                ctx.lineWidth = 1;
                const size = (bgPattern === 'grid' ? 40 : 24) * EXPORT_PIXEL_RATIO;

                let startX = (-minX * EXPORT_PIXEL_RATIO) % size;
                if (startX < 0) startX += size;
                let startY = (-minY * EXPORT_PIXEL_RATIO) % size;
                if (startY < 0) startY += size;

                for (let x = startX; x < canvas.width; x += size) {
                    if (bgPattern === 'grid') { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
                    else { for (let y = startY; y < canvas.height; y += size) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); } }
                }
                if (bgPattern === 'grid') {
                    for (let y = startY; y < canvas.height; y += size) {
                        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                    }
                }
            }

            // 5. Overlay the drawing
            const img = new window.Image();
            img.src = konvaDataURL;
            img.onload = async () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 6. Export the final merged image or PDF
                if (format === 'pdf') {
                    const pdf = new jsPDF({
                        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                        unit: 'px',
                        format: [canvas.width / EXPORT_PIXEL_RATIO, canvas.height / EXPORT_PIXEL_RATIO]
                    });
                    pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, canvas.width / EXPORT_PIXEL_RATIO, canvas.height / EXPORT_PIXEL_RATIO);
                    
                    const pdfBlob = pdf.output('blob');
                    if ('showSaveFilePicker' in window) {
                        const handle = await (window as any).showSaveFilePicker({ 
                            suggestedName: `kidraw-export.pdf`,
                            types: [{ description: 'PDF Document', accept: { 'application/pdf': ['.pdf'] } }]
                        });
                        const writable = await handle.createWritable();
                        await writable.write(pdfBlob);
                        await writable.close();
                    } else {
                        pdf.save('kidraw-export.pdf');
                    }
                    toast.success("PDF Downloaded successfully!");
                    return;
                }

                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    if ('showSaveFilePicker' in window) {
                        const types = format === 'png' ? [{ description: 'PNG Image', accept: { 'image/png': ['.png'] } }] : [{ description: 'JPEG Image', accept: { 'image/jpeg': ['.jpg', '.jpeg'] } }];
                        const handle = await (window as any).showSaveFilePicker({ 
                            suggestedName: `kidraw-export.${format}`,
                            types
                        });
                        const writable = await handle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                    } else {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `kidraw-export.${format}`;
                        link.click();
                    }
                    toast.success("Board downloaded successfully!");
                }, mimeType, 1.0);
            };
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Export failed", err);
                toast.error("Export failed");
            }
        }
    }, [stageRef]);

    useEffect(() => {
        const handleResize = () => {
            dimensionsRef.current = { width: window.innerWidth, height: window.innerHeight };
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('export-canvas', handleExport);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('export-canvas', handleExport);
        };
    }, [handleExport]);
}
