// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadPDFJS(): Promise<any> {
    if (typeof window === 'undefined') return null;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (window as any).pdfjsLib;
    }

    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pdfjsLib = (window as any).pdfjsLib;
            if (pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve(pdfjsLib);
            } else {
                reject(new Error('pdfjsLib is not defined on window'));
            }
        };
        script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'));
        document.head.appendChild(script);
    });
}

export async function renderPDFPages(
    file: File,
    progressCallback: (pct: number) => void
): Promise<{ pages: string[]; width: number; height: number }> {
    const pdfjsLib = await loadPDFJS();
    if (!pdfjsLib) {
        throw new Error('PDF.js could not be loaded.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });

    loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
        if (progress.total > 0) {
            // Loading progress maps to 0% - 40%
            const pct = Math.round((progress.loaded / progress.total) * 40);
            progressCallback(pct);
        }
    };

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const pagesDataUrls: string[] = [];
    
    let targetWidth = 600;
    let targetHeight = 800;

    for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        
        // Render at 1.5x scale for high resolution/crisp text
        const viewport = page.getViewport({ scale: 1.5 });
        
        if (i === 1) {
            // Keep the aspect ratio but restrict width to a standard size (e.g. 600px)
            const maxPageWidth = 600;
            const scaleFactor = Math.min(1, maxPageWidth / (viewport.width / 1.5));
            targetWidth = (viewport.width / 1.5) * scaleFactor;
            targetHeight = (viewport.height / 1.5) * scaleFactor;
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            pagesDataUrls.push(canvas.toDataURL('image/png'));
        }

        // Rendering progress maps from 40% to 100%
        const renderPct = 40 + Math.round((i / numPages) * 60);
        progressCallback(renderPct);
    }

    return {
        pages: pagesDataUrls,
        width: targetWidth,
        height: targetHeight,
    };
}
