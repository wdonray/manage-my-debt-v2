<template>
  <div class="layout" v-if="mounted">
    <Sidebar />
    <main class="main-content" :class="{ mobile }">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue'

const mounted = ref(false)
const { mobile } = useBreakpoint()

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: var(--spacing-lg);
  background: var(--color-background);
}

.main-content.mobile {
  margin-left: 0;
  padding: var(--spacing-sm);
  padding-top: calc(var(--spacing-lg) + env(safe-area-inset-top));
}
</style>
