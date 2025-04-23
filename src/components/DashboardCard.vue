<template>
  <Card border class="summary-card" :class="{ 'no-border': hideBorder }">
    <Flex stack gap="xl">
      <Flex v-if="$slots.title || $slots.actions" :align="mobile ? 'start' : 'center'" gap="sm" :stack="mobile">
        <slot name="title" />
        <FlexSpace />
        <slot name="actions" />
      </Flex>
      <slot />
    </Flex>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  hideBorder?: boolean
}>()

const { mobile } = useBreakpoint()
</script>

<style>
.light {
  --color-summary-bg: var(--color-gray-50);
  --color-summary-border: var(--color-gray-200);
}

.dark {
  --color-summary-bg: var(--color-gray-900);
  --color-summary-border: var(--color-gray-600);
}
</style>

<style scoped>
.card.border.summary-card {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background-color: var(--color-summary-bg);
}

.card.border.summary-card:not(.no-border)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.2s ease;
  background-color: var(--color-summary-border);
}
</style>
