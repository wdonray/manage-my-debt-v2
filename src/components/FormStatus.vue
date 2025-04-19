<template>
  <div v-auto-animate>
    <div v-if="showStatus" class="form-status" :class="{ unsaved, saving }">
      <Icon v-if="saving" name="ph:cloud-arrow-up" size="14" class="blink" style="color: var(--color-primary)" />
      <Icon v-else-if="unsaved" name="ph:warning-circle" size="14" style="color: var(--color-error)" />
      <Icon v-else name="ph:check-circle" size="14" style="color: var(--color-success)" />
      <span class="status-text">{{ statusText }}</span>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  unsaved: {
    type: Boolean,
    default: false,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  showStatus: {
    type: Boolean,
    default: false,
  },
})

const statusText = computed(() => {
  if (props.saving) return 'Saving...'
  if (props.unsaved) return 'Unsaved'
  return 'Saved'
})
</script>

<style scoped>
.form-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--text-xsmall);
  z-index: 100;
}

.status-text {
  font-weight: 500;
}

.blink {
  animation: blink 1s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
