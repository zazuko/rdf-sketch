import dagre from '@dagrejs/dagre'
import ELK from 'elkjs/lib/elk.bundled.js';

import { Position, useVueFlow, type Node, type Edge } from '@vue-flow/core'
import { ref } from 'vue'

const headerHeight = 76;
const rowHeight = 52;

const width = 800
const height = 800
/**
 * Composable to run the layout algorithm on the graph.
 * It uses the `dagre` library to calculate the layout of the nodes and edges.
 */
export function useLayout() {
    const { findNode } = useVueFlow()

    const graph = ref(new dagre.graphlib.Graph())


    function layout(nodes: Node[], edges: Edge[], direction: string) {
        // we create a new graph instance, in case some nodes/edges were removed, otherwise dagre would act as if they were still there
        const dagreGraph = new dagre.graphlib.Graph()
        dagreGraph.setDefaultEdgeLabel(() => ({}))

        const isHorizontal = direction === 'LR' || direction === 'RL'
        const layoutConfig = {
            rankdir: direction,
            nodesep: 600,
            ranksep: 300,
            marginx: 100,
            marginy: 100,
            ranker: 'network-simplex',
        }
        dagreGraph.setGraph(layoutConfig)


        for (const node of nodes) {
            // if you need width+height of nodes for your layout, you can use the dimensions property of the internal node (`GraphNode` type)
            const graphNode = findNode(node.id)
            dagreGraph.setNode(node.id, { width: graphNode?.dimensions.width || width, height: graphNode?.dimensions.height || height })
        }

        for (const edge of edges) {
            dagreGraph.setEdge(edge.source, edge.target)
        }

        dagre.layout(dagreGraph)

        // update the sourceHandle of the edges based on the position of the source and target nodes
        for (const edge of edges) {
            const sourceNode = dagreGraph.node(edge.source)
            const targetNode = dagreGraph.node(edge.target)

            if (sourceNode.x < targetNode.x) {
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

        // set nodes with updated positions
        return nodes.map((node) => {
            const nodeWithPosition = dagreGraph.node(node.id)

            return {
                ...node,
                targetPosition: isHorizontal ? Position.Left : Position.Top,
                sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
                position: { x: nodeWithPosition.x, y: nodeWithPosition.y },
            }
        })
    }


    async function elkLayout(nodes: Node[], edges: Edge[]) {
        /**
         * * sporeOverlap: This algorithm is based on the Spore algorithm, which is a force-directed layout algorithm. It is designed to minimize the number of edge crossings and to keep the nodes evenly distributed. It is particularly useful for large graphs.
         * * force: This algorithm is based on a force-directed layout algorithm. It is designed to minimize the number of edge crossings and to keep the nodes evenly distributed. It is particularly useful for large graphs.
        *
        const options = {
            'elk.algorithm': 'box',
            'elk.layered.spacing.nodeNodeBetweenLayers': '100',
            'elk.spacing.nodeNode': '200',
        };
        /*
        const options = {
            'elk.algorithm': 'force',
            'elk.force.iterations': '1000', // Number of iterations for the force algorithm
            'elk.force.repulsiveForce': '1000', // Strength of the repulsive force
            'elk.force.attractiveForce': '0.1', // Strength of the attractive force
            'elk.force.gravityForce': '0.1', // Strength of the gravity force
            'elk.force.compoundGravity': '0.5', // Strength of the compound gravity force
            'elk.force.mass': '1', // Mass of the nodes
            'elk.force.damping': '0.9', // Damping factor for the force algorithm
            'elk.force.stiffness': '0.1', // Stiffness of the springs
            'elk.force.charge': '-30', // Charge of the nodes
            'elk.force.center': 'true', // Whether to center the layout
        };
        */
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

        const isHorizontal = options['org.eclipse.elk.direction'] === 'RIGHT';

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


        /*const graph = {
            id: 'root',
            layoutOptions: options,
            children: nodes.map((node) => ({
                ...node,
                // Adjust the target and source handle positions based on the layout
                // direction.
                targetPosition: isHorizontal ? 'left' : 'top',
                sourcePosition: isHorizontal ? 'right' : 'bottom',

                // Hardcode a width and height for elk to use when layouting.
                width: 1000,
                height: headerHeight + rowHeight * node.data.resource.properties.length,
            })),
            edges: edges,
        };*/

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
        //



    }

    return { graph, layout, elkLayout }
}
