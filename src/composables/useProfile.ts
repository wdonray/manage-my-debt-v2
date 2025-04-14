import { ref, watch, type Ref } from 'vue'
import type { Profile, ProfileUpdatePayload } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export default function useProfile() {
  const { user } = useAuth()
  const profile: Ref<Profile> = ref({} as Profile)
  const loading = ref(false)
  const error = ref<any>(null)

  async function fetchProfile() {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`/api/get/profiles/${user.value.id}`)
      profile.value = data
    } catch (err) {
      error.value = err
      profile.value = {} as Profile
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profilePayload: ProfileUpdatePayload) {
    if (!user.value?.id || !profile.value) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`/api/patch/profiles/${user.value.id}`, { method: 'PATCH', body: profilePayload })
      profile.value = data
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  watch(
    user,
    (currentUser: User | null) => {
      if (currentUser) {
        fetchProfile()
      } else {
        profile.value = {} as Profile
      }
    },
    { immediate: true }
  )

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  }
}
