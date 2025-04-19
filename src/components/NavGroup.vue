<template>
  <div class="nav-group">
    <button class="nav-group-header" @click="toggleSection">
      <Flex align="center" gap="md">
        <Flex align="center" gap="md">
          <slot name="icon">
            <Icon :name="icon" size="24" />
          </slot>
          <slot name="title">
            <span>{{ title }}</span>
          </slot>
        </Flex>

        <FlexSpace />

        <motion.div class="accordion-icon" :animate="animate" :transition>
          <Icon :name="reverse ? 'ph:caret-up' : 'ph:caret-down'" size="18" />
        </motion.div>
      </Flex>
    </button>

    <motion.div
      :id="`accordion-content-${title}`"
      class="accordion-content"
      :class="{ 'is-open': active }"
      role="region"
      :aria-labelledby="`accordion-header-${title}`"
      :initial="false"
      :animate="{ height: active ? 'auto' : 0 }"
      :transition
      :aria-hidden="!active"
    >
      <div class="nav-group-items">
        <slot />
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { motion } from 'motion-v'

const props = defineProps<{
  title?: string
  icon?: string
  reverse?: boolean
}>()

const transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
}

const animate = computed(() => {
  if (!props.reverse) {
    return { rotate: active.value ? 0 : 180 }
  }

  return { rotate: active.value ? 180 : 0 }
})

const active = useLocalStorage(`nav-group-${props.title}-active`, false)

function toggleSection() {
  active.value = !active.value
}
</script>

<style scoped>
.nav-group {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.nav-group-header {
  all: unset;
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-nav-item-text);
}

button:not(:disabled):active {
  background-color: transparent;
}

.nav-group-header .caret {
  margin-left: auto;
}

.nav-group-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding-left: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}
</style>
