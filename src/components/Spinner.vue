<template>
  <svg class="spinner" :width="size" :height="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g class="spinner-dots">
      <circle cx="12" cy="2.5" r="1.5" opacity=".14" fill="var(--color-accent)" />
      <circle cx="16.75" cy="3.77" r="1.5" opacity=".29" fill="var(--color-accent)" />
      <circle cx="20.23" cy="7.25" r="1.5" opacity=".43" fill="var(--color-accent)" />
      <circle cx="21.50" cy="12.00" r="1.5" opacity=".57" fill="var(--color-accent)" />
      <circle cx="20.23" cy="16.75" r="1.5" opacity=".71" fill="var(--color-accent)" />
      <circle cx="16.75" cy="20.23" r="1.5" opacity=".86" fill="var(--color-accent)" />
      <circle cx="12" cy="21.5" r="1.5" fill="var(--color-accent)" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  size: {
    type: [Number, String],
    default: 128,
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

.spinner-dots {
  transform-origin: center;
  animation: spinner-rotate 0.75s step-end infinite;
}

@keyframes spinner-rotate {
  8.3% {
    transform: rotate(30deg);
  }
  16.6% {
    transform: rotate(60deg);
  }
  25% {
    transform: rotate(90deg);
  }
  33.3% {
    transform: rotate(120deg);
  }
  41.6% {
    transform: rotate(150deg);
  }
  50% {
    transform: rotate(180deg);
  }
  58.3% {
    transform: rotate(210deg);
  }
  66.6% {
    transform: rotate(240deg);
  }
  75% {
    transform: rotate(270deg);
  }
  83.3% {
    transform: rotate(300deg);
  }
  91.6% {
    transform: rotate(330deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
