<template>
  <Notice v-if="signOutError" type="error" role="alert">
    {{ signOutError }}
  </Notice>
</template>

<script setup lang="ts">
const { signOut, signOutError } = useAuth()

signOut()
</script>
