import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, LayoutDashboard, FileEdit } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="z-10 flex flex-col items-center text-center">
                    <div className="bg-blue-600 p-4 rounded-2xl mb-6 shadow-xl shadow-blue-500/20">
                        <FileEdit className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-slate-900">Canvas Pro</h1>
                    <p className="text-lg text-slate-600 mb-8 max-w-md">
                        The professional, real-time collaborative whiteboard built for modern engineering teams.
                    </p>
                    <Link href="/api/auth/signin">
                        <Button
                            size="lg"
                            className="bg-slate-900 hover:bg-slate-800 text-md px-8 rounded-full shadow-lg transition-transform hover:scale-105"
                        >
                            <LogIn className="w-5 h-5 mr-2" /> Get Started Free
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const boards = await prisma.board.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: "desc" },
    });

    async function createNewBoard() {
        "use server";
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return;

        const newId = uuidv4();
        await prisma.board.create({
            data: {
                id: newId,
                authorId: session.user.id,
                title: "Untitled Whiteboard",
                layers: [],
                backgroundColor: "#ffffff"
            }
        });
        redirect(`/board/${newId}`);
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <nav className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <FileEdit className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-800 tracking-tight">Canvas Pro</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-9 w-9 border-2 border-slate-100 hover:border-blue-500 transition-colors cursor-pointer">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {session.user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-slate-500">
                            {session.user.email}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="text-red-600 font-medium cursor-pointer">
                                Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <main className="flex-1 max-w-6xl w-full mx-auto p-8">
                <div className="flex justify-between items-center mb-8 mt-4">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-6 h-6 text-slate-700" />
                        <h1 className="text-2xl font-bold text-slate-900">Recent Boards</h1>
                    </div>
                    <form action={createNewBoard}>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-md transition-transform hover:scale-105"
                        >
                            <Plus className="w-4 h-4 mr-2" /> New Board
                        </Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {boards.length === 0 ? (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                            <p className="text-slate-500 font-medium mb-4">No boards yet. Start creating!</p>
                            <form action={createNewBoard}>
                                <Button type="submit" variant="outline" className="rounded-full">
                                    Create your first board
                                </Button>
                            </form>
                        </div>
                    ) : (
                        boards.map((board) => (
                            <Link key={board.id} href={`/board/${board.id}`} className="group">
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300">
                                    <div className="h-32 bg-slate-100 border-b border-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]"></div>
                                        <FileEdit className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors z-10" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-slate-800 truncate">{board.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Edited {new Date(board.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}