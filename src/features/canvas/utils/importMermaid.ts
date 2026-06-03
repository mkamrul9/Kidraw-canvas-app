import { v4 as uuidv4 } from 'uuid';
import { Layer } from '../types';

interface ParsedNode {
    id: string;
    text: string;
    type: 'rectangle' | 'ellipse' | 'diamond' | 'hexagon';
}

interface ParsedEdge {
    from: string;
    to: string;
}

export function importMermaid(mermaidCode: string): Layer[] {
    const lines = mermaidCode.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    let direction = 'TD';
    const nodes = new Map<string, ParsedNode>();
    const edges: ParsedEdge[] = [];

    // Basic Regex
    // Node def: A[Text], B(Text), C{Text}, D{{Text}}
    // Edge: A --> B, A -.-> B, A ==> B
    
    // First pass: extract direction and explicit node definitions
    for (const line of lines) {
        if (line.startsWith('graph ') || line.startsWith('flowchart ')) {
            direction = line.split(' ')[1] || 'TD';
            continue;
        }

        // Try to match edges first to extract implicit nodes
        // e.g. NodeA --> NodeB
        const edgeMatch = line.match(/^([a-zA-Z0-9_]+)\s*(?:-->|-\.->|==>|---|-\.-|===)\s*([a-zA-Z0-9_]+)$/);
        if (edgeMatch) {
            const from = edgeMatch[1];
            const to = edgeMatch[2];
            edges.push({ from, to });
            if (!nodes.has(from)) nodes.set(from, { id: from, text: from, type: 'rectangle' });
            if (!nodes.has(to)) nodes.set(to, { id: to, text: to, type: 'rectangle' });
            continue;
        }

        // Try to match node with text definition
        // We match: ID then brackets then text
        // e.g., A[Hello] or B(World) or C{Diamond} or D{{Hexagon}}
        const nodeMatch = line.match(/^([a-zA-Z0-9_]+)\s*(?:(\{\{|\[|\(|\{)(.+?)(?:\}\}|\]|\)|\}))$/);
        if (nodeMatch) {
            const id = nodeMatch[1];
            const bracket = nodeMatch[2];
            const text = nodeMatch[3];

            let type: 'rectangle' | 'ellipse' | 'diamond' | 'hexagon' = 'rectangle';
            if (bracket === '{{') type = 'hexagon';
            else if (bracket === '{') type = 'diamond';
            else if (bracket === '(') type = 'ellipse';
            else if (bracket === '[') type = 'rectangle';

            nodes.set(id, { id, text, type });
        }
    }

    // Graph Layout Algorithm (Simple Rank-based)
    const nodeRanks = new Map<string, number>();
    const incomingEdgesCount = new Map<string, number>();
    
    for (const id of nodes.keys()) {
        incomingEdgesCount.set(id, 0);
        nodeRanks.set(id, 0);
    }

    for (const edge of edges) {
        incomingEdgesCount.set(edge.to, (incomingEdgesCount.get(edge.to) || 0) + 1);
    }

    // Topological Sort / BFS to assign ranks
    const queue: string[] = [];
    for (const [id, count] of incomingEdgesCount.entries()) {
        if (count === 0) queue.push(id);
    }

    // Prevent infinite loop if cyclic
    let iterations = 0;
    while (queue.length > 0 && iterations < 1000) {
        iterations++;
        const current = queue.shift()!;
        const currentRank = nodeRanks.get(current) || 0;

        for (const edge of edges) {
            if (edge.from === current) {
                const targetRank = nodeRanks.get(edge.to) || 0;
                if (currentRank + 1 > targetRank) {
                    nodeRanks.set(edge.to, currentRank + 1);
                    queue.push(edge.to);
                }
            }
        }
    }

    // Group nodes by rank
    const ranks = new Map<number, string[]>();
    for (const [id, rank] of nodeRanks.entries()) {
        if (!ranks.has(rank)) ranks.set(rank, []);
        ranks.get(rank)!.push(id);
    }

    // Calculate layout
    const X_SPACING = 250;
    const Y_SPACING = 200;
    const isTD = direction === 'TD' || direction === 'TB';

    const generatedLayers: Layer[] = [];
    const nodeIdToLayerId = new Map<string, string>();

    // Generate Shapes
    for (const [rank, ids] of ranks.entries()) {
        const numNodes = ids.length;
        for (let i = 0; i < numNodes; i++) {
            const id = ids[i];
            const node = nodes.get(id)!;
            
            const layerId = uuidv4();
            nodeIdToLayerId.set(id, layerId);

            let x = 0;
            let y = 0;

            if (isTD) {
                y = rank * Y_SPACING;
                x = (i - (numNodes - 1) / 2) * X_SPACING;
            } else {
                x = rank * X_SPACING;
                y = (i - (numNodes - 1) / 2) * Y_SPACING;
            }

            // Move graph to center of view roughly
            x += 400;
            y += 400;

            generatedLayers.push({
                id: layerId,
                type: node.type,
                x,
                y,
                width: 150,
                height: 80,
                fill: '#ffffff',
                stroke: '#1e293b',
                text: node.text,
            });
        }
    }

    // Generate Arrows
    for (const edge of edges) {
        const fromLayerId = nodeIdToLayerId.get(edge.from);
        const toLayerId = nodeIdToLayerId.get(edge.to);

        if (fromLayerId && toLayerId) {
            let startSnap: any = isTD ? 'bottom' : 'right';
            let endSnap: any = isTD ? 'top' : 'left';

            generatedLayers.push({
                id: uuidv4(),
                type: 'arrow',
                x: 0, y: 0, width: 0, height: 0,
                points: [0,0,0,0],
                fill: '#1e293b',
                stroke: '#1e293b',
                connectorStyle: 'curved',
                startBinding: { elementId: fromLayerId, snapPoint: startSnap },
                endBinding: { elementId: toLayerId, snapPoint: endSnap }
            });
        }
    }

    return generatedLayers;
}
