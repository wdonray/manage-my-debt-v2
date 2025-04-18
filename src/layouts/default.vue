<template>
  <div v-if="mounted" class="layout">
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

<style>
:root {
  --sidebar-width: 210px;
}
</style>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: var(--spacing-md);
  padding-left: var(--spacing-2xl);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom));
  display: flex;
  flex-direction: column;
}

.main-content.mobile {
  margin-left: 0;
  padding-inline: var(--spacing-lg);
}
</style>
