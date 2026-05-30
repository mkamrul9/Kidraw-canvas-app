import { getServerSession } from "next-auth";
import { authOptions } from "@/features/auth/config";
import prisma from "@/shared/lib/prisma";
import LandingPage from "@/features/landing/components/LandingPage";
import DashboardView from "@/features/dashboard/components/DashboardView";

/**
 * Root page — thin wrapper that delegates to feature components.
 * Shows Landing page for guests (or when ?view=landing), Dashboard for authenticated users.
 */
export default async function DashboardOrLanding({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
    const resolvedParams = await searchParams;
    const view = resolvedParams.view;
    const session = await getServerSession(authOptions);

    // View 1: Landing page (guest or forced via ?view=landing)
    if (!session?.user || view === 'landing') {
        return <LandingPage isAuthenticated={!!session?.user} />;
    }

    // View 2: Authenticated dashboard
    const boards = await prisma.board.findMany({ where: { authorId: session.user.id }, orderBy: { updatedAt: 'desc' } });

    return <DashboardView session={session} boards={boards} />;
}