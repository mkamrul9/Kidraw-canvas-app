import { Layer } from '../types';

/**
 * Normalizes text to be safe inside Mermaid node brackets.
 */
function sanitizeText(text: string): string {
    return text.replace(/["\[\]\(\)\{\}]/g, '').replace(/\n/g, ' ');
}

export function exportToMermaid(layers: Layer[]): string {
    const nodes: string[] = [];
    const links: string[] = [];
    
    // Create a mapping from Layer UUID to a simpler Mermaid node ID
    const idMap = new Map<string, string>();
    let idCounter = 1;

    // 1. Identify structural nodes (shapes and text)
    const nodeLayers = layers.filter(l => 
        (l.type === 'rectangle' || l.type === 'ellipse' || l.type === 'diamond' || l.type === 'hexagon' || l.type === 'sticky') && l.text
    );

    nodeLayers.forEach(layer => {
        const nodeId = `N${idCounter++}`;
        idMap.set(layer.id, nodeId);
        
        const label = sanitizeText(layer.text || '');
        
        // Use different Mermaid brackets depending on shape
        if (layer.type === 'ellipse') {
            nodes.push(`    ${nodeId}(${label})`);
        } else if (layer.type === 'diamond') {
            nodes.push(`    ${nodeId}{${label}}`);
        } else if (layer.type === 'hexagon') {
            nodes.push(`    ${nodeId}{{${label}}}`);
        } else {
            // Rectangle and Sticky
            nodes.push(`    ${nodeId}[${label}]`);
        }
    });

    // 2. Identify arrows linking the nodes
    const arrowLayers = layers.filter(l => l.type === 'arrow' && l.startBinding && l.endBinding);
    
    arrowLayers.forEach(arrow => {
        if (arrow.startBinding && arrow.endBinding) {
            const startId = idMap.get(arrow.startBinding.elementId);
            const endId = idMap.get(arrow.endBinding.elementId);
            
            if (startId && endId) {
                // Determine if there is text on the arrow (if we supported arrow labels)
                const label = arrow.text ? `|${sanitizeText(arrow.text)}|` : '';
                links.push(`    ${startId} -->${label} ${endId}`);
            }
        }
    });

    if (nodes.length === 0) {
        return `%% No structural nodes with text were found to export.
graph TD
    A[Draw some labeled shapes and connect them!]`;
    }

    // 3. Assemble Mermaid graph
    return `graph TD
${nodes.join('\n')}

${links.length > 0 ? links.join('\n') : '    %% No connected arrows found.'}
`;
}
