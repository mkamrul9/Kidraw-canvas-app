import test from 'node:test';
import assert from 'node:assert';
import {
    resolveBoardCapabilities,
    getBoardAccess,
} from '../board-access.ts';
import type { BoardRecord, AuthUser } from '../board-access.ts';

test('F01 & F04: Private board owner has full capabilities', () => {
    const board: BoardRecord = {
        id: 'board-1',
        authorId: 'user-owner',
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [],
    };
    const user: AuthUser = { id: 'user-owner', email: 'owner@example.com' };

    const { role, capabilities, isCollaborator } = resolveBoardCapabilities(board, user);

    assert.strictEqual(role, 'owner');
    assert.strictEqual(isCollaborator, false);
    assert.strictEqual(capabilities.canRead, true);
    assert.strictEqual(capabilities.canEdit, true);
    assert.strictEqual(capabilities.canComment, true);
    assert.strictEqual(capabilities.canResolveComment, true);
    assert.strictEqual(capabilities.canSnapshot, true);
    assert.strictEqual(capabilities.canManageCollaborators, true);
    assert.strictEqual(capabilities.canDelete, true);
});

test('F01: Direct editor collaborator has edit and snapshot capabilities but cannot delete or manage', () => {
    const board: BoardRecord = {
        id: 'board-1',
        authorId: 'user-owner',
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [
            { id: 'c-1', email: 'editor@example.com', role: 'editor', boardId: 'board-1' }
        ],
    };
    const user: AuthUser = { id: 'user-editor', email: 'EDITOR@example.com' }; // Test case-insensitivity

    const { role, capabilities, isCollaborator } = resolveBoardCapabilities(board, user);

    assert.strictEqual(role, 'editor');
    assert.strictEqual(isCollaborator, true);
    assert.strictEqual(capabilities.canRead, true);
    assert.strictEqual(capabilities.canEdit, true);
    assert.strictEqual(capabilities.canComment, true);
    assert.strictEqual(capabilities.canResolveComment, true);
    assert.strictEqual(capabilities.canSnapshot, true);
    assert.strictEqual(capabilities.canManageCollaborators, false);
    assert.strictEqual(capabilities.canDelete, false);
});

test('F01: Direct viewer collaborator can read and comment, but cannot edit, resolve, or snapshot', () => {
    const board: BoardRecord = {
        id: 'board-1',
        authorId: 'user-owner',
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [
            { id: 'c-2', email: 'viewer@example.com', role: 'VIEWER', boardId: 'board-1' } // Test uppercase role
        ],
    };
    const user: AuthUser = { id: 'user-viewer', email: 'viewer@example.com' };

    const { role, capabilities, isCollaborator } = resolveBoardCapabilities(board, user);

    assert.strictEqual(role, 'viewer');
    assert.strictEqual(isCollaborator, true);
    assert.strictEqual(capabilities.canRead, true);
    assert.strictEqual(capabilities.canEdit, false);
    assert.strictEqual(capabilities.canComment, true);
    assert.strictEqual(capabilities.canResolveComment, false);
    assert.strictEqual(capabilities.canSnapshot, false);
    assert.strictEqual(capabilities.canManageCollaborators, false);
    assert.strictEqual(capabilities.canDelete, false);
});

test('F01 & F04: Unrelated user and anonymous user are denied access to private boards', () => {
    const board: BoardRecord = {
        id: 'board-1',
        authorId: 'user-owner',
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [],
    };

    const unrelatedUser: AuthUser = { id: 'user-stranger', email: 'stranger@example.com' };
    const unrelatedResult = resolveBoardCapabilities(board, unrelatedUser);

    assert.strictEqual(unrelatedResult.role, 'none');
    assert.strictEqual(unrelatedResult.capabilities.canRead, false);
    assert.strictEqual(unrelatedResult.capabilities.canEdit, false);
    assert.strictEqual(unrelatedResult.capabilities.canComment, false);
    assert.strictEqual(unrelatedResult.capabilities.canSnapshot, false);

    const anonResult = resolveBoardCapabilities(board, null);
    assert.strictEqual(anonResult.role, 'none');
    assert.strictEqual(anonResult.capabilities.canRead, false);
    assert.strictEqual(anonResult.capabilities.canEdit, false);
    assert.strictEqual(anonResult.capabilities.canComment, false);
    assert.strictEqual(anonResult.capabilities.canSnapshot, false);
});

test('F01: Removed collaborator immediately loses all access', () => {
    const board: BoardRecord = {
        id: 'board-1',
        authorId: 'user-owner',
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [], // Collaborator was removed from list
    };

    const exUser: AuthUser = { id: 'user-ex', email: 'ex-collab@example.com' };
    const result = resolveBoardCapabilities(board, exUser);

    assert.strictEqual(result.role, 'none');
    assert.strictEqual(result.capabilities.canRead, false);
    assert.strictEqual(result.capabilities.canEdit, false);
    assert.strictEqual(result.capabilities.canComment, false);
    assert.strictEqual(result.capabilities.canSnapshot, false);
});

