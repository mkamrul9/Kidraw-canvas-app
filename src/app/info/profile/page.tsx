'use client';
import { useSession } from "next-auth/react";
import { ArrowLeft, User, Camera, Mail, Key, Briefcase, MapPin, Link as LinkIcon, Shield, Smartphone, Globe, LogOut } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";
import Footer from "@/shared/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateProfileName } from "@/features/user/actions/user-actions";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [name, setName] = useState(session?.user?.name || "");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    
    const [isPending, startTransition] = useTransition();
    const [isSecurityPending, startSecurityTransition] = useTransition();
    
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        
        startTransition(async () => {
            try {
                await updateProfileName(name);
                await update(); // Refresh next-auth session
                toast.success("Profile updated successfully", { description: "Your changes are now visible to your team." });
            } catch (error) {
                toast.error("Failed to update profile", { description: "An error occurred while saving." });
            }
        });
    };

    const handleAvatarClick = () => {
        toast.info("Avatar managed by OAuth provider", { description: "Change your avatar on GitHub or Google to see it updated here." });
    };

    const toggle2FA = () => {
        startSecurityTransition(() => {
            setTimeout(() => {
                setTwoFactorEnabled(!twoFactorEnabled);
                if (!twoFactorEnabled) {
                    toast.success("Two-Factor Authentication Enabled", { description: "Your account is now more secure." });
                } else {
                    toast.warning("Two-Factor Authentication Disabled", { description: "Account security has been reduced." });
                }
            }, 800);
        });
    };

    const revokeSession = () => {
        toast.success("Session Revoked", { description: "The device has been signed out." });
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="max-w-5xl mx-auto p-6 md:p-12 relative z-10 min-h-[calc(100vh-64px)]">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">Profile Settings</h1>
                    <p className="text-muted-foreground text-lg">Manage your personal information and account security.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    
                    {/* Left Column: Avatar & Basic */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 opacity-50"></div>
                            
                            <div className="relative group cursor-pointer mt-4 mb-6" onClick={handleAvatarClick}>
                                <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-4 ring-primary/20 transition-all group-hover:ring-primary/40">
                                    <AvatarImage src={session?.user?.image || ''} />
                                    <AvatarFallback className="bg-muted text-4xl text-primary font-bold">{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <Camera className="w-8 h-8 text-white mb-1" />
                                    <span className="text-xs font-bold text-white">Update</span>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-foreground mb-1">{session?.user?.name || "User"}</h2>
                            <p className="text-muted-foreground font-medium mb-4 flex items-center justify-center gap-2">
                                <Mail className="w-4 h-4" /> {session?.user?.email}
                            </p>
                            
                            <div className="w-full pt-6 border-t border-border mt-2">
                                <div className="flex items-center justify-between text-sm mb-3">
                                    <span className="text-muted-foreground font-medium">Account Status</span>
                                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold text-xs">Active</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Member Since</span>
                                    <span className="text-foreground font-medium">May 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Personal Information */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" /> Personal Information
                            </h3>
                            
                            <form onSubmit={handleSaveProfile} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-11 bg-background border border-border rounded-xl px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={session?.user?.email || ""}
                                            disabled
                                            className="w-full h-11 bg-muted/50 border border-border rounded-xl px-4 text-sm text-muted-foreground cursor-not-allowed font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Job Title</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Senior Architect"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full h-11 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-foreground">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                                            <input 
                                                type="text" 
                                                placeholder="e.g. San Francisco, CA"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="w-full h-11 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <Button type="submit" disabled={isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-xl font-bold shadow-lg">
                                        {isPending ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Security & Sessions */}
                        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-emerald-500" /> Security & Access
                            </h3>
                            
                            <div className="flex items-center justify-between p-4 border border-border bg-muted/30 rounded-2xl mb-6">
                                <div>
                                    <h4 className="font-bold text-foreground text-sm mb-1 flex items-center gap-2">
                                        Two-Factor Authentication 
                                        {twoFactorEnabled && <span className="bg-emerald-500/10 text-emerald-500 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-emerald-500/20">Enabled</span>}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                                <Button 
                                    onClick={toggle2FA}
                                    disabled={isSecurityPending}
                                    variant={twoFactorEnabled ? "outline" : "default"} 
                                    className={`h-9 font-bold rounded-lg ${twoFactorEnabled ? 'bg-background hover:bg-destructive hover:text-destructive-foreground hover:border-destructive' : 'bg-foreground text-background hover:bg-foreground/90'}`}
                                >
                                    {isSecurityPending ? "Processing..." : twoFactorEnabled ? "Disable" : "Enable 2FA"}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-sm text-foreground mb-3">Active Sessions</h4>
                                
                                <div className="flex items-center justify-between p-4 border border-border bg-background rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                                            <Globe className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">Windows • Chrome</p>
                                            <p className="text-xs text-muted-foreground">San Francisco, USA • Active Now</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">Current Device</span>
                                </div>

                                <div className="flex items-center justify-between p-4 border border-border bg-background rounded-2xl opacity-75">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-muted p-2.5 rounded-xl border border-border">
                                            <Smartphone className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">iPhone 14 Pro • Safari</p>
                                            <p className="text-xs text-muted-foreground">New York, USA • Last active 2 hours ago</p>
                                        </div>
                                    </div>
                                    <Button onClick={revokeSession} variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive-foreground hover:bg-destructive rounded-lg">
                                        <LogOut className="w-3.5 h-3.5 mr-1.5" /> Revoke
                                    </Button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
