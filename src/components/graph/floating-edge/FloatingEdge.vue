<script lang="ts" setup>
import { computed, type CSSProperties } from 'vue'
import type { EdgeProps, GraphNode, MarkerType } from '@vue-flow/core'
import { BaseEdge, getBezierPath, useVueFlow } from '@vue-flow/core'
import { getEdgeParams } from './floating-edge-utils'
const { fitView } = useVueFlow()

interface FloatingEdgeProps extends EdgeProps {
  id: string
  source: string
  target: string
  markerEndId?: string
  sourceNode: GraphNode
  targetNode: GraphNode
  style?: CSSProperties
  markerEnd: MarkerType | string
  markerStart: MarkerType | string
}

const props = defineProps<FloatingEdgeProps>()

const edgeParams = computed(() => getEdgeParams(props.sourceNode, props.targetNode))

const newEdgePath = computed(
  () => {
    if(!edgeParams.value.sx) {
      return '';
    }

    
    const sx = props.sourceX // < props.targetX ? props.sourceX  - 3 : props.sourceX + 3;
    const sy = props.sourceY;
    const sourcePos = props.sourcePosition;
      return getBezierPath({
        sourceX: sx,
        sourceY: sy,
        targetX: edgeParams.value.tx,
        targetY: edgeParams.value.ty,
        sourcePosition: sourcePos,
        targetPosition: edgeParams.value.targetPos,
      })
    }
)

</script>

<template>
  <BaseEdge :id="id" :path="newEdgePath[0]" :marker-start="markerStart" :marker-end="markerEnd" :style="style" />
</template>