<template>
  <div class="confirm-container">Waiting for login...</div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'authenticate',
})

useAuth({ isPublic: true })
</script>

<style scoped>
.confirm-container {
  width: 100%;
  text-align: center;
}
</style>
