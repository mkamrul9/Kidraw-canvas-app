'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Sparkles, GitBranch } from "lucide-react";
import Link from "next/link";

export default function SignIn() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center relative overflow-hidden text-slate-50">

            {/* Background Aurora Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[120px] opacity-20 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

            <div className="relative z-10 w-full max-w-md bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-3 rounded-2xl shadow-lg mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to Kidraw</h1>
                    <p className="text-slate-400 text-center text-sm">Sign in to access your infinite workspaces and collaborate with your team.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <Button
                        onClick={() => signIn('github', { callbackUrl: '/' })}
                        className="w-full h-12 bg-white text-slate-950 hover:bg-slate-200 font-semibold rounded-xl transition-transform hover:scale-[1.02]"
                    >
                        <GitBranch className="w-5 h-5 mr-2" /> Continue with GitHub
                    </Button>

                    <Button
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className="w-full h-12 bg-slate-800 text-white hover:bg-slate-700 border border-slate-700 font-semibold rounded-xl transition-transform hover:scale-[1.02]"
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </Button>
                </div>

                <p className="mt-8 text-center text-xs text-slate-500">
                    By signing in, you agree to our <Link href="#" className="underline hover:text-slate-300">Terms of Service</Link> and <Link href="#" className="underline hover:text-slate-300">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    );
}