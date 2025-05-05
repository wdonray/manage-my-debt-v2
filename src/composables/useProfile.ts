import { ref, watch, type Ref } from 'vue'
import type { Profile, ProfileUpdatePayload } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export default function useProfile() {
  const { user } = useAuth()
  const profile: Ref<Profile> = useState('profile', () => ({}) as Profile)
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<Error | null>(null)

  const loaded = computed(() => Object.keys(profile.value).length > 0)

  async function fetchProfile() {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`/api/get/profiles/${user.value.id}`)
      profile.value = data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch profile')
      profile.value = {} as Profile
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profilePayload: ProfileUpdatePayload) {
    if (!user.value?.id || !profile.value) return

    saving.value = true
    error.value = null

    try {
      const data = await $fetch(`/api/patch/profiles/${user.value.id}`, { method: 'PATCH', body: profilePayload })
      profile.value = data
    } catch (err) {
      const errorValue = err instanceof Error ? err : new Error('Failed to update profile')
      error.value = errorValue
      throw errorValue
    } finally {
      saving.value = false
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
    loaded,
    loading,
    error,
    fetchProfile,
    updateProfile,
    saving,
  }
}
