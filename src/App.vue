<template>
  <Sketch />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Sketch from './components/Sketch.vue'

export default defineComponent({
  name: 'App',
  components: {
    Sketch
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
