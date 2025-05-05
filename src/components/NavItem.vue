<template>
  <NuxtLink :to="to" class="nav-item" :class="{ active }">
    <slot name="icon">
      <Icon :name="icon" size="24" />
    </slot>

    <slot name="label">
      <span>{{ label }}</span>
    </slot>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: string
  label: string
}>()

const active = computed(() => useRoute().path === props.to)
</script>

<style>
.light {
  --color-nav-item-hover: var(--color-gray-800);
  --color-nav-item-active: var(--color-gray-700);
  --color-nav-item-text: var(--color-gray-100);
}

.dark {
  --color-nav-item-hover: var(--color-gray-700);
  --color-nav-item-active: var(--color-gray-600);
  --color-nav-item-text: var(--color-gray-50);
}
</style>

<style scoped>
.nav-item {
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

.nav-item.active {
  background-color: var(--color-nav-item-active);
}

.nav-item:hover:not(.active) {
  background-color: var(--color-nav-item-hover);
}
</style>
