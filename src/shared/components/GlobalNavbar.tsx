'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Sparkles, User, Settings, CreditCard, Keyboard, Star, LogIn, LayoutDashboard, LayoutTemplate, Blocks, Rocket, BookOpen, Users, PenTool, Code, Sun, Moon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from '@/shared/components/ui/dropdown-menu';
import KidrawLogo from '@/shared/components/KidrawLogo';

export default function GlobalNavbar() {
    const { data: session } = useSession();
    const { theme, setTheme } = useTheme();

    return (
        <nav className="h-16 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
            {/* Left Section: Logo & Breadcrumb */}
            <div className="flex items-center gap-6">
                <Link href="/?view=landing" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <KidrawLogo textClassName="font-bold text-lg text-foreground tracking-tight hidden sm:inline-block" />
                </Link>

                {session?.user && (
                    <div className="hidden md:flex items-center gap-4 text-sm font-medium">
                        <div className="w-px h-4 bg-border"></div>
                        <Link href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-300 hover:bg-violet-500/20 hover:text-violet-700 dark:hover:text-violet-200 transition-all font-semibold shadow-[0_0_15px_rgba(124,58,237,0.15)]">
                            <LayoutDashboard className="w-4 h-4" /> My Workspaces
                        </Link>
                    </div>
                )}
            </div>

            {/* Right Section: Actions & Avatar */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-foreground rounded-full" 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {session?.user ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <Avatar className="h-9 w-9 border-2 border-border shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                                    <AvatarImage src={session.user.image || ''} />
                                    <AvatarFallback className="bg-muted text-violet-500 font-bold">{session.user.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-popover border border-border text-popover-foreground shadow-2xl font-sans">
                                <DropdownMenuLabel className="font-normal pb-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none text-foreground">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuGroup className="py-1">
                                    <Link href="/?view=landing">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Sparkles className="w-4 h-4 mr-2 text-violet-500" /> View Landing Page</DropdownMenuItem>
                                    </Link>
                                    <Link href="/">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors md:hidden"><LayoutDashboard className="w-4 h-4 mr-2" /> My Workspaces</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/features">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Star className="w-4 h-4 mr-2 text-amber-500" /> App Features</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/templates">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><LayoutTemplate className="w-4 h-4 mr-2 text-fuchsia-500" /> Templates</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/integrations">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Blocks className="w-4 h-4 mr-2 text-rose-500" /> Integrations</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/changelog">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Rocket className="w-4 h-4 mr-2 text-cyan-500" /> Changelog</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuGroup className="py-1">
                                    <Link href="/info/help-center">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><BookOpen className="w-4 h-4 mr-2 text-emerald-500" /> Help Center</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/community">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Users className="w-4 h-4 mr-2 text-emerald-500" /> Community</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/blog">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><PenTool className="w-4 h-4 mr-2 text-amber-500" /> Blog</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/developers-api">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Code className="w-4 h-4 mr-2 text-blue-500" /> Developer API</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuGroup className="py-1">
                                    <Link href="/info/profile">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/settings">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                                    </Link>
                                    <Link href="/info/billing">
                                        <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem>
                                    </Link>
                                </DropdownMenuGroup>

                                <DropdownMenuSeparator className="bg-border" />
                                <Link href="/info/keyboard-shortcuts">
                                    <DropdownMenuItem className="cursor-pointer focus:bg-accent focus:text-accent-foreground rounded-md text-muted-foreground transition-colors"><Keyboard className="w-4 h-4 mr-2" /> Keyboard Shortcuts <DropdownMenuShortcut className="text-inherit opacity-70">⌘K</DropdownMenuShortcut></DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-md mt-1 transition-colors"><LogIn className="w-4 h-4 mr-2 rotate-180" /> Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/auth/signin">
                            <Button variant="ghost" className="hidden sm:flex text-foreground hover:bg-accent hover:text-accent-foreground rounded-xl font-medium">Log in</Button>
                        </Link>
                        <Link href="/auth/signin">
                            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(124,58,237,0.3)] border border-primary/50 rounded-xl font-bold transition-all px-6">
                                <Sparkles className="w-4 h-4 mr-2" /> Start Drawing
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
