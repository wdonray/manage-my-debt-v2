<template>
  <Flex stack gap="xs" class="progress-container">
    <Flex align="center" gap="xs">
      <slot name="label">
        <span>{{ label }}</span>
      </slot>

      <FlexSpace />
      <h2 class="margin-0">{{ progress }}%</h2>
    </Flex>

    <div
      class="progress-bar"
      :class="[`variant-${variant}`, { 'with-segments': segments > 1 }]"
      role="progressbar"
      :aria-valuenow="progress"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-label="ariaLabel"
    >
      <div class="progress-fill" :style="{ width: `${progress}%` }">
        <div v-if="showAnimation" class="progress-animation" />
      </div>
      <template v-if="segments > 1">
        <div v-for="n in segments - 1" :key="n" class="segment-marker" :style="{ left: `${(n / segments) * 100}%` }" />
      </template>
    </div>

    <Flex v-if="$slots.context" class="progress-context">
      <slot name="context" />
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
interface Props {
  progress: number
  variant?: 'primary' | 'success' | 'warning' | 'error'
  height?: number
  showLabel?: boolean
  label?: string
  ariaLabel?: string
  showAnimation?: boolean
  segments?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  height: 8,
  showLabel: false,
  label: 'Progress',
  ariaLabel: 'Progress bar',
  showAnimation: true,
  segments: 1,
})
</script>

<style scoped>
.progress-container {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: v-bind('`${height}px`');
  background-color: var(--color-card-bg);
  border-radius: var(--radius-round);
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  border-radius: var(--radius-round);
  transition: width 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
}

/* Variant styles */
.variant-primary .progress-fill {
  background-color: var(--color-accent);
}

.variant-success .progress-fill {
  background-color: var(--color-notice-green);
}

.variant-warning .progress-fill {
  background-color: var(--color-notice-yellow-text);
}

.variant-error .progress-fill {
  background-color: var(--color-error);
}

/* Animation effect */
.progress-animation {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgb(var(--shadow) / 0) 0%,
    rgb(var(--shadow) / 0.15) 50%,
    rgb(var(--shadow) / 0) 100%
  );
  animation: shimmer 1.5s infinite ease-in-out;
}

/* Segment markers */
.with-segments {
  background-image: linear-gradient(to right, var(--color-border) 1px, transparent 1px);
}

.segment-marker {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: var(--color-border);
  z-index: 1;
}

.progress-context {
  color: var(--color-text-secondary);
  font-size: var(--text-small);
}

@keyframes shimmer {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
