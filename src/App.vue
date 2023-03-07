<template>
  <ZazukoSketch />
</template>

<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { onBeforeUnmount, onMounted } from 'vue';
import ZazukoSketch from './components/Sketch.vue'


let registration: ServiceWorkerRegistration | null = null
function updateAvailable(event: any) {
  registration = event.detail
  refreshApp()
}
function refreshApp() {
  // Make sure we only send a 'skip waiting' message if the SW is waiting
  if (registration && registration.waiting) {
    // Send message to SW to skip the waiting and activate the new SW
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })
  }
}
function reloadApp() {
  window.location.reload()
}
onMounted(() => {
  document.addEventListener('swUpdated', updateAvailable, { once: true })
  navigator.serviceWorker.addEventListener('controllerchange', reloadApp)
})

onBeforeUnmount(() => {
  document.addEventListener('swUpdated', updateAvailable)
  navigator.serviceWorker.removeEventListener('controllerchange', reloadApp)
})
</script>

<script lang="ts">

export default {
  name: 'App'
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
