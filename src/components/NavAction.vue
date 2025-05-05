<template>
  <div class="nav-action">
    <slot name="label">
      <span>{{ label }}</span>
    </slot>
    <FlexSpace />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<style scoped>
.nav-action {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: 0;
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: var(--text-small);
  color: var(--color-nav-item-text);
}
</style>
