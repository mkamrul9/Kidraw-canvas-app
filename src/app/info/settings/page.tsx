'use client';
import { Settings, Bell, Palette, Globe, Monitor, Trash2, Check, ExternalLink, Mail } from "lucide-react";
import GlobalNavbar from "@/shared/components/GlobalNavbar";
import Footer from "@/shared/components/Footer";
import { Button } from "@/shared/components/ui/button";
import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/shared/components/ui/dialog";
import { useTheme } from "next-themes";
import { getUserSettings, updateNotificationSettings, deleteAccount } from "@/features/user/actions/user-actions";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [emails, setEmails] = useState(true);
    const [marketingEmails, setMarketingEmails] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isDeleting, startDeleteTransition] = useTransition();
    
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        getUserSettings().then(user => {
            if (user) {
                setEmails(user.receiveEmails);
            }
        });
    }, []);

    const handleEmailToggle = () => {
        const newValue = !emails;
        setEmails(newValue);
        startTransition(async () => {
            try {
                await updateNotificationSettings(newValue);
                toast.success(newValue ? "Essential Emails Subscribed" : "Essential Emails Unsubscribed");
            } catch (error) {
                setEmails(!newValue); // revert on failure
                toast.error("Failed to update settings");
            }
        });
    };

    const handleMarketingToggle = () => {
        setMarketingEmails(!marketingEmails);
        toast.success(!marketingEmails ? "Marketing Emails Subscribed" : "Marketing Emails Unsubscribed");
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (deleteConfirmation !== "DELETE") {
            toast.error("Please type DELETE to confirm");
            return;
        }

        startDeleteTransition(async () => {
            try {
                await deleteAccount();
                toast.success("Account deleted successfully");
                signOut({ callbackUrl: '/' });
            } catch (error) {
                toast.error("Failed to delete account");
            }
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden font-sans selection:bg-violet-500/30">
            {/* Background Layers */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full animate-float-slow"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(124,58,237,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,58,237,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            </div>

            <GlobalNavbar />

            <main className="max-w-4xl mx-auto p-6 md:p-12 relative z-10 min-h-[calc(100vh-64px)]">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">App Settings</h1>
                    <p className="text-muted-foreground text-lg">Customize your workspace experience and preferences.</p>
                </div>

                <div className="space-y-8">
                    
                    {/* General Preferences */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" /> General Preferences
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border bg-muted/30 rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-violet-500" /> Interface Theme</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Select or customize your UI theme.</p>
                                </div>
                                <div className="flex items-center gap-2 bg-background p-1.5 rounded-xl border border-border">
                                    <button onClick={() => setTheme('light')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'light' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Light</button>
                                    <button onClick={() => setTheme('dark')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${theme === 'dark' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Dark</button>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border bg-muted/30 rounded-2xl">
                                <div>
                                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2"><Globe className="w-4 h-4 text-blue-500" /> Language & Region</h4>
                                    <p className="text-xs text-muted-foreground mt-1">Set your preferred language and timezone.</p>
                                </div>
                                <select className="bg-background border border-border text-foreground text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/50">
                                    <option value="en">English (US)</option>
                                    <option value="es">Español</option>
                                    <option value="fr">Français</option>
                                    <option value="de">Deutsch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-amber-500" /> Notifications
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-border bg-background rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                                        <Monitor className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Essential Updates</p>
                                        <p className="text-xs text-muted-foreground">Product updates, security alerts, and billing info.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleEmailToggle}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${emails ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${emails ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 border border-border bg-background rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                                        <Mail className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Marketing & Tips</p>
                                        <p className="text-xs text-muted-foreground">Weekly newsletters, tutorials, and promotional offers.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleMarketingToggle}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${marketingEmails ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Connected Accounts */}
                    <div className="bg-card border border-border rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-fuchsia-500" /> Connected Accounts
                        </h3>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 border border-border bg-background rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">GitHub</p>
                                        <p className="text-xs text-emerald-500 font-medium">Connected</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 border-border">Disconnect</Button>
                            </div>
                            <div className="flex-1 border border-border bg-background rounded-2xl p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">Google</p>
                                        <p className="text-xs text-muted-foreground font-medium">Not Connected</p>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" className="h-8 border-border">Connect</Button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-destructive/5 border border-destructive/20 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-destructive mb-2 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Danger Zone
                        </h3>
                        <p className="text-muted-foreground text-sm mb-6 max-w-2xl">Permanently delete your account and all associated workspaces. This action cannot be undone and will instantly remove your access.</p>
                        
                        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="font-bold rounded-xl h-10 px-6">Delete Account...</Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border border-destructive/20 sm:max-w-[425px]">
                                <DialogHeader className="mb-4">
                                    <DialogTitle className="text-destructive text-xl font-bold flex items-center gap-2"><Trash2 className="w-5 h-5" /> Confirm Deletion</DialogTitle>
                                    <DialogDescription className="text-foreground font-medium mt-3">
                                        Are you absolutely sure? This will permanently delete your account and remove your data from our servers.
                                    </DialogDescription>
                                </DialogHeader>
                                
                                <form onSubmit={handleDeleteAccount}>
                                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl mb-6">
                                        <label className="text-sm font-bold text-destructive block mb-2">Type "DELETE" to confirm</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={deleteConfirmation}
                                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                                            placeholder="DELETE"
                                            className="w-full h-10 bg-background border border-destructive/30 rounded-lg px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 font-mono"
                                        />
                                    </div>
                                    
                                    <DialogFooter className="gap-2 sm:gap-0">
                                        <Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} className="rounded-xl border-border">Cancel</Button>
                                        <Button type="submit" variant="destructive" disabled={isDeleting || deleteConfirmation !== "DELETE"} className="rounded-xl font-bold">
                                            {isDeleting ? "Deleting..." : "Permanently Delete"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
