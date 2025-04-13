import { ref, watch, computed } from 'vue'
import type { Debt, DebtCreatePayload, DebtUpdatePayload } from '~/types/database'

export default function useDebts() {
  const { user } = useAuth()
  const debts = ref<Debt[]>([])
  const loading = ref(false)
  const error = ref<any>(null)

  async function fetchDebts() {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch(`/api/get/debts/user/${user.value.id}`)
      debts.value = data as Debt[]
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  async function addDebt(debtPayload: DebtCreatePayload) {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      await $fetch('/api/post/debts', {
        method: 'POST',
        body: { ...debtPayload, user_id: user.value.id },
      })
      fetchDebts()
    } catch (err) {
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
      await $fetch(`/api/patch/debts/${debtId}`, { method: 'PATCH', body: debtPayload })
      fetchDebts()
    } catch (err) {
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
      await $fetch(`/api/delete/debts/${debtId}`, { method: 'DELETE' })
      fetchDebts()
    } catch (err) {
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
