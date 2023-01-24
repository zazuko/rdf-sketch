<template>
  <ZazukoSketch />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ZazukoSketch from './components/Sketch.vue'

export default defineComponent({
  name: 'App',
  components: {
    ZazukoSketch
  }
})
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
