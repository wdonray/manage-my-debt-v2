<template>
  <Button
    class="btn-text"
    style="color: var(--appearance-toggle-color)"
    @click="toggleColorMode"
    :aria-label="colorMode.preference === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
  >
    <Icon :name="appearanceIconName" size="24" aria-hidden="true" />
  </Button>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const appearanceIconName = computed(() => (colorMode.preference === 'light' ? 'ph:moon-fill' : 'ph:sun-dim-fill'))

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>
