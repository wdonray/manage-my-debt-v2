<template>
  <div>
    <PageHeader>Profile</PageHeader>

    <div v-auto-animate>
      <div v-if="loading && !profile" class="text-center">
        <p>Loading profile...</p>
      </div>

      <Notice v-else-if="error && !profile" type="error">Failed to load profile: {{ error.message }}</Notice>

      <Clamp v-else-if="profile" size="md">
        <Card border>
          <Flex v-auto-animate stack gap="md">
            <FormWithValidation :fetching="loading" @submit="saveProfile">
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

                <FieldTextArea v-model="formData.bio" label="Bio" optional placeholder="Tell us about yourself" />

                <Flex justify="flex-end">
                  <Button class="btn-primary" type="submit">
                    {{ saving ? 'Saving...' : 'Save Profile' }}
                  </Button>
                </Flex>
              </Flex>
            </FormWithValidation>

            <Notice v-if="saveError" type="error">Failed to save profile: {{ saveError.message }}</Notice>
            <Notice v-if="saveSuccess" type="success">Profile saved successfully!</Notice>
          </Flex>
        </Card>
      </Clamp>

      <div v-else class="text-center">
        <p>Profile data is unavailable.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useProfile from '~/composables/useProfile'
import type { ProfileUpdatePayload } from '~/types/database'

const { profile, loading, error, updateProfile, saving } = useProfile()

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
    saveError.value = err instanceof Error ? err : new Error('Failed to save profile')
  }
}
</script>
