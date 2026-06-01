/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useCommentStore, CanvasComment } from '@/features/canvas/store/useCommentStore';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Button } from '@/shared/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/ui/tooltip';
import { MessageCircle, X, Check, CheckCheck, Send, MapPin } from 'lucide-react';

export default function CommentSidebar() {
    const { comments, isSidebarOpen, setSidebarOpen, activeThreadId, setActiveThreadId, addReply, toggleResolved } = useCommentStore();
    const { setCamera, zoom } = useCanvasStore();

    const [activeTab, setActiveTab] = useState<'Open' | 'Resolved'>('Open');
    const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

    const openComments = comments.filter((c) => !c.resolved);
    const resolvedComments = comments.filter((c) => c.resolved);
    const displayedComments = activeTab === 'Open' ? openComments : resolvedComments;

    const timeAgo = (dateStr: string) => {
        // eslint-disable-next-line react-hooks/purity
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const panToComment = (comment: CanvasComment) => {
        const screenCenterX = window.innerWidth / 2;
        const screenCenterY = window.innerHeight / 2;
        setCamera({
            x: screenCenterX - comment.x * zoom,
            y: screenCenterY - comment.y * zoom,
        });
        setActiveThreadId(comment.id);
    };

    const handleReply = async (commentId: string) => {
        const text = replyTexts[commentId]?.trim();
        if (!text) return;
        await addReply(commentId, text);
        setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
    };

    return (
        <TooltipProvider delayDuration={200}>
            {/* FLOATING TRIGGER BUTTON */}
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className={`absolute top-24 right-6 z-40 p-3.5 bg-[#0B0F19]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-slate-400 hover:text-white hover:bg-slate-800/50 hover:scale-105 active:scale-95 transition-all duration-300 ${
                            isSidebarOpen ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
                        }`}
                    >
                        <MessageCircle className="w-5 h-5 text-violet-400" />
                        {openComments.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#0B0F19] shadow-sm">
                                {openComments.length}
                            </span>
                        )}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-slate-900 border-slate-700 text-white text-xs">
                    Comments ({openComments.length})
                </TooltipContent>
            </Tooltip>

            {/* SIDEBAR PANEL */}
            <div
                className={`absolute top-24 right-6 bottom-6 w-80 bg-[#0B0F19]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'
                }`}
            >
                {/* Header */}
                <div className="px-4 pt-4 pb-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-violet-400" />
                        <span className="font-extrabold text-white text-sm uppercase tracking-wider">Comments</span>
                        <span className="text-[10px] bg-violet-600/20 text-violet-300 font-bold px-1.5 py-0.5 rounded-md">
                            {openComments.length}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSidebarOpen(false)}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 active:scale-90 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Tabs */}
                <div className="px-4 py-2">
                    <div className="flex bg-slate-950/40 p-1 rounded-xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('Open')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'Open'
                                    ? 'bg-violet-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <MessageCircle className="w-3 h-3" />
                            Open ({openComments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('Resolved')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                activeTab === 'Resolved'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-slate-400 hover:text-slate-200'
                            }`}
                        >
                            <CheckCheck className="w-3 h-3" />
                            Resolved ({resolvedComments.length})
                        </button>
                    </div>
                </div>

                {/* Comment Threads List */}
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                    {displayedComments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-xs">
                            <MessageCircle className="w-8 h-8 mb-2 opacity-30 text-slate-400" />
                            <span>{activeTab === 'Open' ? 'No open comments' : 'No resolved comments'}</span>
                            {activeTab === 'Open' && (
                                <span className="text-[10px] mt-1 text-slate-600">Select the Comment tool and click on the canvas</span>
                            )}
                        </div>
                    ) : (
                        displayedComments.map((comment) => (
                            <div
                                key={comment.id}
                                className={`bg-slate-900/40 border rounded-xl overflow-hidden transition-all ${
                                    activeThreadId === comment.id
                                        ? 'border-violet-500/40 shadow-lg shadow-violet-500/5'
                                        : 'border-white/5 hover:border-white/10'
                                }`}
                            >
                                {/* Comment Header */}
                                <div className="px-3 pt-2.5 pb-1.5 flex items-start justify-between">
                                    <div className="flex items-center gap-1.5">
                                        {comment.author.image ? (
                                            <img src={comment.author.image} alt="" className="w-5 h-5 rounded-full" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[9px] text-white font-bold">
                                                {(comment.author.name || 'U')[0]}
                                            </div>
                                        )}
                                        <span className="text-[11px] font-bold text-white">{comment.author.name || 'User'}</span>
                                        <span className="text-[9px] text-slate-500">{timeAgo(comment.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => panToComment(comment)}
                                            className="p-1 rounded text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                                            title="Go to comment"
                                        >
                                            <MapPin className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => toggleResolved(comment.id, !comment.resolved)}
                                            className={`p-1 rounded transition-all ${
                                                comment.resolved
                                                    ? 'text-emerald-400 hover:bg-emerald-600/20'
                                                    : 'text-slate-500 hover:text-emerald-400 hover:bg-emerald-600/10'
                                            }`}
                                            title={comment.resolved ? 'Unresolve' : 'Resolve'}
                                        >
                                            <Check className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Comment Body */}
                                <div className="px-3 pb-2">
                                    <p className="text-[12px] text-slate-300 leading-relaxed break-words">{comment.content}</p>
                                </div>

                                {/* Replies */}
                                {comment.replies.length > 0 && (
                                    <div className="px-3 pb-2 space-y-1.5">
                                        {comment.replies.map((reply) => (
                                            <div key={reply.id} className="flex gap-1.5 pl-2 border-l-2 border-violet-500/20">
                                                {reply.author.image ? (
                                                    <img src={reply.author.image} alt="" className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5" />
                                                ) : (
                                                    <div className="w-3.5 h-3.5 rounded-full bg-sky-500 shrink-0 mt-0.5 flex items-center justify-center text-[7px] text-white font-bold">
                                                        {(reply.author.name || 'U')[0]}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[10px] font-bold text-white">{reply.author.name || 'User'}</span>
                                                    <span className="text-[9px] text-slate-500 ml-1">{timeAgo(reply.createdAt)}</span>
                                                    <p className="text-[11px] text-slate-400 leading-relaxed break-words">{reply.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Reply Input */}
                                {!comment.resolved && (
                                    <div className="px-3 py-2 border-t border-white/5 flex items-center gap-1.5">
                                        <input
                                            type="text"
                                            placeholder="Reply..."
                                            value={replyTexts[comment.id] || ''}
                                            onChange={(e) => setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleReply(comment.id);
                                                }
                                            }}
                                            className="flex-1 bg-slate-950/60 border border-white/10 rounded-lg px-2.5 py-1 text-[11px] text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 transition-all font-sans"
                                        />
                                        <button
                                            onClick={() => handleReply(comment.id)}
                                            disabled={!replyTexts[comment.id]?.trim()}
                                            className="p-1 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                                        >
                                            <Send className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}
