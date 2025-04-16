<template>
  <motion.div
    class="spinner"
    :animate="{ rotate: 360 }"
    :transition="{ duration: 1, repeat: Infinity, ease: 'linear' }"
  >
    <svg :width="size" :height="size" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="2"
        fill="none"
        stroke-dasharray="60"
        stroke-dashoffset="0"
      />
    </svg>
  </motion.div>
</template>

<script setup>
import { motion } from 'motion-v'

defineProps({
  size: {
    type: [Number, String],
    default: 48,
  },
})
</script>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  padding: var(--spacing-lg);
  color: var(--color-accent);
}

.spinner svg {
  opacity: 0.7;
}
</style>
