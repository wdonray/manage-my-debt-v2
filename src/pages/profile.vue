<template>
  <div class="container">
    <Flex stack gap="md">
      <Flex align="baseline">
        <h1 style="margin: 0">Edit Profile</h1>

        <small>
          <NuxtLink class="highlight" to="/">Back to Dashboard</NuxtLink>
        </small>
      </Flex>

      <div v-auto-animate>
        <div v-if="loading && !profile" class="text-center">
          <p>Loading profile...</p>
        </div>

        <Notice v-else-if="error && !profile" type="error" role="alert">
          Failed to load profile: {{ error.message }}
        </Notice>

        <Card v-else-if="profile" border>
          <Flex v-auto-animate stack gap="md">
            <FormWithValidation @submit="saveProfile">
              <Flex stack gap="md">
                <FieldText v-model="formData.email" label="Email" readonly />
                <FieldText v-model="formData.username" label="Username" optional placeholder="Your public username" />
                <FieldText v-model="formData.full_name" label="Full Name" optional placeholder="Your full name" />
                <FieldText
                  v-model="formData.website"
                  label="Website"
                  type="url"
                  optional
                  placeholder="https://yourwebsite.com"
                />

                <Flex style="justify-content: flex-end">
                  <Button class="btn-primary" type="submit" :disabled="loading">
                    {{ loading ? 'Saving...' : 'Save Profile' }}
                  </Button>
                </Flex>
              </Flex>
            </FormWithValidation>

            <Notice v-if="saveError" type="error" role="alert">Failed to save profile: {{ saveError.message }}</Notice>
            <Notice v-if="saveSuccess" type="success" role="alert">Profile saved successfully!</Notice>
          </Flex>
        </Card>

        <div v-else class="text-center">
          <p>Profile data is unavailable.</p>
        </div>
      </div>
    </Flex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useProfile from '~/composables/useProfile'
import type { ProfileUpdatePayload } from '~/types/database'

const { profile, loading, error, updateProfile } = useProfile()

const formData = ref<ProfileUpdatePayload>({})
const saveError = ref<Error | null>(null)
const saveSuccess = ref(false)

useForm(profile, formData)

async function saveProfile() {
  saveError.value = null
  saveSuccess.value = false

  try {
    await updateProfile(formData.value)
    saveSuccess.value = true
    setTimeout(() => (saveSuccess.value = false), 3000)
  } catch (err) {
    console.error('Error saving profile in component:', err)
    saveError.value = err instanceof Error ? err : new Error('Failed to save profile')
  }
}
</script>

<style scoped>
.container {
  max-width: 550px;
  padding: var(--spacing-lg);
}
</style>
