import { Layer } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface LibraryItem {
    id: string;
    name: string;
    description: string;
    category: 'Templates' | 'UI Components';
    createLayers: (centerX: number, centerY: number) => Layer[];
}

export const LIBRARY_ITEMS: LibraryItem[] = [
    // ─── TEMPLATES ───────────────────────────────────────────────────────────
    {
        id: 'tmpl-flowchart',
        name: 'Flowchart',
        description: 'A standard process flowchart with a decision branch and smart connecting arrows.',
        category: 'Templates',
        createLayers: (centerX, centerY) => {
            const frameId = uuidv4();
            const startId = uuidv4();
            const decisionId = uuidv4();
            const yesId = uuidv4();
            const noId = uuidv4();

            const startTextId = uuidv4();
            const decisionTextId = uuidv4();
            const yesTextId = uuidv4();
            const noTextId = uuidv4();

            const arrow1Id = uuidv4();
            const arrow2Id = uuidv4();
            const arrow3Id = uuidv4();

            return [
                // Outer Frame
                {
                    id: frameId,
                    type: 'frame',
                    x: centerX - 350,
                    y: centerY - 250,
                    width: 700,
                    height: 500,
                    fill: 'rgba(148, 163, 184, 0.03)',
                    text: 'Process Flowchart',
                },
                // Start Node (Rectangle)
                {
                    id: startId,
                    type: 'rectangle',
                    parentId: frameId,
                    x: centerX - 75,
                    y: centerY - 180,
                    width: 150,
                    height: 50,
                    fill: '#4f46e5', // Indigo
                },
                {
                    id: startTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX - 20,
                    y: centerY - 165,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Start',
                    fontSize: 15,
                },
                // Decision Node (Diamond)
                {
                    id: decisionId,
                    type: 'diamond',
                    parentId: frameId,
                    x: centerX - 60,
                    y: centerY - 60,
                    width: 120,
                    height: 120,
                    fill: '#0ea5e9', // Sky Blue
                },
                {
                    id: decisionTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX - 30,
                    y: centerY - 10,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Is Valid?',
                    fontSize: 14,
                },
                // Yes Node (Rectangle)
                {
                    id: yesId,
                    type: 'rectangle',
                    parentId: frameId,
                    x: centerX + 150,
                    y: centerY - 25,
                    width: 150,
                    height: 50,
                    fill: '#10b981', // Emerald
                },
                {
                    id: yesTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX + 195,
                    y: centerY - 10,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Approve',
                    fontSize: 15,
                },
                // No Node (Rectangle)
                {
                    id: noId,
                    type: 'rectangle',
                    parentId: frameId,
                    x: centerX - 300,
                    y: centerY - 25,
                    width: 150,
                    height: 50,
                    fill: '#ef4444', // Red
                },
                {
                    id: noTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX - 250,
                    y: centerY - 10,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Reject',
                    fontSize: 15,
                },
                // Arrow 1: Start to Decision
                {
                    id: arrow1Id,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX,
                    y: centerY - 130,
                    width: 0,
                    height: 70,
                    fill: '#94a3b8', // Slate
                    startBinding: { elementId: startId, snapPoint: 'bottom' },
                    endBinding: { elementId: decisionId, snapPoint: 'top' },
                },
                // Arrow 2: Decision to Yes
                {
                    id: arrow2Id,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX + 60,
                    y: centerY,
                    width: 90,
                    height: 0,
                    fill: '#94a3b8',
                    startBinding: { elementId: decisionId, snapPoint: 'right' },
                    endBinding: { elementId: yesId, snapPoint: 'left' },
                },
                // Arrow 3: Decision to No
                {
                    id: arrow3Id,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX - 60,
                    y: centerY,
                    width: -90,
                    height: 0,
                    fill: '#94a3b8',
                    startBinding: { elementId: decisionId, snapPoint: 'left' },
                    endBinding: { elementId: noId, snapPoint: 'right' },
                },
            ];
        },
    },
    {
        id: 'tmpl-kanban',
        name: 'Kanban Board',
        description: 'A 3-column project board (To Do, In Progress, Done) with pre-filled sticky tasks.',
        category: 'Templates',
        createLayers: (centerX, centerY) => {
            const mainFrameId = uuidv4();
            const todoFrameId = uuidv4();
            const inprogressFrameId = uuidv4();
            const doneFrameId = uuidv4();

            const todoStickyId = uuidv4();
            const inprogressStickyId = uuidv4();
            const doneStickyId = uuidv4();

            return [
                // Outer Container Frame
                {
                    id: mainFrameId,
                    type: 'frame',
                    x: centerX - 450,
                    y: centerY - 250,
                    width: 900,
                    height: 500,
                    fill: 'rgba(148, 163, 184, 0.02)',
                    text: 'Kanban Board',
                },
                // To Do Column Frame
                {
                    id: todoFrameId,
                    type: 'frame',
                    parentId: mainFrameId,
                    x: centerX - 420,
                    y: centerY - 200,
                    width: 260,
                    height: 420,
                    fill: 'rgba(148, 163, 184, 0.05)',
                    text: 'To Do 🎯',
                },
                // In Progress Column Frame
                {
                    id: inprogressFrameId,
                    type: 'frame',
                    parentId: mainFrameId,
                    x: centerX - 130,
                    y: centerY - 200,
                    width: 260,
                    height: 420,
                    fill: 'rgba(148, 163, 184, 0.05)',
                    text: 'In Progress ⚡',
                },
                // Done Column Frame
                {
                    id: doneFrameId,
                    type: 'frame',
                    parentId: mainFrameId,
                    x: centerX + 160,
                    y: centerY - 200,
                    width: 260,
                    height: 420,
                    fill: 'rgba(148, 163, 184, 0.05)',
                    text: 'Done 🎉',
                },
                // Sticky Note 1: To Do
                {
                    id: todoStickyId,
                    type: 'sticky',
                    parentId: todoFrameId,
                    x: centerX - 390,
                    y: centerY - 150,
                    width: 200,
                    height: 100,
                    fill: '#fecde8', // Pink
                    text: 'Draft database architecture',
                },
                // Sticky Note 2: In Progress
                {
                    id: inprogressStickyId,
                    type: 'sticky',
                    parentId: inprogressFrameId,
                    x: centerX - 100,
                    y: centerY - 150,
                    width: 200,
                    height: 100,
                    fill: '#fed7aa', // Orange/Yellow
                    text: 'Develop Templates & UI Library sidebar',
                },
                // Sticky Note 3: Done
                {
                    id: doneStickyId,
                    type: 'sticky',
                    parentId: doneFrameId,
                    x: centerX + 190,
                    y: centerY - 150,
                    width: 200,
                    height: 100,
                    fill: '#bbf7d0', // Green
                    text: 'Optimize canvas resizing & performance lags',
                },
            ];
        },
    },
    {
        id: 'tmpl-mindmap',
        name: 'Mind Map',
        description: 'A centralized brain-mapping structure branching out to sub-topics.',
        category: 'Templates',
        createLayers: (centerX, centerY) => {
            const frameId = uuidv4();
            const rootId = uuidv4();
            const branchAId = uuidv4();
            const branchBId = uuidv4();
            const branchCId = uuidv4();

            const rootTextId = uuidv4();
            const branchATextId = uuidv4();
            const branchBTextId = uuidv4();
            const branchCTextId = uuidv4();

            const arrowAId = uuidv4();
            const arrowBId = uuidv4();
            const arrowCId = uuidv4();

            return [
                // Outer Frame
                {
                    id: frameId,
                    type: 'frame',
                    x: centerX - 400,
                    y: centerY - 250,
                    width: 800,
                    height: 500,
                    fill: 'rgba(148, 163, 184, 0.03)',
                    text: 'Brainstorming Map',
                },
                // Central Topic (Ellipse)
                {
                    id: rootId,
                    type: 'ellipse',
                    parentId: frameId,
                    x: centerX - 80,
                    y: centerY - 30,
                    width: 160,
                    height: 60,
                    fill: '#a855f7', // Purple
                },
                {
                    id: rootTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX - 35,
                    y: centerY - 10,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Central Topic',
                    fontSize: 14,
                },
                // Branch A (Top Right)
                {
                    id: branchAId,
                    type: 'ellipse',
                    parentId: frameId,
                    x: centerX + 180,
                    y: centerY - 140,
                    width: 120,
                    height: 50,
                    fill: '#3b82f6', // Blue
                },
                {
                    id: branchATextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX + 215,
                    y: centerY - 125,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Marketing',
                    fontSize: 13,
                },
                // Branch B (Bottom Right)
                {
                    id: branchBId,
                    type: 'ellipse',
                    parentId: frameId,
                    x: centerX + 180,
                    y: centerY + 90,
                    width: 120,
                    height: 50,
                    fill: '#ec4899', // Pink
                },
                {
                    id: branchBTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX + 225,
                    y: centerY + 105,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Product',
                    fontSize: 13,
                },
                // Branch C (Left Side)
                {
                    id: branchCId,
                    type: 'ellipse',
                    parentId: frameId,
                    x: centerX - 300,
                    y: centerY - 25,
                    width: 120,
                    height: 50,
                    fill: '#eab308', // Yellow
                },
                {
                    id: branchCTextId,
                    type: 'text',
                    parentId: frameId,
                    x: centerX - 265,
                    y: centerY - 10,
                    width: 100,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Finance',
                    fontSize: 13,
                },
                // Connecting Arrow A
                {
                    id: arrowAId,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX + 80,
                    y: centerY,
                    width: 100,
                    height: -115,
                    fill: '#c084fc',
                    startBinding: { elementId: rootId, snapPoint: 'right' },
                    endBinding: { elementId: branchAId, snapPoint: 'left' },
                },
                // Connecting Arrow B
                {
                    id: arrowBId,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX + 80,
                    y: centerY,
                    width: 100,
                    height: 115,
                    fill: '#c084fc',
                    startBinding: { elementId: rootId, snapPoint: 'right' },
                    endBinding: { elementId: branchBId, snapPoint: 'left' },
                },
                // Connecting Arrow C
                {
                    id: arrowCId,
                    type: 'arrow',
                    parentId: frameId,
                    x: centerX - 80,
                    y: centerY,
                    width: -100,
                    height: 0,
                    fill: '#c084fc',
                    startBinding: { elementId: rootId, snapPoint: 'left' },
                    endBinding: { elementId: branchCId, snapPoint: 'right' },
                },
            ];
        },
    },

    // ─── UI COMPONENTS ───────────────────────────────────────────────────────
    {
        id: 'comp-button',
        name: 'Button',
        description: 'Standard modern call-to-action button widget.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const btnId = uuidv4();
            const labelId = uuidv4();
            return [
                {
                    id: btnId,
                    type: 'rectangle',
                    x: centerX - 70,
                    y: centerY - 20,
                    width: 140,
                    height: 40,
                    fill: '#6366f1', // Indigo button
                },
                {
                    id: labelId,
                    type: 'text',
                    x: centerX - 25,
                    y: centerY - 9,
                    width: 100,
                    height: 25,
                    fill: '#ffffff',
                    text: 'Click Me',
                    fontSize: 14,
                },
            ];
        },
    },
    {
        id: 'comp-input',
        name: 'Input Field',
        description: 'Interactive text input element with placeholder text.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const inpId = uuidv4();
            const textId = uuidv4();
            return [
                {
                    id: inpId,
                    type: 'rectangle',
                    x: centerX - 90,
                    y: centerY - 20,
                    width: 180,
                    height: 40,
                    fill: '#1e293b', // slate-800 background
                },
                {
                    id: textId,
                    type: 'text',
                    x: centerX - 75,
                    y: centerY - 9,
                    width: 150,
                    height: 25,
                    fill: '#64748b', // placeholder color
                    text: 'Enter text...',
                    fontSize: 14,
                },
            ];
        },
    },
    {
        id: 'comp-card',
        name: 'Card Container',
        description: 'A layout card container with separate title and body elements.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const cardId = uuidv4();
            const titleId = uuidv4();
            const bodyId = uuidv4();
            return [
                {
                    id: cardId,
                    type: 'rectangle',
                    x: centerX - 125,
                    y: centerY - 80,
                    width: 250,
                    height: 160,
                    fill: '#1e293b',
                },
                {
                    id: titleId,
                    type: 'text',
                    x: centerX - 105,
                    y: centerY - 60,
                    width: 210,
                    height: 30,
                    fill: '#ffffff',
                    text: 'Card Title',
                    fontSize: 16,
                },
                {
                    id: bodyId,
                    type: 'text',
                    x: centerX - 105,
                    y: centerY - 25,
                    width: 210,
                    height: 80,
                    fill: '#94a3b8',
                    text: 'This is a description section inside the card template.',
                    fontSize: 13,
                },
            ];
        },
    },
    {
        id: 'comp-toggle',
        name: 'Toggle Switch',
        description: 'A modern green active toggle slider widget.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const pillId = uuidv4();
            const knobId = uuidv4();
            return [
                {
                    id: pillId,
                    type: 'ellipse',
                    x: centerX - 25,
                    y: centerY - 13,
                    width: 50,
                    height: 26,
                    fill: '#10b981', // green pill
                },
                {
                    id: knobId,
                    type: 'ellipse',
                    x: centerX + 2,
                    y: centerY - 9,
                    width: 18,
                    height: 18,
                    fill: '#ffffff', // knob circle
                },
            ];
        },
    },
    {
        id: 'comp-checkbox',
        name: 'Checkbox Option',
        description: 'Selected checkbox widget with a descriptive text label.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const boxId = uuidv4();
            const checkId = uuidv4();
            const labelId = uuidv4();
            return [
                {
                    id: boxId,
                    type: 'rectangle',
                    x: centerX - 80,
                    y: centerY - 10,
                    width: 20,
                    height: 20,
                    fill: '#6366f1',
                },
                {
                    id: checkId,
                    type: 'text',
                    x: centerX - 76,
                    y: centerY - 9,
                    width: 15,
                    height: 15,
                    fill: '#ffffff',
                    text: '✓',
                    fontSize: 12,
                },
                {
                    id: labelId,
                    type: 'text',
                    x: centerX - 45,
                    y: centerY - 10,
                    width: 120,
                    height: 20,
                    fill: '#e2e8f0',
                    text: 'Option Item',
                    fontSize: 14,
                },
            ];
        },
    },
    {
        id: 'comp-dropdown',
        name: 'Dropdown Selector',
        description: 'A dropdown selection control with an overlayed indicator.',
        category: 'UI Components',
        createLayers: (centerX, centerY) => {
            const dropId = uuidv4();
            const textId = uuidv4();
            const iconId = uuidv4();
            return [
                {
                    id: dropId,
                    type: 'rectangle',
                    x: centerX - 90,
                    y: centerY - 20,
                    width: 180,
                    height: 40,
                    fill: '#1e293b',
                },
                {
                    id: textId,
                    type: 'text',
                    x: centerX - 75,
                    y: centerY - 9,
                    width: 120,
                    height: 25,
                    fill: '#e2e8f0',
                    text: 'Select option...',
                    fontSize: 14,
                },
                {
                    id: iconId,
                    type: 'text',
                    x: centerX + 55,
                    y: centerY - 9,
                    width: 20,
                    height: 20,
                    fill: '#94a3b8',
                    text: '▼',
                    fontSize: 12,
                },
            ];
        },
    },
];
