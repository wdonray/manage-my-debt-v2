<template>
  <Button
    class="btn-text"
    :class="{ outline }"
    style="color: var(--appearance-toggle-color)"
    :aria-label="colorMode.preference === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="toggleColorMode"
  >
    <Icon :name="appearanceIconName" :size aria-hidden="true" />
  </Button>
</template>

<script setup lang="ts">
defineProps({
  size: { type: Number, default: 24 },
  outline: { type: Boolean, default: false },
})

const colorMode = useColorMode()

const appearanceIconName = computed(() => (colorMode.preference === 'light' ? 'ph:moon-fill' : 'ph:sun-dim-fill'))

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>

<style>
.light {
  --hover-color: var(--color-gray-700);
}

.dark {
  --hover-color: var(--color-gray-600);
}
</style>

<style scoped>
.outline {
  border: 1px solid var(--color-gray-300);
  padding: var(--spacing-xs);
}

.outline:hover {
  background-color: var(--hover-color);
}
</style>
