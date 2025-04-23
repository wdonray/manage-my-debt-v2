<template>
  <Notice v-if="signOutError" type="error">
    {{ signOutError }}
  </Notice>
</template>

<script setup lang="ts">
const { signOut, signOutError } = useAuth()

signOut()
</script>
