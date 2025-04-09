import { ref, watch, computed, type Ref } from 'vue'
import type { Profile, ProfileUpdatePayload } from '~/types/database'
import type { User } from '@supabase/supabase-js'

export default function useProfile() {
  const { user } = useAuth()
  const profile: Ref<Profile | null> = ref(null)
  const loading = ref(false)
  const error = ref<any>(null)

  const userId = computed(() => user.value?.id)

  async function fetchProfile() {
    if (!userId.value) {
      profile.value = null
      return
    }

    loading.value = true
    error.value = null
    try {
      const { data: fetchedData, error: fetchError } = await useFetch(`/api/get/profiles/user/${userId.value}`)

      if (fetchError.value) throw fetchError.value

      profile.value = Array.isArray(fetchedData.value)
        ? (fetchedData.value[0] as Profile | null)
        : (fetchedData.value as Profile | null)

      if (!profile.value) {
        console.warn('No profile data found for user:', userId.value)
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      error.value = err
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(profilePayload: ProfileUpdatePayload) {
    if (!userId.value) throw new Error('User not authenticated')
    if (!profile.value) throw new Error('Profile not loaded')

    loading.value = true
    error.value = null
    try {
      const { data: updatedData, error: updateError } = await useFetch(`/api/patch/profiles/${userId.value}`, {
        method: 'PATCH',
        body: profilePayload,
      })

      if (updateError.value) throw updateError.value

      profile.value = updatedData.value as Profile | null
    } catch (err) {
      console.error('Error updating profile:', err)
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
        profile.value = null
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
