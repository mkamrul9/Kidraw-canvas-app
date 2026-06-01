'use client';

import { signOut } from "next-auth/react";
import { Button } from "@/shared/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SignOut() {
    return (
        <div className="min-h-screen bg-black flex flex-col justify-center items-center relative overflow-hidden text-slate-50 font-sans selection:bg-red-500/30">


            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-red-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm bg-zinc-900/40 border border-white/5 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl text-center">
                <div className="mx-auto bg-red-500/10 border border-red-500/20 p-4 rounded-full w-fit mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                    <LogOut className="w-8 h-8 text-red-400" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">Sign Out</h1>
                <p className="text-zinc-400 text-sm mb-8 font-medium">Are you sure you want to securely log out of your Kidraw workspace?</p>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => signOut({ callbackUrl: '/' })} className="w-full h-12 bg-white text-black hover:bg-zinc-200 font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                        Yes, Sign me out
                    </Button>
                    <Link href="/">
                        <Button variant="ghost" className="w-full h-12 text-zinc-400 hover:text-white hover:bg-white/5 font-bold rounded-xl transition-all">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Cancel and go back
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
