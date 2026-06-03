/* eslint-disable react-hooks/purity */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useCommentStore, CanvasComment } from '@/features/canvas/store/useCommentStore';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Check, Send } from 'lucide-react';

type CommentPinProps = {
    comment: CanvasComment;
    zoom: number;
    camera: { x: number; y: number };
};

function CommentPin({ comment, zoom, camera }: CommentPinProps) {
    const { activeThreadId, setActiveThreadId, addReply, toggleResolved } = useCommentStore();
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const replyInputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const isActive = activeThreadId === comment.id;

    // Resolve canvas coordinates if attached to a shape
    const storeLayers = useCanvasStore((state) => state.layers);
    let resolvedCanvasX = comment.x;
    let resolvedCanvasY = comment.y;

    if (comment.elementId) {
        const parentLayer = storeLayers.find(l => l.id === comment.elementId);
        if (parentLayer) {
            resolvedCanvasX = parentLayer.x + comment.x;
            resolvedCanvasY = parentLayer.y + comment.y;
        }
    }

    // Convert canvas-space coordinates to screen-space
    const screenX = resolvedCanvasX * zoom + camera.x;
    const screenY = resolvedCanvasY * zoom + camera.y;

    const handleSubmitReply = async () => {
        if (!replyText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await addReply(comment.id, replyText.trim());
        setReplyText('');
        setIsSubmitting(false);
        replyInputRef.current?.focus();
    };

    // Close popover on outside click
    useEffect(() => {
        if (!isActive) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setActiveThreadId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isActive, setActiveThreadId]);

    // Focus reply input when thread opens
    useEffect(() => {
        if (isActive) {
            setTimeout(() => replyInputRef.current?.focus(), 100);
        }
    }, [isActive]);

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div
            className="absolute z-[80] group"
            style={{
                left: `${screenX}px`,
                top: `${screenY}px`,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {/* Pin Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setActiveThreadId(isActive ? null : comment.id);
                }}
                className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 ${
                    comment.resolved
                        ? 'bg-emerald-600 border-2 border-emerald-400'
                        : 'bg-violet-600 border-2 border-violet-400'
                } ${isActive ? 'scale-110 ring-4 ring-violet-400/30' : ''}`}
            >
                {comment.resolved ? (
                    <Check className="w-4 h-4 text-white" />
                ) : (
                    <MessageCircle className="w-4 h-4 text-white" />
                )}
                {/* Ping animation for unresolved */}
                {!comment.resolved && !isActive && (
                    <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-30" />
                )}
                {/* Reply count badge */}
                {comment.replies.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">
                        {comment.replies.length}
                    </span>
                )}
            </button>

            {/* Hover tooltip (when not active) */}
            {!isActive && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-zinc-950/95 backdrop-blur-xl border border-white/10 rounded-xl p-2.5 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 scale-95 group-hover:scale-100">
                    <div className="flex items-center gap-1.5 mb-1">
                        {comment.author.image ? (
                            <img src={comment.author.image} alt="" className="w-4 h-4 rounded-full" />
                        ) : (
                            <div className="w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-[8px] text-white font-bold">
                                {(comment.author.name || 'U')[0]}
                            </div>
                        )}
                        <span className="text-[10px] font-bold text-white truncate">{comment.author.name || 'User'}</span>
                        <span className="text-[9px] text-slate-500 ml-auto">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-snug">{comment.content}</p>
                </div>
            )}

            {/* Expanded thread popover */}
            {isActive && (
                <div
                    ref={popoverRef}
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-72 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-cursor-chat-pop"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Thread Header */}
                    <div className="px-3 pt-3 pb-2 border-b border-white/5 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white uppercase tracking-wider">Thread</span>
                        <button
                            onClick={() => toggleResolved(comment.id, !comment.resolved)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                                comment.resolved
                                    ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            {comment.resolved ? '✓ Resolved' : 'Resolve'}
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="max-h-52 overflow-y-auto px-3 py-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
                        {/* Root comment */}
                        <div className="flex gap-2">
                            {comment.author.image ? (
                                <img src={comment.author.image} alt="" className="w-5 h-5 rounded-full shrink-0 mt-0.5" />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-violet-500 shrink-0 mt-0.5 flex items-center justify-center text-[9px] text-white font-bold">
                                    {(comment.author.name || 'U')[0]}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-white">{comment.author.name || 'User'}</span>
                                    <span className="text-[9px] text-slate-500">{timeAgo(comment.createdAt)}</span>
                                </div>
                                <p className="text-[12px] text-slate-300 leading-relaxed mt-0.5 break-words">{comment.content}</p>
                            </div>
                        </div>

                        {/* Replies */}
                        {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2 pl-2 border-l-2 border-violet-500/20">
                                {reply.author.image ? (
                                    <img src={reply.author.image} alt="" className="w-4 h-4 rounded-full shrink-0 mt-0.5" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full bg-sky-500 shrink-0 mt-0.5 flex items-center justify-center text-[8px] text-white font-bold">
                                        {(reply.author.name || 'U')[0]}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-white">{reply.author.name || 'User'}</span>
                                        <span className="text-[9px] text-slate-500">{timeAgo(reply.createdAt)}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5 break-words">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Reply Input */}
                    <div className="px-3 py-2 border-t border-white/5 flex items-center gap-2">
                        <input
                            ref={replyInputRef}
                            type="text"
                            placeholder="Reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmitReply();
                                }
                            }}
                            className="flex-1 bg-slate-950/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all font-sans"
                        />
                        <button
                            onClick={handleSubmitReply}
                            disabled={!replyText.trim() || isSubmitting}
                            className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                        >
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

type NewCommentInputProps = {
    position: { screenX: number; screenY: number; canvasX: number; canvasY: number };
    onSubmit: (content: string) => void;
    onCancel: () => void;
};

function NewCommentInput({ position, onSubmit, onCancel }: NewCommentInputProps) {
    const [text, setText] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 50);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onCancel();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    return (
        <div
            ref={containerRef}
            className="absolute z-[90] animate-cursor-chat-pop"
            style={{
                left: `${position.screenX}px`,
                top: `${position.screenY}px`,
                transform: 'translate(-50%, -100%) translateY(-12px)',
            }}
        >
            <div className="w-64 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-3 pt-3 pb-2 border-b border-white/5">
                    <span className="text-xs font-extrabold text-white uppercase tracking-wider">New Comment</span>
                </div>
                <div className="px-3 py-2 flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Leave a comment..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && text.trim()) {
                                e.preventDefault();
                                onSubmit(text.trim());
                            } else if (e.key === 'Escape') {
                                e.preventDefault();
                                onCancel();
                            }
                        }}
                        className="flex-1 bg-slate-950/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all font-sans"
                    />
                    <button
                        onClick={() => text.trim() && onSubmit(text.trim())}
                        disabled={!text.trim()}
                        className="p-1.5 rounded-lg bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-90"
                    >
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CommentOverlay() {
    const { comments, addComment, setActiveThreadId } = useCommentStore();
    const { activeTool, camera, zoom, boardId } = useCanvasStore();
    const [newCommentPos, setNewCommentPos] = useState<{ screenX: number; screenY: number; canvasX: number; canvasY: number; elementId: string | null } | null>(null);

    const isCommentTool = activeTool === 'comment';

    const handleCanvasClick = useCallback((e: MouseEvent) => {
        if (!isCommentTool || !boardId) return;

        // Only fire if the click target is on the Konva canvas (not UI elements like sidebar, toolbar, etc.)
        const target = e.target as HTMLElement;
        const isCanvasClick = target.tagName === 'CANVAS' || target.closest('.konvajs-content');
        if (!isCanvasClick) return;

        // Get latest camera and zoom from the store to avoid re-binding this listener on every pan/zoom
        const { camera, zoom } = useCanvasStore.getState();

        // Convert screen click position to canvas coordinates
        const canvasX = (e.clientX - camera.x) / zoom;
        const canvasY = (e.clientY - camera.y) / zoom;

        // Check if pointer intersects any shape
        const storeLayers = useCanvasStore.getState().layers;
        let intersectedElementId: string | null = null;
        let finalCanvasX = canvasX;
        let finalCanvasY = canvasY;

        for (let i = storeLayers.length - 1; i >= 0; i--) {
            const layer = storeLayers[i];
            const w = Math.abs(layer.width || 0);
            const h = Math.abs(layer.height || 0);
            
            // Allow clicking inside frame area or bounding box of other shapes
            if (canvasX >= layer.x && canvasX <= layer.x + w && canvasY >= layer.y && canvasY <= layer.y + h) {
                intersectedElementId = layer.id;
                // Store offset relative to the shape instead of absolute canvas coordinates
                finalCanvasX = canvasX - layer.x;
                finalCanvasY = canvasY - layer.y;
                break;
            }
        }

        setNewCommentPos({
            screenX: e.clientX,
            screenY: e.clientY,
            canvasX: finalCanvasX,
            canvasY: finalCanvasY,
            elementId: intersectedElementId,
        });
        setActiveThreadId(null);
    }, [isCommentTool, boardId, setActiveThreadId]);

    useEffect(() => {
        if (!isCommentTool) {
            setNewCommentPos(null);
            return;
        }

        // Use a slight delay to avoid capturing the click that selected the comment tool
        window.addEventListener('click', handleCanvasClick);
        return () => window.removeEventListener('click', handleCanvasClick);
    }, [isCommentTool, handleCanvasClick]);

    const handleSubmitNewComment = async (content: string) => {
        if (!boardId || !newCommentPos) return;
        await addComment(boardId, content, newCommentPos.canvasX, newCommentPos.canvasY, newCommentPos.elementId);
        setNewCommentPos(null);
    };

    // Show ALL comments as pins (both resolved and unresolved), with different styling
    return (
        <>
            {comments.map((comment) => (
                <CommentPin
                    key={comment.id}
                    comment={comment}
                    zoom={zoom}
                    camera={camera}
                />
            ))}

            {newCommentPos && (
                <NewCommentInput
                    position={newCommentPos}
                    onSubmit={handleSubmitNewComment}
                    onCancel={() => setNewCommentPos(null)}
                />
            )}
        </>
    );
}

