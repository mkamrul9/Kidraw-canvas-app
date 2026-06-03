'use client';

import Link from 'next/link';
import KidrawLogo from '@/shared/components/KidrawLogo';
import { useSession } from "next-auth/react";
import { usePresenceStore } from '@/features/canvas/store/usePresenceStore';
import { useCanvasStore } from '@/features/canvas/store/useCanvasStore';
import { Sparkles, User, Settings, LayoutDashboard, CreditCard, Star, LayoutTemplate, Blocks, Rocket, BookOpen, Users, PenTool, Code, Pencil } from "lucide-react";
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/components/ui/tooltip";

export default function NavigationHUD() {
    const { data: session } = useSession();
    const { others } = usePresenceStore();
    const { setCamera, zoom, boardTitle, setBoardTitle, boardId } = useCanvasStore();

    const handleTitleSave = async (newTitle: string) => {
        if (!boardId || !newTitle.trim()) return;
        try {
            const res = await fetch(`/api/board/${boardId}/title`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle.trim() })
            });
            if (res.ok) {
                toast.success('Title updated');
            } else {
                toast.error('Failed to update title');
            }
        } catch (e) {
            toast.error('Failed to update title');
        }
    };

    if (!session?.user) return null;

    const handleFollow = (user: any) => {
        setCamera({
            x: window.innerWidth / 2 - user.x * zoom,
            y: window.innerHeight / 2 - user.y * zoom,
        });
    };

    return (
        <TooltipProvider delayDuration={200}>
            <div className="absolute z-50 top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 sm:gap-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Link href="/?view=landing" className="flex items-center gap-2 bg-[#0B0F19] px-4 py-2 rounded-xl shadow-2xl border border-slate-700 hover:bg-slate-900 hover:scale-105 transition-all">
                            <KidrawLogo iconSize={20} textClassName="font-extrabold text-white tracking-tight" />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">View Homepage</TooltipContent>
                </Tooltip>

                <div className="w-[1px] h-6 bg-slate-700 mx-1 hidden sm:block"></div>

                <div className="hidden sm:flex items-center relative group bg-[#0B0F19] rounded-xl border border-transparent hover:border-slate-700 hover:shadow-2xl transition-all">
                    <input 
                        value={boardTitle}
                        onChange={(e) => setBoardTitle(e.target.value)}
                        onBlur={(e) => handleTitleSave(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                        className="bg-transparent border-none text-slate-200 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 rounded-xl px-3 py-2 w-48 transition-colors"
                        placeholder="Untitled Board"
                    />
                    <Pencil className="w-3 h-3 text-slate-500 absolute right-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                </div>

                <DropdownMenu>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-10 w-10 border-2 border-slate-700 shadow-2xl ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                                    <AvatarImage src={session.user.image || ""} />
                                    <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">Account & Navigation</TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent align="start" className="w-64 p-2 rounded-xl bg-[#0B0F19] border-slate-700 text-slate-50 shadow-2xl">
                        <DropdownMenuLabel className="font-normal pb-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard</DropdownMenuItem></Link>
                            <Link href="/?view=landing"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Sparkles className="w-4 h-4 mr-2" /> Landing Page</DropdownMenuItem></Link>
                            <Link href="/info/features"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Star className="w-4 h-4 mr-2 text-amber-400" /> App Features</DropdownMenuItem></Link>
                            <Link href="/info/templates"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><LayoutTemplate className="w-4 h-4 mr-2 text-fuchsia-400" /> Templates</DropdownMenuItem></Link>
                            <Link href="/info/integrations"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Blocks className="w-4 h-4 mr-2 text-rose-400" /> Integrations</DropdownMenuItem></Link>
                            <Link href="/info/changelog"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Rocket className="w-4 h-4 mr-2 text-cyan-400" /> Changelog</DropdownMenuItem></Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/info/help-center"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><BookOpen className="w-4 h-4 mr-2 text-emerald-400" /> Help Center</DropdownMenuItem></Link>
                            <Link href="/info/community"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Users className="w-4 h-4 mr-2 text-emerald-400" /> Community</DropdownMenuItem></Link>
                            <Link href="/info/blog"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><PenTool className="w-4 h-4 mr-2 text-amber-400" /> Blog</DropdownMenuItem></Link>
                            <Link href="/info/developers-api"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Code className="w-4 h-4 mr-2 text-blue-400" /> Developer API</DropdownMenuItem></Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/info/profile"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem></Link>
                            <Link href="/info/settings"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem></Link>
                            <Link href="/info/billing"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem></Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Follow Mode Avatars */}
                {Object.values(others).map((user) => (
                    <Tooltip key={user.userId}>
                        <TooltipTrigger asChild>
                            <Avatar 
                                onClick={() => handleFollow(user)}
                                className="h-10 w-10 border-2 shadow-2xl ring-2 ring-transparent transition-all cursor-pointer hover:scale-110"
                                style={{ borderColor: user.color }}
                            >
                                <AvatarImage src={user.image || ""} />
                                <AvatarFallback style={{ backgroundColor: user.color }} className="text-white font-bold">
                                    {user.name?.charAt(0) || "U"}
                                </AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="bg-slate-900 border-slate-700 text-white text-xs">
                            Follow {user.name || "Anonymous"}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </div>
        </TooltipProvider>
    );
}
