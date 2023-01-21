import { ref, onMounted, onUnmounted } from 'vue'

export function useLocalStorage(key: string, def = undefined) {

  const value = ref(null)

  const init = () => {

    const serializedVal = localStorage.getItem(key)

    value.value = serializedVal !== null
      ? parseValue(serializedVal)
      : def

  }

  const save = () => {

    localStorage.setItem(key, JSON.stringify(value.value))

  }

  let initialized = false

  // early init if possible.
  if (typeof window !== 'undefined') {

    init()
    initialized = true

  }

  function onStoredValueChange(e) {

    if (e.key === key) {

      value.value = e.newValue ? parseValue(e.newValue) : null

    }

  }

  onMounted(() => {

    if (!initialized) {

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

function parseValue(serializedVal) {

  let value = null
  try {

    value = JSON.parse(serializedVal)

  } catch {

    value = serializedVal

  }

  return value

}
