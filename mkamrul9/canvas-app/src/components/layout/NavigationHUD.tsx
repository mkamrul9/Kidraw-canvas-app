'use client';

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, Home, User, Settings, CreditCard, Keyboard, LogIn } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function NavigationHUD() {
    const { data: session } = useSession();

    if (!session?.user) return null;

    return (
        <div className="absolute z-50 top-6 left-6 flex items-center gap-3">
            {/* KIDRAW LOGO -> HOME */}
            <Link href="/" className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/50 hover:bg-white hover:scale-105 transition-all">
                <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight">Kidraw</span>
            </Link>

            {/* AVATAR DROPDOWN */}
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-10 w-10 border-2 border-white/50 shadow-lg ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-slate-900 text-violet-400 font-bold">
                            {session.user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 p-2 rounded-xl bg-slate-900 border-white/10 text-slate-50 shadow-2xl">
                    <DropdownMenuLabel className="font-normal pb-3">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                            <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuGroup className="py-1">
                        <Link href="/">
                            <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Home className="w-4 h-4 mr-2" /> Back to Dashboard</DropdownMenuItem>
                        </Link>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuGroup className="py-1">
                        <Link href="/info/profile"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem></Link>
                        <Link href="/info/settings"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem></Link>
                        <Link href="/info/billing"><DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem></Link>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator className="bg-white/10" />
                    <Link href="/api/auth/signout">
                        <DropdownMenuItem className="cursor-pointer focus:bg-red-600 focus:text-white text-red-400 rounded-md transition-colors">
                            <LogIn className="w-4 h-4 mr-2 rotate-180" /> Log out
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}