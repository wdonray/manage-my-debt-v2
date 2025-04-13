<template></template>

<script setup lang="ts">
definePageMeta({
  layout: 'authenticate',
})

const router = useRouter()
const { email } = useRoute().query as { email: string }

if (!email) {
  router.push('/login')
}

useAuth({ isPublic: true })
</script>
