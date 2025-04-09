import { ref, watch, computed } from 'vue'
import type { Debt, DebtCreatePayload, DebtUpdatePayload } from '~/types/database'

export default function useDebts() {
  const { user } = useAuth()
  const debts = ref<Debt[]>([])
  const loading = ref(false)
  const error = ref<any>(null)

  const userId = computed(() => user.value?.id)

  async function fetchDebts() {
    if (!userId.value) return
    loading.value = true
    error.value = null
    try {
      const { data: fetchedData, error: fetchError } = await useFetch(`/api/get/debts/user/${userId.value}`)
      if (fetchError.value) throw fetchError.value
      debts.value = (fetchedData.value as Debt[]) || []
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function addDebt(debtPayload: DebtCreatePayload) {
    if (!userId.value) throw new Error('User not authenticated')
    loading.value = true
    error.value = null
    try {
      const payload = { ...debtPayload, user_id: userId.value }
      const { error: insertError } = await useFetch('/api/post/debts', {
        method: 'POST',
        body: payload,
      })
      if (insertError.value) throw insertError.value
      fetchDebts()
    } catch (err) {
      console.error('Error adding debt:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateDebt(debtId: number, debtPayload: DebtUpdatePayload) {
    loading.value = true
    error.value = null
    try {
      const { error: updateError } = await useFetch(`/api/patch/debts/${debtId}`, {
        method: 'PATCH',
        body: debtPayload,
      })
      if (updateError.value) throw updateError.value
      fetchDebts()
    } catch (err) {
      console.error('Error updating debt:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  async function removeDebt(debtId: number) {
    if (!confirm('Are you sure you want to delete this debt?')) return
    loading.value = true
    error.value = null
    try {
      const { error: deleteError } = await useFetch(`/api/delete/debts/${debtId}`, { method: 'DELETE' })
      if (deleteError.value) throw deleteError.value
      fetchDebts()
    } catch (err) {
      console.error('Error deleting debt:', err)
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  watch(
    user,
    (currentUser) => {
      if (currentUser) fetchDebts()
    },
    { immediate: true }
  )

  return {
    debts,
    loading,
    error,
    fetchDebts,
    addDebt,
    updateDebt,
    removeDebt,
  }
}
