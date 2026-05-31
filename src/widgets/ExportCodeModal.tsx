'use client';

import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ExportCodeModal() {
    const { exportCodeContent, setExportCodeContent } = useCanvasStore();
    const [copied, setCopied] = useState(false);

    if (!exportCodeContent) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(exportCodeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={!!exportCodeContent} onOpenChange={(open) => !open && setExportCodeContent(null)}>
            <DialogContent className="bg-[#0B0F19] border border-white/10 text-white sm:max-w-[700px] shadow-2xl rounded-2xl overflow-hidden p-0">
                <DialogHeader className="px-6 py-4 border-b border-white/5 bg-[#05070B] flex flex-row items-center justify-between">
                    <DialogTitle className="text-xl font-bold font-sans">React & Tailwind Export</DialogTitle>
                    <Button 
                        onClick={handleCopy}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg px-4 h-9 flex items-center gap-2"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy Code"}
                    </Button>
                </DialogHeader>
                <div className="p-0 bg-[#0f172a] max-h-[60vh] overflow-auto">
                    <pre className="text-sm text-emerald-400 p-6 font-mono leading-relaxed">
                        <code>{exportCodeContent}</code>
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}
