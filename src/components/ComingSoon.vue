<template>
  <Notice type="info" align="flex-start">
    <template #icon>
      <Icon name="ph:clock" size="28" />
    </template>

    <Flex stack gap="md">
      <h2 class="margin-0">Coming Soon</h2>
      <span class="text-secondary">{{ message }}</span>
      <span>Stay tuned for updates!</span>
    </Flex>
  </Notice>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: "We're building something special for you.",
  },
})
</script>
