import { ref, onMounted, onUnmounted } from 'vue'

export function useLocalStorage(key: string, def = undefined) {

  const value = ref(null)

  // ----- init 
  const init = () => {

    const serializedVal = localStorage.getItem(key)

    value.value = serializedVal !== null
      ? parseValue(serializedVal)
      : def

  }
  // ----- end init 

  // -- save
  const save = () => {
    localStorage.setItem(key, JSON.stringify(value.value))
  }
  // -- end save 


  let initialized = false

  // early init if possible.
  if (typeof window !== 'undefined') {

    init()
    initialized = true

  }

  function onStoredValueChange(event: StorageEvent): void {
    if (event.key === key) {
      value.value = event.newValue ? parseValue(event.newValue) : null
    }
  }

  onMounted(() => {
    console.log('mount called');

    if (!initialized) {
      console.log('init');
      init()
    }

    window.addEventListener('storage', onStoredValueChange, true)

  })

  onUnmounted(() => {

    save()
    window.removeEventListener('storage', onStoredValueChange)

  })

  return {
    value,
    save,
  }

}
// -----

function parseValue(serializedVal: string): string | any {
  let value = null
  try {
    value = JSON.parse(serializedVal)
  } catch {
    value = serializedVal
  }
  return value
}
