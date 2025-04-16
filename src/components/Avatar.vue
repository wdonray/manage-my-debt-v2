<template>
  <NuxtLink to="/profile" class="avatar-container" v-auto-animate>
    <div class="avatar" v-if="profile.avatar_url">
      <img :src="profile.avatar_url" :alt="profile?.email || 'Avatar'" />
    </div>
    <div class="avatar" v-else>
      <Icon name="ph:user" size="40" />
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { profile } = useProfile()
</script>

<style scoped>
.avatar-container {
  cursor: pointer;
  transition: scale 0.2s ease-in-out;
}

.avatar {
  width: 40px;
  height: 40px;
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
