import type { Debt } from '~/types/database'

export default function useDebts({ disableFetch = false }: { disableFetch?: boolean } = {}) {
  const { user } = useAuth()
  const debts = useState<Debt[]>('debts', () => [])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const loaded = ref(false)

  async function fetchDebts() {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Debt[]>(`/api/get/debts/user/${user.value.id}`)
      debts.value = data
    } catch (err) {
      error.value = err instanceof Error ? err : new Error('Failed to fetch debts')
    } finally {
      loading.value = false
      loaded.value = true
    }
  }

  if (!disableFetch) {
    fetchDebts()
  }

  return {
    debts,
    loading,
    error,
    loaded,
    fetchDebts,
  }
}
