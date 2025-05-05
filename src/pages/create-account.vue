<template>
  <Card border style="width: 100%">
    <Flex stack>
      <Flex align="center" gap="md">
        <Icon name="ph:envelope-simple" size="36" style="color: var(--color-accent)" />
        <h2 class="margin-0">Check Your Email</h2>
      </Flex>

      <hr class="margin-0" />

      <Flex stack gap="md">
        <p class="text-secondary margin-0">We've sent a confirmation link to {{ email }}</p>
        <p class="margin-0">Please check your inbox and click the link to complete your account setup.</p>
      </Flex>
    </Flex>
  </Card>
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
