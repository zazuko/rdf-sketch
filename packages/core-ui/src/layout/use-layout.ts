import ELK from 'elkjs/lib/elk.bundled.js';

import { type Node, type Edge } from '@vue-flow/core'

const headerHeight = 76;
const rowHeight = 52;

/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {

    async function elkLayout(nodes: any[], edges: any[]) {

        const options = {
            "algorithm": "layered",                                      // Best for directed graphs (RDF)
            "org.eclipse.elk.direction": "RIGHT",                        // Subject on left -> Object on right
            
            // Layering strategies
            "org.eclipse.elk.layered.layering.strategy": "NETWORK_SIMPLEX", // Groups nodes efficiently
            "org.eclipse.elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
            
            // Edge routing
            "org.eclipse.elk.edgeRouting": "ORTHOGONAL",                 // Use clean right-angle lines
            "org.eclipse.elk.layered.crossingMinimization.strategy": "LAYER_SWEEP", // Actively prevents tangled lines
            
            // Spacing
            "org.eclipse.elk.spacing.nodeNode": "900",                   // Vertical space between nodes in the same layer
            "org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers": "1200", // Horizontal space between layers
            "org.eclipse.elk.spacing.edgeNode": "150",                   // Space between edges and nodes
            "org.eclipse.elk.spacing.edgeEdge": "75",                   // Space between parallel edges
        };

        const elkNodes: any[] = nodes.map((node) => {
            const elkW = node.dimensions?.width || 1000;
            const elkH = node.dimensions?.height || (headerHeight + rowHeight * node.data.resource.properties.length);
            return {
                id: node.id,
                width: elkW,
                height: elkH,
                labels: [{ text: node.data.resource.name }],
                // Map properties to ELK Ports so the routing algorithm knows the exact vertical origin
                ports: node.data.resource.properties.map((property: any, index: number) => {
                    return {
                        id: `${node.id}-${property.id}`, // Unique port ID per node
                        width: 1,
                        height: 1,
                        // Tell ELK this port is roughly at this vertical offset on the right side
                        properties: {
                            "org.eclipse.elk.port.side": "EAST",
                            "org.eclipse.elk.port.index": index,
                        }
                    }
                }),
            }
        });

        const elkEdges = edges.map((edge) => {
            return {
                id: edge.id, // e.g. "source-prop-target"
                sources: [edge.source],
                targets: [edge.target],
                // Tell elk exactly which port (property) on the source node this edge comes from
                sourcePort: `${edge.source}-${edge.data?.sourceProperty}` 
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
