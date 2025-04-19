import type { Debt, DebtCreatePayload, DebtUpdatePayload } from '~/types/database'

export default function useDebt(debtId?: string, { disableFetch = false }: { disableFetch?: boolean } = {}) {
  const { user } = useAuth()
  const debt = ref<Debt>({} as Debt)
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const loaded = ref(false)

  async function getDebt() {
    if (!user.value?.id) return

    try {
      const data = await $fetch<Debt>(`/api/get/debts/${debtId}`)
      debt.value = data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch debt')
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  if (!disableFetch) {
    getDebt()
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
    } catch (err) {
      const errorValue = err instanceof Error ? err : new Error('Failed to add debt')
      error.value = errorValue
      throw errorValue
    } finally {
      loading.value = false
    }
  }

  async function updateDebt(debtPayload: DebtUpdatePayload) {
    loading.value = true
    error.value = null

    try {
      await $fetch(`/api/patch/debts/${debtId}`, { method: 'PATCH', body: debtPayload })
    } catch (err) {
      const errorValue = err instanceof Error ? err : new Error('Failed to update debt')
      error.value = errorValue
      throw errorValue
    } finally {
      loading.value = false
    }
  }

  async function removeDebt() {
    if (!confirm('Are you sure you want to delete this debt?')) return
    loading.value = true
    error.value = null
    try {
      await $fetch(`/api/delete/debts/${debtId}`, { method: 'DELETE' })
    } catch (err) {
      const errorValue = err instanceof Error ? err : new Error('Failed to remove debt')
      error.value = errorValue
      throw errorValue
    } finally {
      loading.value = false
    }
  }

  return {
    addDebt,
    debt,
    error,
    getDebt,
    loaded,
    loading,
    removeDebt,
    updateDebt,
  }
}
