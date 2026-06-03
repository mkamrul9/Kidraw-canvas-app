'use client';

import { useState, useEffect } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { History, X, Save, Clock, ChevronRight, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface VersionHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Snapshot {
    id: string;
    name: string;
    createdAt: string;
    author: { name: string; image: string } | null;
}

export default function VersionHistoryModal({ isOpen, onClose }: VersionHistoryModalProps) {
    const { boardId, layers, addLayers, clear } = useCanvasStore();
    const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [snapshotName, setSnapshotName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (isOpen && boardId) {
            fetchSnapshots();
        }
    }, [isOpen, boardId]);

    const fetchSnapshots = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`/api/board/${boardId}/snapshots`);
            const data = await res.json();
            if (res.ok) {
                setSnapshots(data.snapshots);
            }
        } catch (err) {
            console.error("Failed to fetch snapshots:", err);
            toast.error("Failed to load version history.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSnapshot = async () => {
        if (!snapshotName.trim() || !boardId) return;
        try {
            setIsSaving(true);
            const res = await fetch(`/api/board/${boardId}/snapshots`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: snapshotName.trim(), layers })
            });
            const data = await res.json();
            if (res.ok) {
                setSnapshots([data.snapshot, ...snapshots]);
                setSnapshotName('');
                setIsCreating(false);
                toast.success("Snapshot saved!");
            } else {
                toast.error(data.error || "Failed to save snapshot.");
            }
        } catch (err) {
            console.error("Failed to save snapshot:", err);
            toast.error("Failed to save snapshot.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleRestore = async (snapshotId: string) => {
        try {
            toast.loading("Restoring snapshot...", { id: 'restore' });
            const res = await fetch(`/api/board/${boardId}/snapshots/${snapshotId}`);
            const data = await res.json();
            if (res.ok && data.snapshot) {
                clear();
                setTimeout(() => {
                    addLayers(data.snapshot.layers);
                    toast.success("Board restored to previous version!", { id: 'restore' });
                    onClose();
                }, 100);
            } else {
                toast.error(data.error || "Failed to restore.", { id: 'restore' });
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to restore.", { id: 'restore' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-[#0B0F19] border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <History className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-lg font-bold text-white">Version History</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 border-b border-white/10 bg-black/20">
                    {isCreating ? (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={snapshotName}
                                onChange={e => setSnapshotName(e.target.value)}
                                placeholder="e.g. V1 Final Design"
                                className="w-full px-3 py-2 bg-[#0B0F19] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                                autoFocus
                                onKeyDown={e => { if (e.key === 'Enter') handleSaveSnapshot(); }}
                            />
                            <div className="flex gap-2">
                                <button onClick={() => setIsCreating(false)} className="flex-1 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 rounded-lg">Cancel</button>
                                <button onClick={handleSaveSnapshot} disabled={isSaving || !snapshotName.trim()} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center">
                                    {isSaving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Save className="w-3 h-3 mr-1" />} Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={() => setIsCreating(true)} className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg flex items-center justify-center transition-colors border border-dashed border-white/20">
                            <Plus className="w-4 h-4 mr-2" /> Create Snapshot
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-slate-500" /></div>
                    ) : snapshots.length === 0 ? (
                        <div className="text-center p-8 text-sm text-slate-500">No snapshots saved yet.</div>
                    ) : (
                        snapshots.map(snap => (
                            <div key={snap.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors group">
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-white">{snap.name}</span>
                                        <span className="text-xs text-slate-500 flex items-center mt-1">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(snap.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => handleRestore(snap.id)}
                                        className="opacity-0 group-hover:opacity-100 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center"
                                    >
                                        Restore <ChevronRight className="w-3 h-3 ml-0.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
