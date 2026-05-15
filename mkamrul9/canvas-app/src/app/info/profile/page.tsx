'use client';
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");

    const handleSave = () => {
        setIsEditing(false);
        // In production, dispatch API call to Prisma here to update user name
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-slate-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-violet-600/10 blur-[150px] pointer-events-none"></div>

            <nav className="h-16 border-b border-white/10 bg-white/[0.02] backdrop-blur-md px-8 flex items-center">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Link>
            </nav>

            <main className="max-w-2xl mx-auto p-8 py-12 relative z-10">
                <h1 className="text-3xl font-extrabold mb-8">Personal Profile</h1>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
                        <h3 className="text-lg font-bold">Account Details</h3>
                        <Button variant={isEditing ? "default" : "outline"} onClick={isEditing ? handleSave : () => setIsEditing(true)} className={isEditing ? "bg-violet-600 text-white" : "bg-white/5 border-white/10"}>
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><User className="w-4 h-4" /> Full Name</label>
                            <input disabled={!isEditing} value={name} onChange={(e) => setName(e.target.value)} className={`w-full bg-[#06090F] border rounded-lg p-3 text-white transition-all ${isEditing ? 'border-violet-500 ring-1 ring-violet-500 opacity-100' : 'border-white/10 opacity-70'}`} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-400 flex items-center gap-2 mb-1"><Mail className="w-4 h-4" /> Email Address</label>
                            <input disabled value={session?.user?.email || ""} className="w-full bg-[#06090F] border border-white/10 rounded-lg p-3 text-white opacity-50 cursor-not-allowed" title="Email is locked to OAuth provider" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}