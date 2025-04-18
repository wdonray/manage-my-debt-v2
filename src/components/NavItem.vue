<template>
  <NuxtLink :to="to" class="nav-item" :class="{ active }">
    <Icon :name="icon" size="24" />
    <span>{{ label }}</span>
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
  --color-nav-item-hover: var(--color-gray-600);
  --color-nav-item-text: var(--color-gray-100);
}

.dark {
  --color-nav-item-hover: var(--color-gray-700);
  --color-nav-item-text: var(--color-gray-50);
}
</style>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: var(--color-nav-item-text);
}

.nav-item.active {
  font-weight: 500;
  background-color: var(--color-accent);
}

.nav-item:hover:not(.active) {
  background-color: var(--color-nav-item-hover);
}
</style>
