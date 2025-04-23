<template>
  <NuxtLink to="/profile" class="avatar-container">
    <div v-if="profile.avatar_url" class="avatar">
      <img :src="profile.avatar_url" :alt="profile?.email || 'Avatar'" >
    </div>
    <div v-else class="avatar">
      <Icon name="ph:user" :size="size || 40" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  size?: string
}>()

const { profile } = useProfile()

const size = computed(() => (props.size ? props.size + 'px' : '40px'))
</script>

<style scoped>
.avatar-container {
  cursor: pointer;
  transition: scale 0.2s ease-in-out;
}

.avatar {
  width: v-bind('size');
  height: v-bind('size');
  border-radius: var(--radius-round);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.avatar-container:hover {
  scale: 1.05;
}
</style>
