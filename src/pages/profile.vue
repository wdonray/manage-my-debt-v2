<template>
  <div>
    <PageHeader>
      <template #icon>
        <Avatar size="32" />
      </template>
      Your profile

      <template #tools>
        <FormStatus :unsaved :show-status :saving />
      </template>
    </PageHeader>

    <div v-auto-animate>
      <Notice v-if="error && !profile" type="error">Unable to load your profile: {{ error.message }}</Notice>

      <Clamp v-else-if="profile" size="md">
        <Card border>
          <FormWithValidation :fetching="loading" @submit="saveProfile">
            <FieldText
              v-model="formData.email"
              description="Your email address cannot be changed"
              label="Email address"
              readonly
            />
            <FieldText
              v-model="formData.username"
              label="Display name"
              optional
              placeholder="Choose a name that will be visible to others"
            />
            <FieldText
              v-model="formData.full_name"
              label="Full name"
              optional
              placeholder="Enter your first and last name"
            />
            <FieldText
              v-model="formData.website"
              label="Personal website"
              type="url"
              optional
              placeholder="https://example.com"
            />

            <FieldTextArea
              v-model="formData.bio"
              label="About me"
              optional
              placeholder="Share a brief description about yourself"
            />

            <Flex justify="flex-end">
              <Button class="btn-primary" type="submit" :disabled="saving">
                {{ saving ? 'Updating...' : 'Update Profile' }}
              </Button>
            </Flex>
          </FormWithValidation>
        </Card>
      </Clamp>
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

const { unsaved, showStatus, setUnsaved } = useForm(profile, formData)

async function saveProfile() {
  saveError.value = null
  saveSuccess.value = false

  try {
    await updateProfile(formData.value)
    saveSuccess.value = true
    setUnsaved(false)
  } catch (err) {
    saveError.value = err instanceof Error ? err : new Error('Failed to save profile')
  }
}
</script>
