'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/config';
import prisma from '@/shared/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { redirect } from 'next/navigation';
import { Layer } from '@/features/canvas/types';

/**
 * Server action to create a new board.
 * Extracted from page.tsx to separate server-side logic from UI.
 */
export async function createNewBoard(formData: FormData) {
    const currentSession = await getServerSession(authOptions);
    if (!currentSession?.user?.id) return;

    const title = (formData.get('title') as string) || 'Untitled Whiteboard';
    const description = formData.get('description') as string;
    const template = (formData.get('template') as string) || 'blank';
    const newId = uuidv4();

    let initialLayers: any[] = []; // Using any to bypass prisma strict JSON checking for the insert

    if (template === 'flowchart') {
        const id1 = uuidv4();
        const id2 = uuidv4();
        const id3 = uuidv4();
        
        initialLayers = [
            { id: id1, type: 'rectangle', x: 400, y: 100, width: 200, height: 80, fill: '#8b5cf6', stroke: '#5b21b6', text: 'Start Process' },
            { id: uuidv4(), type: 'arrow', x: 500, y: 180, width: 0, height: 100, fill: '#000000', startBinding: { elementId: id1, snapPoint: 'bottom' }, endBinding: { elementId: id2, snapPoint: 'top' } },
            { id: id2, type: 'diamond', x: 425, y: 280, width: 150, height: 150, fill: '#3b82f6', stroke: '#1d4ed8', text: 'Decision?' },
            { id: uuidv4(), type: 'arrow', x: 500, y: 430, width: 0, height: 100, fill: '#000000', startBinding: { elementId: id2, snapPoint: 'bottom' }, endBinding: { elementId: id3, snapPoint: 'top' } },
            { id: id3, type: 'rectangle', x: 400, y: 530, width: 200, height: 80, fill: '#10b981', stroke: '#047857', text: 'End Process' }
        ];
    } else if (template === 'wireframe') {
        initialLayers = [
            // Browser window frame
            { id: uuidv4(), type: 'rectangle', x: 200, y: 100, width: 800, height: 600, fill: '#f1f5f9', stroke: '#cbd5e1' },
            // Header
            { id: uuidv4(), type: 'rectangle', x: 200, y: 100, width: 800, height: 60, fill: '#ffffff', stroke: '#cbd5e1' },
            // Logo placeholder
            { id: uuidv4(), type: 'ellipse', x: 220, y: 115, width: 30, height: 30, fill: '#94a3b8' },
            // Sidebar
            { id: uuidv4(), type: 'rectangle', x: 200, y: 160, width: 200, height: 540, fill: '#ffffff', stroke: '#cbd5e1' },
            // Sidebar items
            { id: uuidv4(), type: 'rectangle', x: 220, y: 190, width: 160, height: 20, fill: '#e2e8f0' },
            { id: uuidv4(), type: 'rectangle', x: 220, y: 230, width: 160, height: 20, fill: '#e2e8f0' },
            { id: uuidv4(), type: 'rectangle', x: 220, y: 270, width: 160, height: 20, fill: '#e2e8f0' },
            // Main content area hero
            { id: uuidv4(), type: 'rectangle', x: 440, y: 190, width: 520, height: 200, fill: '#e2e8f0', stroke: '#cbd5e1' },
            // Cards
            { id: uuidv4(), type: 'rectangle', x: 440, y: 430, width: 160, height: 200, fill: '#ffffff', stroke: '#cbd5e1' },
            { id: uuidv4(), type: 'rectangle', x: 620, y: 430, width: 160, height: 200, fill: '#ffffff', stroke: '#cbd5e1' },
            { id: uuidv4(), type: 'rectangle', x: 800, y: 430, width: 160, height: 200, fill: '#ffffff', stroke: '#cbd5e1' },
            // Text annotation
            { id: uuidv4(), type: 'text', x: 440, y: 60, width: 200, height: 30, fill: '#000000', text: 'App Dashboard Wireframe', fontSize: 24 }
        ];
    } else if (template === 'architecture') {
        const web = uuidv4();
        const api1 = uuidv4();
        const api2 = uuidv4();
        const db = uuidv4();

        initialLayers = [
            // Client
            { id: web, type: 'rectangle', x: 200, y: 300, width: 150, height: 80, fill: '#3b82f6', stroke: '#1d4ed8', text: 'Web Client' },
            
            // APIs
            { id: api1, type: 'rectangle', x: 500, y: 200, width: 150, height: 80, fill: '#10b981', stroke: '#047857', text: 'Auth Service' },
            { id: api2, type: 'rectangle', x: 500, y: 400, width: 150, height: 80, fill: '#10b981', stroke: '#047857', text: 'Data Service' },
            
            // Database
            { id: db, type: 'rectangle', x: 800, y: 300, width: 150, height: 100, fill: '#f59e0b', stroke: '#b45309', text: 'PostgreSQL DB' },

            // Connections
            { id: uuidv4(), type: 'arrow', x: 350, y: 340, width: 150, height: -100, fill: '#000000', startBinding: { elementId: web, snapPoint: 'right' }, endBinding: { elementId: api1, snapPoint: 'left' } },
            { id: uuidv4(), type: 'arrow', x: 350, y: 340, width: 150, height: 100, fill: '#000000', startBinding: { elementId: web, snapPoint: 'right' }, endBinding: { elementId: api2, snapPoint: 'left' } },
            
            { id: uuidv4(), type: 'arrow', x: 650, y: 240, width: 150, height: 110, fill: '#000000', startBinding: { elementId: api1, snapPoint: 'right' }, endBinding: { elementId: db, snapPoint: 'left' } },
            { id: uuidv4(), type: 'arrow', x: 650, y: 440, width: 150, height: -90, fill: '#000000', startBinding: { elementId: api2, snapPoint: 'right' }, endBinding: { elementId: db, snapPoint: 'left' } },
            
            { id: uuidv4(), type: 'text', x: 400, y: 100, width: 300, height: 40, fill: '#000000', text: 'System Architecture', fontSize: 32 }
        ];
    }

    await prisma.board.create({
        data: {
            id: newId,
            authorId: currentSession.user.id,
            title,
            description,
            layers: initialLayers,
            backgroundColor: '#ffffff',
        },
    });

    redirect(`/board/${newId}`);
}