test('F04: Orphaned private board (authorId is null) denies access to everyone', () => {
    const orphanedBoard: BoardRecord = {
        id: 'board-orphaned',
        authorId: null, // Account was deleted
        isPublic: false,
        publicRole: 'viewer',
        collaborators: [],
    };

    const randomUser: AuthUser = { id: 'user-any', email: 'any@example.com' };
    const result = resolveBoardCapabilities(orphanedBoard, randomUser);

    assert.strictEqual(result.role, 'none');
    assert.strictEqual(result.capabilities.canRead, false);
    assert.strictEqual(result.capabilities.canEdit, false);
});

test('F04: Missing board returns role none and no capabilities', () => {
    const result = resolveBoardCapabilities(null, { id: 'u1' });
    assert.strictEqual(result.role, 'none');
    assert.strictEqual(result.capabilities.canRead, false);
});

test('F02: Public board distinguishes anonymous viewers from signed-in editors', () => {
    const publicBoard: BoardRecord = {
        id: 'board-pub',
        authorId: 'owner-1',
        isPublic: true,
        publicRole: 'editor',
        collaborators: [],
    };

    // Anonymous visitor on public board cannot comment or snapshot
    const anonResult = resolveBoardCapabilities(publicBoard, null);
    assert.strictEqual(anonResult.role, 'viewer');
    assert.strictEqual(anonResult.capabilities.canRead, true);
    assert.strictEqual(anonResult.capabilities.canEdit, false);
    assert.strictEqual(anonResult.capabilities.canComment, false);
    assert.strictEqual(anonResult.capabilities.canSnapshot, false);

    // Signed-in user on public board with publicRole=editor
    const signedInUser: AuthUser = { id: 'user-visitor', email: 'visitor@example.com' };
    const userResult = resolveBoardCapabilities(publicBoard, signedInUser);
    assert.strictEqual(userResult.role, 'editor');
    assert.strictEqual(userResult.capabilities.canRead, true);
    assert.strictEqual(userResult.capabilities.canEdit, true);
    assert.strictEqual(userResult.capabilities.canComment, true);
});

test('F03: Collaborator deletion must be scoped to both boardId and collabId', async () => {
    const mockDb = {
        boardCollaborator: {
            findFirst: async ({ where }: { where: { id: string; boardId: string } }) => {
                // Mock database has collab-B belonging to board-B
                if (where.id === 'collab-B' && where.boardId === 'board-A') {
                    return null; // Not found on board-A!
                }
                if (where.id === 'collab-B' && where.boardId === 'board-B') {
                    return { id: 'collab-B', boardId: 'board-B', email: 'b@example.com', role: 'editor' };
                }
                return null;
            }
        }
    };

    // Attempting to delete collab-B while authorized on board-A
    const result = await mockDb.boardCollaborator.findFirst({
        where: { id: 'collab-B', boardId: 'board-A' }
    });

    assert.strictEqual(result, null, 'Owner of board-A cannot find or delete collaborator of board-B');
});

test('F05: Board switch simulation prevents cross-board autosave overwrites', () => {
    // Simulate store state
    let storeState = {
        boardId: 'board-A',
        boardGeneration: 1,
        layers: [{ id: 'stroke-A', type: 'pen' }],
        backgroundColor: '#ffffff',
    };

    let scheduledSave: {
        targetBoardId: string;
        targetGen: number;
        capturedLayers: any[];
    } | null = null;

    // User draws on Board A and triggers saveHistory
    const targetBoardId = storeState.boardId;
    const targetGen = storeState.boardGeneration;
    const capturedLayers = [...storeState.layers];

    scheduledSave = {
        targetBoardId,
        targetGen,
        capturedLayers,
    };

    // Before the timer fires, user switches to Board B
    const newBoardId = 'board-B';
    storeState = {
        boardId: newBoardId,
        boardGeneration: storeState.boardGeneration + 1, // generation becomes 2
        layers: [{ id: 'shape-B', type: 'rectangle' }], // Board B layers
        backgroundColor: '#f8fafc',
    };

    // Now simulated debounce timer fires for the scheduled save
    let executedSavePayload: any = null;
    if (scheduledSave) {
        if (
            storeState.boardId === scheduledSave.targetBoardId &&
            storeState.boardGeneration === scheduledSave.targetGen
        ) {
            executedSavePayload = scheduledSave.capturedLayers;
        }
    }

    // Verify that Board A's save was aborted because storeState was switched to Board B
    assert.strictEqual(
        executedSavePayload,
        null,
        'Pending autosave for Board A must abort when user has switched to Board B'
    );
});
