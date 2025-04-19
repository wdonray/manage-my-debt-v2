<template>
  <Flex stack>
    <Flex align="center" gap="md">
      <h1>My Debts</h1>

      <FlexSpace />

      <NuxtLink to="/debts/new">
        <Button class="btn-primary btn-small">Add Debt</Button>
      </NuxtLink>
    </Flex>

    <div v-auto-animate>
      <Spinner v-if="loading" />

      <Notice v-else-if="debts.length === 0" type="info" role="alert">
        <p>You haven't added any debts yet. Click "Add Debt" to get started.</p>
      </Notice>

      <Flex v-else v-auto-animate stack>
        <Flex align="center" gap="md">
          <FlexSpace />
          <label for="status-filter">
            <strong>Status</strong>
          </label>
          <FieldSelect
            id="status-filter"
            v-model="statusFilter"
            style="width: 90px; height: 30px"
            disable-error-message
            :options="statusOptions"
          />
        </Flex>

        <Notice
          v-if="sortedDebts.length === 0"
          :key="`${statusFilter}-empty`"
          align="flex-start"
          type="info"
          role="alert"
        >
          <Flex stack gap="sm">
            <div>
              No debts found with status
              <strong>"{{ statusFilter === 'not_set' ? 'Not set' : statusFilter }}"</strong>
            </div>
            <div>
              Try changing the status filter or
              <NuxtLink to="/debts/new" class="highlight">adding a new debt</NuxtLink>
            </div>
          </Flex>
        </Notice>

        <Flex v-else-if="!desktop" stack>
          <Card v-for="debt in sortedDebts" :key="debt.id" border gap="md">
            <Flex stack gap="xl">
              <Flex align="center" gap="md">
                <h3 style="margin: 0">{{ debt.name || 'Unnamed Debt' }}</h3>
                <FlexSpace />
                <span :class="`status status-${debt.status}`">{{ debt.status || 'Not set' }}</span>
              </Flex>

              <Flex stack>
                <Flex align="center" gap="md">
                  <strong>Balance</strong>
                  <FlexSpace />
                  {{ formatCurrency(debt.balance) }}
                </Flex>

                <Flex align="center" gap="md">
                  <strong>APR</strong>
                  <FlexSpace />
                  {{ formatPercentage(debt.apr) }}
                </Flex>

                <Flex align="center" gap="md">
                  <strong>Min Payment</strong>
                  <FlexSpace />
                  {{ formatCurrency(debt.min_payment) }}
                </Flex>

                <Flex align="center" gap="md">
                  <strong>Extra Payment</strong>
                  <FlexSpace />
                  {{ debt.extra_payment ? formatCurrency(debt.extra_payment) : 'None' }}
                </Flex>

                <Flex align="center" gap="md">
                  <strong>Due Date</strong>
                  <FlexSpace />
                  {{ debt.due_date ? formatDate(debt.due_date) : 'Not set' }}
                </Flex>
              </Flex>

              <div class="actions">
                <Button
                  class="btn-small btn-outline"
                  style="color: var(--color-error); border-color: var(--color-error)"
                  @click="removeDebt(debt.id)"
                >
                  Delete
                </Button>
                <NuxtLink :to="`/debts/edit/${debt.id}`">
                  <Button class="btn-small btn-primary" style="width: 100%">Edit</Button>
                </NuxtLink>
              </div>
            </Flex>
          </Card>
        </Flex>

        <DataTable v-else :key="statusFilter" class="debts-table" :columns :rows="sortedDebts" striped borderless>
          <template #name="{ row }">
            {{ row.name || 'Unnamed Debt' }}
          </template>

          <template #balance="{ row }">
            {{ formatCurrency(row.balance) }}
          </template>

          <template #apr="{ row }">
            {{ formatPercentage(row.apr) }}
          </template>

          <template #min_payment="{ row }">
            {{ formatCurrency(row.min_payment) }}
          </template>

          <template #extra_payment="{ row }">
            {{ row.extra_payment ? formatCurrency(row.extra_payment) : 'None' }}
          </template>

          <template #actions="{ row }">
            <Flex gap="md">
              <NuxtLink :to="`/debts/edit/${row.id}`">
                <Button class="btn-small btn-text">Edit</Button>
              </NuxtLink>
              <Button class="btn-small btn-text" style="color: var(--color-error)" @click="removeDebt(row.id)">
                Delete
              </Button>
            </Flex>
          </template>
        </DataTable>
      </Flex>
    </div>
  </Flex>
</template>

<script setup lang="ts">
const statusFilter = ref('all')
const { desktop } = useBreakpoint()
const { debts, loading, fetchDebts } = useDebts()

// 'current' -> 'behind' -> null -> 'paid_off' -> 'paused' -> 'closed'
const statusOrder = {
  current: 0,
  behind: 1,
  paid_off: 2,
  paused: 3,
  closed: 4,
}

const sortedDebts = computed(() => {
  return [...debts.value]
    .filter((debt) => {
      if (statusFilter.value === 'all') return true
      if (statusFilter.value === 'not_set') return debt.status === null
      return debt.status === statusFilter.value
    })
    .sort((a, b) => {
      // Handle null status first
      if (a.status === null && b.status === null) {
        return (a.priority_order ?? 0) - (b.priority_order ?? 0)
      }
      if (a.status === null) return -1
      if (b.status === null) return 1

      // Then sort by status order
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }

      // Finally sort by priority order
      return (a.priority_order ?? 0) - (b.priority_order ?? 0)
    })
})

const columns = [
  { key: 'name', display: 'Name' },
  { key: 'balance', display: 'Balance' },
  { key: 'apr', display: 'APR' },
  { key: 'min_payment', display: 'Min Payment' },
  { key: 'extra_payment', display: 'Extra Payment' },
  { key: 'actions', display: '' },
]

const statusOptions = [
  { display: 'All', key: 'all' },
  { display: 'Current', key: 'current' },
  { display: 'Behind', key: 'behind' },
  { display: 'Not set', key: 'not_set' },
  { display: 'Paid Off', key: 'paid_off' },
  { display: 'Paused', key: 'paused' },
  { display: 'Closed', key: 'closed' },
]

async function removeDebt(debtId: number) {
  const { removeDebt } = useDebt(debtId, { disableFetch: true })
  await removeDebt()
  fetchDebts()
}
</script>

<style>
.light {
  --color-text-inverted: var(--color-white);
}

.dark {
  --color-text-inverted: var(--color-black);
}
</style>

<style scoped>
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.status {
  border-radius: var(--radius-sm);
  padding: 4px 8px;
  color: var(--color-text-inverted);
}

.status-current {
  background-color: var(--color-success);
}

.status-behind {
  background-color: var(--color-error);
}

.status-paid_off {
  background-color: var(--color-success);
}

.status-paused {
  background-color: var(--color-notice-yellow);
}

.status-closed {
  background-color: var(--color-error);
}

.status-null {
  background-color: var(--color-info);
}
</style>
