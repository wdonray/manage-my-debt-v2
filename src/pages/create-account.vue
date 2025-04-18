<template>
  <div>
    <h1>Create Account</h1>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'authenticate',
  middleware: 'auth',
})

const router = useRouter()
const { email } = useRoute().query as { email: string }

if (!email) {
  router.push('/login')
}

useAuth({ isPublic: true })
</script>
