import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getServerSession(authOptions);

    // If not logged in, show a beautiful landing page
    if (!session?.user) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
                <h1 className="text-4xl font-bold mb-4">Canvas Pro</h1>
                <p className="text-slate-600 mb-8">Please log in to manage your whiteboards.</p>
                <Link href="/api/auth/signin">
                    <Button className="bg-slate-900"><LogIn className="w-4 h-4 mr-2" /> Log In</Button>
                </Link>
            </div>
        );
    }

    // Fetch only the boards belonging to this user
    const boards = await prisma.board.findMany({
        where: { authorId: session.user.id },
        orderBy: { updatedAt: 'desc' }
    });

    // Server Action to create a new board
    async function createNewBoard() {
        'use server';
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return;

        const newId = uuidv4();
        await prisma.board.create({
            data: {
                id: newId,
                authorId: session.user.id,
                title: "New Whiteboard",
                layers: [],
                backgroundColor: "#ffffff"
            }
        });
        redirect(`/board/${newId}`);
    }

    return (
        <main className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Whiteboards</h1>
                    <form action={createNewBoard}>
                        <Button type="submit"><Plus className="w-4 h-4 mr-2" /> New Board</Button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {boards.length === 0 ? (
                        <p className="text-slate-500 col-span-3">No boards found. Create one to get started!</p>
                    ) : (
                        boards.map((board) => (
                            <Link key={board.id} href={`/board/${board.id}`}>
                                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-40 flex flex-col justify-between">
                                    <h3 className="font-semibold text-lg">{board.title}</h3>
                                    <span className="text-xs text-slate-400">
                                        Updated {new Date(board.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
}