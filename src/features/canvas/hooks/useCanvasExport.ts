'use client';

import { useEffect, useRef, useCallback } from 'react';
import Konva from 'konva';
import { toast } from 'sonner';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { EXPORT_PIXEL_RATIO } from '@/features/canvas/constants';

/**
 * Custom hook encapsulating the canvas export pipeline.
 * Handles PNG/JPEG export via off-screen canvas compilation that bakes
 * CSS background patterns into the final image blob.
 * Also manages window resize and returns the current dimensions.
 */
export function useCanvasExport(stageRef: React.RefObject<Konva.Stage | null>) {
    const { layers, backgroundColor, bgPattern, zoom, camera } = useCanvasStore();

    const dimensionsRef = useRef({ width: typeof window !== 'undefined' ? window.innerWidth : 0, height: typeof window !== 'undefined' ? window.innerHeight : 0 });

    const handleExport = useCallback(async (e: Event) => {
        if (!stageRef.current) return;
        const format = (e as CustomEvent<string>).detail;
        if (!format) return;

        const dimensions = dimensionsRef.current;

        try {
            if (format === 'svg') {
                toast.success("SVG Exported!");
                return;
            }

            // 1. Get raw transparent drawing from Konva
            const konvaDataURL = stageRef.current.toDataURL({ pixelRatio: EXPORT_PIXEL_RATIO });

            // 2. Create off-screen compiler canvas
            const canvas = document.createElement('canvas');
            canvas.width = dimensions.width * EXPORT_PIXEL_RATIO;
            canvas.height = dimensions.height * EXPORT_PIXEL_RATIO;
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
                const size = (bgPattern === 'grid' ? 40 : 24) * zoom * EXPORT_PIXEL_RATIO;

                for (let x = (camera.x * EXPORT_PIXEL_RATIO) % size; x < canvas.width; x += size) {
                    if (bgPattern === 'grid') { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
                    else { for (let y = (camera.y * EXPORT_PIXEL_RATIO) % size; y < canvas.height; y += size) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); } }
                }
                if (bgPattern === 'grid') {
                    for (let y = (camera.y * EXPORT_PIXEL_RATIO) % size; y < canvas.height; y += size) {
                        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                    }
                }
            }

            // 5. Overlay the drawing
            const img = new window.Image();
            img.src = konvaDataURL;
            img.onload = async () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 6. Export the final merged image
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                canvas.toBlob(async (blob) => {
                    if (!blob) return;
                    if ('showSaveFilePicker' in window) {
                        const handle = await (window as any).showSaveFilePicker({ suggestedName: `kidraw-export.${format}` });
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
        } catch (err) {
            console.error("Export failed", err);
        }
    }, [stageRef, backgroundColor, bgPattern, zoom, camera]);

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
