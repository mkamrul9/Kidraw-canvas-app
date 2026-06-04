'use client';

import React, { useState, useEffect } from 'react';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Copy, Link as LinkIcon, Globe, Lock, UserPlus, Users } from "lucide-react";

export default function ShareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { boardId, isPublic, publicRole, setShareSettings, isReadOnly } = useCanvasStore();
    const [isLoading, setIsLoading] = useState(false);
    
    // Collaborator states
    const [collaborators, setCollaborators] = useState<{ id: string, email: string, role: string }[]>([]);
    const [newEmail, setNewEmail] = useState('');
    const [newRole, setNewRole] = useState('viewer');

    useEffect(() => {
        if (isOpen && boardId && !isReadOnly) {
            fetchCollaborators();
        }
    }, [isOpen, boardId, isReadOnly]);

    const fetchCollaborators = async () => {
        try {
            const res = await fetch(`/api/board/${boardId}/collaborators`);
            if (res.ok) {
                const data = await res.json();
                setCollaborators(data);
            }
        } catch (e) {
            console.error('Failed to fetch collaborators');
        }
    };

    const handleCopyLink = () => {
        const url = `${window.location.origin}/board/${boardId}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    const handleUpdateSettings = async (newIsPublic: boolean, newRole: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/board/${boardId}/share`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublic: newIsPublic, publicRole: newRole })
            });
            if (res.ok) {
                setShareSettings(newIsPublic, newRole);
                toast.success('Share settings updated');
            } else {
                toast.error('Failed to update share settings');
            }
        } catch (e) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCollaborator = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmail.trim()) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/board/${boardId}/collaborators`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, role: newRole })
            });
            if (res.ok) {
                toast.success('Collaborator invited');
                setNewEmail('');
                fetchCollaborators();
            } else {
                toast.error('Failed to invite collaborator');
            }
        } catch (e) {
            toast.error('Error adding collaborator');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveCollaborator = async (collabId: string) => {
        try {
            const res = await fetch(`/api/board/${boardId}/collaborators/${collabId}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Collaborator removed');
                setCollaborators(collaborators.filter(c => c.id !== collabId));
            } else {
                toast.error('Failed to remove collaborator');
            }
        } catch (e) {
            toast.error('Error removing collaborator');
        }
    };

    if (isReadOnly) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="bg-[#0B0F19] text-slate-50 border-slate-700 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Share Board</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            You are viewing this board in Read-Only mode.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-center">
                        <Button onClick={handleCopyLink} className="bg-violet-600 hover:bg-violet-700 text-white px-4 w-full">
                            <Copy className="w-4 h-4 mr-2" /> Copy Link
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#0B0F19] text-slate-50 border-slate-700 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        <Users className="w-5 h-5 text-violet-400" /> Share Board
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Manage who can view or edit this whiteboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Invite by Email */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                            <UserPlus className="w-4 h-4" /> Invite Collaborators
                        </h3>
                        <form onSubmit={handleAddCollaborator} className="flex gap-2">
                            <Input 
                                placeholder="Email address" 
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-slate-900 border-slate-700 text-slate-200 focus-visible:ring-violet-500 h-9"
                            />
                            <Select value={newRole} onValueChange={setNewRole}>
                                <SelectTrigger className="w-28 bg-slate-900 border-slate-700 text-slate-200 focus:ring-violet-500 h-9">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" disabled={isLoading} className="bg-violet-600 hover:bg-violet-700 text-white h-9">
                                Invite
                            </Button>
                        </form>
                        
                        {/* Collaborator List */}
                        {collaborators.length > 0 && (
                            <div className="space-y-2 mt-4 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                {collaborators.map(c => (
                                    <div key={c.id} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-violet-900 flex items-center justify-center text-xs font-bold text-violet-200">
                                                {c.email[0].toUpperCase()}
                                            </div>
                                            <span className="text-sm text-slate-200 truncate max-w-[150px]">{c.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-400 uppercase">{c.role}</span>
                                            <Button variant="ghost" size="sm" onClick={() => handleRemoveCollaborator(c.id)} className="h-6 w-6 p-0 text-slate-500 hover:text-red-400">
                                                &times;
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="w-full h-px bg-slate-800"></div>

                    {/* Public Link Settings */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                                {isPublic ? <Globe className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{isPublic ? 'Public Link On' : 'Restricted'}</p>
                                <p className="text-xs text-slate-400">{isPublic ? 'Anyone with the link can access' : 'Only you can access'}</p>
                            </div>
                        </div>
                        <Switch 
                            checked={isPublic} 
                            onCheckedChange={(checked) => handleUpdateSettings(checked, publicRole)} 
                            disabled={isLoading}
                        />
                    </div>

                    {isPublic && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-300">Public Link Permissions</p>
                                <Select 
                                    value={publicRole} 
                                    onValueChange={(val) => handleUpdateSettings(isPublic, val)}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700 text-slate-200 focus:ring-violet-500 h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                                        <SelectItem value="viewer">Can View</SelectItem>
                                        <SelectItem value="editor">Can Edit</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex space-x-2">
                                <div className="relative flex-1">
                                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                                    <Input 
                                        readOnly 
                                        value={boardId ? `${window.location.origin}/board/${boardId}` : ''} 
                                        className="bg-slate-900 border-slate-700 pl-9 pr-4 text-slate-300 h-9 focus-visible:ring-violet-500"
                                    />
                                </div>
                                <Button onClick={handleCopyLink} className="bg-violet-600 hover:bg-violet-700 text-white h-9 px-4">
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
