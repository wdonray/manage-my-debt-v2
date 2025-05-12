import type { Debt } from '~/types/database'

interface UseDebtsOptions {
  disableFetch?: boolean
}

/**
 * Composable for managing debts data and state
 *
 * @param options Configuration options for the composable
 * @param options.disableFetch Whether to disable automatic fetching of debts on initialization
 * @returns Object containing debts data and utility functions
 */
export default function useDebts({ disableFetch = false }: UseDebtsOptions = {}) {
  const { user } = useAuth()
  const debts = useState<Debt[]>('debts', () => [])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const loaded = ref(false)

  const debtsNameCount = computed(() => {
    const nameCounts: Record<string, number> = {}

    debts.value.forEach((debt) => {
      const sameNameDebts = debts.value.filter((d) => getDebtName(d) === getDebtName(debt))
      const index = sameNameDebts.findIndex((d) => d.id === debt.id)
      nameCounts[debt.id] = index + 1
    })

    return nameCounts
  })

  function getDebtName(debt: Debt): string {
    return debt.name || 'Unnamed Debt'
  }

  function isUnique(id: string): boolean {
    const debt = debts.value.find((d) => d.id === id)
    if (!debt) return true

    const sameNameDebts = debts.value.filter((d) => getDebtName(d) === getDebtName(debt))
    return sameNameDebts.length === 1
  }

  async function fetchDebts() {
    if (!user.value?.id) return

    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Debt[]>(`/api/get/debts/user/${user.value.id}`)
      debts.value = sortDebtsByAPR(data)
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
    debtsNameCount,
    error,
    fetchDebts,
    isUnique,
    loaded,
    loading,
  }
}
