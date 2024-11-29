import ELK from 'elkjs/lib/elk.bundled.js';

import { type Node, type Edge } from '@vue-flow/core'

const headerHeight = 76;
const rowHeight = 52;

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {

    async function elkLayout(nodes: Node[], edges: Edge[]) {

        const options = {
            "algorithm": "mrtree",                                       // MRTREE algorithm for tree layout
            "org.eclipse.elk.direction": "RIGHT",                         // Layout direction (can be UP, DOWN, LEFT, RIGHT)
            "org.eclipse.elk.spacing.nodeNode": "400",                    // Space between nodes
            "org.eclipse.elk.spacing.edgeEdge": "20",                    // Space between edges
            "org.eclipse.elk.spacing.edgeNode": "30",                    // Space between nodes and edges
            "org.eclipse.elk.mrtree.spacing.level": "500",                // Space between levels in the tree
            "org.eclipse.elk.mrtree.compaction.strategy": "DOWN",        // Compaction strategy
            "org.eclipse.elk.mrtree.nodePlacement.strategy": "SIMPLE",   // Simple node placement strategy
            "org.eclipse.elk.mrtree.nodePlacement.bk.fixedAlignment": "BALANCED", // Balanced alignment for nodes
        };

        const elkNodes: any[] = nodes.map((node) => {
            return {
                id: node.id,
                width: 1000,
                height: headerHeight + rowHeight * node.data.resource.properties.length,
                labels: [{ text: node.data.resource.name }],
                properties: node.data.resource.properties.map((property) => {
                    return {
                        id: property.id,
                        width: 1000,
                        height: rowHeight,
                        labels: [{ text: property.name }],
                    }
                }),
            }
        });

        const elkEdges = edges.map((edge) => {
            return {
                id: `${edge.source}-${edge.target}`,
                sources: [edge.source],
                targets: [edge.target],
            }
        });

        const graph = {
            id: 'root',
            layoutOptions: options,
            children: elkNodes,
            edges: elkEdges,
        };



        const elk = new ELK();

        return elk
            .layout(graph as any)
            .then((layoutedGraph) => {
                const nodesWithPosition = nodes.map(node => {
                    const elkNode = layoutedGraph.children.find((n) => n.id === node.id)
                    node.position = { x: elkNode.x, y: elkNode.y }
                    return node;
                });

                for (const edge of edges) {
                    const sourceNode = nodesWithPosition.find((node) => node.id === edge.source)
                    const targetNode = nodesWithPosition.find((node) => node.id === edge.target)

                    if (sourceNode.position.x < targetNode.position.x) {
                        const handlePosition = `right`;
                        const currentSourceHandle = edge.sourceHandle;
                        if (!currentSourceHandle.endsWith(handlePosition)) {
                            // remove the word right from the end of the string 
                            edge.sourceHandle = currentSourceHandle.slice(0, -5)
                            edge.sourceHandle = `${edge.sourceHandle}${handlePosition}`

                        }
                    } else {
                        const handlePosition = `left`;
                        const currentSourceHandle = edge.sourceHandle;
                        if (!currentSourceHandle.endsWith(handlePosition)) {
                            // remove the word left from the end of the string 
                            edge.sourceHandle = currentSourceHandle.slice(0, -5)
                            edge.sourceHandle = `${edge.sourceHandle}${handlePosition}`

                        }
                    }



                }
                return {
                    nodes: nodesWithPosition,
                    edges: edges,
                }
            })
            .catch(console.error);

    }

    return { elkLayout }
}
