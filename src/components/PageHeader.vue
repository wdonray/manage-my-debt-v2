<template>
  <Flex stack gap="md" style="margin-bottom: var(--spacing-lg)">
    <Flex gap="md" align="center">
      <Flex gap="sm" align="center">
        <slot v-if="$slots.icon" name="icon" />
        <component :is="mobile ? 'h3' : 'h1'" style="margin: 0">
          <slot />
        </component>
      </Flex>
      <FlexSpace />
      <slot name="tools" />
    </Flex>

    <hr v-if="divider" style="margin: 0" />
  </Flex>
</template>

<script setup>
defineProps({
  divider: {
    type: Boolean,
    default: true,
  },
})

const { mobile } = useBreakpoint()
</script>
