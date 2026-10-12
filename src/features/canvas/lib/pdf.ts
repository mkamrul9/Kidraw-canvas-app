// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedPdfjsLib: any = null;

const PDFJS_VERSION = '4.4.168';
const PDFJS_CDN_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.mjs`;
const PDFJS_WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loadPDFJS(): Promise<any> {
    if (typeof window === 'undefined') return null;
    
    if (cachedPdfjsLib) {
        return cachedPdfjsLib;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).pdfjsLib) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cachedPdfjsLib = (window as any).pdfjsLib;
        return cachedPdfjsLib;
    }

    try {
        // Dynamically import patched modern PDF.js ES module (resolves CVE-2024-4367)
        // webpackIgnore ensures Next.js bundler does not attempt to statically bundle external CDN ESM
        const pdfjsModule = await import(/* webpackIgnore: true */ PDFJS_CDN_URL);
        const pdfjsLib = pdfjsModule.default || pdfjsModule;

        if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
            cachedPdfjsLib = pdfjsLib;
            return pdfjsLib;
        }

        throw new Error('PDF.js module loaded without GlobalWorkerOptions');
    } catch (error) {
        console.error('Failed to dynamically load PDF.js from CDN:', error);
        throw new Error('Failed to load secure PDF.js library.');
    }
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
    // Enforce isEvalSupported: false to eliminate font matrix arbitrary script evaluation (CVE-2024-4367)
    const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        isEvalSupported: false,
        useSystemFonts: false,
    });

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
        
        // Render at 1.5x scale for crisp text resolution
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
