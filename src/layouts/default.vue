<template>
  <div class="layout" v-if="mounted">
    <Sidebar />

    <Header />

    <main class="main-content" :class="{ mobile }">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const mounted = ref(false)
const { mobile } = useBreakpoint()

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: var(--spacing-md);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
  background: var(--color-background);
  display: flex;
  flex-direction: column;
}

.main-content.mobile {
  margin-left: 0;
  padding-inline: var(--spacing-lg);
}
</style>
