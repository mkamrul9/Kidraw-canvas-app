/**
 * Board Authorization Service
 * 
 * Provides centralized, canonical access control and capabilities resolution
 * for Kidraw boards, comments, snapshots, presence, and collaborators.
 */

export type BoardRole = 'owner' | 'editor' | 'viewer' | 'none';

export interface BoardCapabilities {
    canRead: boolean;
    canEdit: boolean;
    canComment: boolean;
    canResolveComment: boolean;
    canSnapshot: boolean;
    canManageCollaborators: boolean;
    canDelete: boolean;
}

export interface BoardCollaboratorRecord {
    id: string;
    email: string;
    role: string;
    boardId: string;
}

export interface BoardRecord {
    id: string;
    authorId: string | null;
    isPublic: boolean;
    publicRole: string; // 'viewer' | 'editor'
    collaborators?: BoardCollaboratorRecord[];
    [key: string]: any;
}

export interface AuthUser {
    id: string;
    email?: string | null;
    name?: string | null;
}

export interface BoardAccessResult<T = BoardRecord> {
    board: T | null;
    role: BoardRole;
    capabilities: BoardCapabilities;
    isOwner: boolean;
    isEditor: boolean;
    isViewer: boolean;
    isCollaborator: boolean;
    user: AuthUser | null;
}

const NO_CAPABILITIES: BoardCapabilities = {
    canRead: false,
    canEdit: false,
    canComment: false,
    canResolveComment: false,
    canSnapshot: false,
    canManageCollaborators: false,
    canDelete: false,
};

const OWNER_CAPABILITIES: BoardCapabilities = {
    canRead: true,
    canEdit: true,
    canComment: true,
    canResolveComment: true,
    canSnapshot: true,
    canManageCollaborators: true,
    canDelete: true,
};

const EDITOR_CAPABILITIES: BoardCapabilities = {
    canRead: true,
    canEdit: true,
    canComment: true,
    canResolveComment: true,
    canSnapshot: true,
    canManageCollaborators: false,
    canDelete: false,
};

const VIEWER_CAPABILITIES: BoardCapabilities = {
    canRead: true,
    canEdit: false,
    canComment: true, // Signed-in viewers can leave comments
    canResolveComment: false,
    canSnapshot: false,
    canManageCollaborators: false,
    canDelete: false,
};

const ANONYMOUS_VIEWER_CAPABILITIES: BoardCapabilities = {
    canRead: true,
    canEdit: false,
    canComment: false, // Anonymous viewers cannot comment
    canResolveComment: false,
    canSnapshot: false,
    canManageCollaborators: false,
    canDelete: false,
};

/**
 * Pure authorization function: resolves role and capabilities given board, user, and collaborators.
 */
export function resolveBoardCapabilities(
    board: BoardRecord | null,
    user: AuthUser | null
): { role: BoardRole; capabilities: BoardCapabilities; isCollaborator: boolean } {
    if (!board) {
        return { role: 'none', capabilities: NO_CAPABILITIES, isCollaborator: false };
    }

    const userId = user?.id || null;
    const userEmail = user?.email?.trim().toLowerCase() || null;

    // 1. Board Owner / Author
    if (userId && board.authorId && board.authorId === userId) {
        return { role: 'owner', capabilities: OWNER_CAPABILITIES, isCollaborator: false };
    }

    // 2. Direct Collaborator via normalized email
    let isCollaborator = false;
    if (userEmail && Array.isArray(board.collaborators)) {
        const collab = board.collaborators.find(
            c => c.email && c.email.trim().toLowerCase() === userEmail
        );
        if (collab) {
            isCollaborator = true;
            const normalizedRole = (collab.role || '').trim().toLowerCase();
            if (normalizedRole === 'editor') {
                return { role: 'editor', capabilities: EDITOR_CAPABILITIES, isCollaborator: true };
            }
            return { role: 'viewer', capabilities: VIEWER_CAPABILITIES, isCollaborator: true };
        }
    }

    // 3. Public Board
    if (board.isPublic) {
        const normalizedPublicRole = (board.publicRole || 'viewer').trim().toLowerCase();
        if (userId) {
            // Signed-in user on a public board
            if (normalizedPublicRole === 'editor') {
                return { role: 'editor', capabilities: EDITOR_CAPABILITIES, isCollaborator: false };
            }
            return { role: 'viewer', capabilities: VIEWER_CAPABILITIES, isCollaborator: false };
        } else {
            // Anonymous guest on a public board
            return { role: 'viewer', capabilities: ANONYMOUS_VIEWER_CAPABILITIES, isCollaborator: false };
        }
    }

    // 4. Orphaned private board (authorId is null and not public) or unauthorized user
    return { role: 'none', capabilities: NO_CAPABILITIES, isCollaborator: false };
}

/**
 * Database-backed board access resolution.
 */
export async function getBoardAccess(
    boardId: string,
    user: AuthUser | null,
    prismaClient?: any
): Promise<BoardAccessResult> {
    const db = prismaClient || (await import('@/shared/lib/prisma')).default;

    const board = await db.board.findUnique({
        where: { id: boardId },
        include: { collaborators: true },
    });

    if (!board) {
        return {
            board: null,
            role: 'none',
            capabilities: NO_CAPABILITIES,
            isOwner: false,
            isEditor: false,
            isViewer: false,
            isCollaborator: false,
            user,
        };
    }

    const { role, capabilities, isCollaborator } = resolveBoardCapabilities(board, user);

    return {
        board,
        role,
        capabilities,
        isOwner: role === 'owner',
        isEditor: role === 'editor',
        isViewer: role === 'viewer',
        isCollaborator,
        user,
    };
}
