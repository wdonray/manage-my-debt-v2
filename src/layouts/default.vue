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

const { loading, loaded, error, fetchDebts, debtsNameCount, isUnique } = useDebts()

provide(DEBTS_LOADING_KEY, loading)
provide(DEBTS_LOADED_KEY, loaded)
provide(DEBTS_ERROR_KEY, error)
provide(FETCH_DEBTS_KEY, fetchDebts)
provide(DEBTS_NAME_COUNT_KEY, debtsNameCount)
provide(IS_UNIQUE_KEY, isUnique)

onMounted(() => {
  mounted.value = true
})
</script>

<style>
:root {
  --sidebar-width: 215px;
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
