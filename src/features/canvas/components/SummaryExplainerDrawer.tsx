'use client';

import { useState, useEffect } from 'react';
import { X, Bot, Copy, Check, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'sonner';

export default function SummaryExplainerDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [markdown, setMarkdown] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const handleOpen = async (e: Event) => {
            const ce = e as CustomEvent;
            const imageBase64 = ce.detail?.imageBase64;
            if (!imageBase64) return;

            setIsOpen(true);
            setIsLoading(true);
            setMarkdown('');
            
            try {
                const res = await fetch('/api/ai/explain-diagram', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageBase64 })
                });

                const data = await res.json();
                if (res.ok && data.markdown) {
                    setMarkdown(data.markdown);
                } else {
                    setMarkdown(`**Error:** ${data.error || 'Failed to explain diagram.'}`);
                }
            } catch (err: any) {
                console.error(err);
                setMarkdown(`**Error:** ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        window.addEventListener('open-ai-explainer', handleOpen);
        return () => window.removeEventListener('open-ai-explainer', handleOpen);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdown);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="absolute right-0 top-0 h-full w-[400px] bg-[#0B0F19] border-l border-slate-800 shadow-2xl z-[150] flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/30">
                <div className="flex items-center gap-2 text-indigo-400">
                    <Bot className="w-5 h-5" />
                    <h2 className="font-bold">Diagram Summary</h2>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={copyToClipboard}
                        disabled={!markdown || isLoading}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                        title="Copy Markdown"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 relative">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                        <p className="text-sm font-medium animate-pulse">Analyzing diagram...</p>
                    </div>
                ) : (
                    <div className="text-slate-300 text-sm leading-relaxed [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-5 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:text-white [&_strong]:font-semibold [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_code]:bg-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-indigo-300 [&_code]:font-mono [&_code]:text-xs [&_a]:text-indigo-400 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-slate-700 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400 [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse [&_th]:border [&_th]:border-slate-700 [&_th]:bg-slate-800/50 [&_th]:p-2 [&_th]:text-left [&_th]:text-white [&_td]:border [&_td]:border-slate-700 [&_td]:p-2">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdown}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}
