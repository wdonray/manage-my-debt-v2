<template>
  <Card border class="summary-card">
    <Flex stack>
      <Flex align="center" gap="sm">
        <Icon v-if="icon" :name="icon" size="24" :style="{ color }" />
        <slot name="title">
          <span class="text-secondary">{{ title }}</span>
        </slot>
        <FlexSpace />
        <slot name="actions" />
      </Flex>

      <slot />
    </Flex>
  </Card>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string
  title?: string
  color?: string
  secondary?: string
}>()
</script>

<style scoped>
.summary-card {
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  transition: width 0.2s ease;
  background-color: v-bind('color');
}
</style>
