<template>
  <div>
    <PageHeader>
      Your debts

      <template #tools>
        <NuxtLink to="/debts/new">
          <Button class="btn-primary btn-small">
            <Icon name="ph:plus-bold" size="16" />
            Add debt
          </Button>
        </NuxtLink>
      </template>
    </PageHeader>

    <div v-auto-animate>
      <Center v-if="loading && !debts?.length">
        <Spinner size="128" />
      </Center>

      <Notice v-else-if="debts?.length === 0" type="info">
        <p>Start your debt-free journey by adding your first debt.</p>
        <template #actions>
          <NuxtLink to="/debts/new">
            <Button class="btn-primary">Get Started</Button>
          </NuxtLink>
        </template>
      </Notice>

      <Flex v-else v-auto-animate stack>
        <Flex align="center" gap="md">
          <FlexSpace />
          <label for="status-filter">
            <strong>Filter by Status</strong>
          </label>
          <FieldSelect
            id="status-filter"
            v-model="statusFilter"
            style="width: 120px; height: 30px"
            disable-error-message
            :options="statusOptions"
          />
        </Flex>

        <Notice v-if="sortedDebts.length === 0" :key="`${statusFilter}-empty`" align="flex-start" type="info">
          <Flex stack gap="sm">
            <div>
              No debts found with status
              <strong>"{{ statusFilter === 'not_set' ? 'Not Set' : formatCapitalize(statusFilter) }}"</strong>
            </div>
            <div>
              <NuxtLink to="/debts/new" class="highlight">Add a new debt</NuxtLink>
              or adjust the status filter above
            </div>
          </Flex>
        </Notice>

        <Flex v-else :key="statusFilter" stack>
          <DataTable :columns :rows="sortedDebts" borderless>
            <template #name="{ row }">
              <Flex align="center" gap="sm">
                <Icon
                  v-if="getPriorityDebt(sortedDebts)?.id === row.id"
                  name="ph:target-bold"
                  size="24"
                  style="color: var(--color-notice-red-text)"
                />
                <strong>
                  {{ row.name || 'Unnamed Debt' }}
                  <span v-if="!isUnique?.(row.id)">({{ debtsNameCount?.[row.id] || 0 }})</span>
                </strong>
              </Flex>
            </template>

            <template #due_date="{ row }">
              {{ row.due_date ? formatDate(calculateNextPaymentDate(row.due_date).toISOString()) : 'Not Set' }}
            </template>

            <template #status="{ row }">
              <strong v-if="row.status" class="status" :class="`status-${row.status}`">
                {{ statusMap[row.status as keyof typeof statusMap] || 'Not Set' }}
              </strong>
              <strong v-else class="status status-null">Not set</strong>
            </template>

            <template #actions="{ row }">
              <Flex>
                <NuxtLink :to="{ name: 'debts-edit-id', params: { id: row.id } }">
                  <Button class="btn-text">Edit</Button>
                </NuxtLink>
                <Button class="btn-text" style="color: var(--color-error)" @click="removeDebt(row.id)">Delete</Button>
              </Flex>
            </template>

            <template #dropdown="{ row }">
              <Grid columns="1fr 1fr 1fr" gap="md">
                <div>
                  <h4 class="text-secondary margin-0">Payment Details</h4>
                  <dl>
                    <dt>Base Payment</dt>
                    <dd>{{ formatCurrency(row.min_payment) }}</dd>
                  </dl>
                  <dl>
                    <dt>Additional Payment</dt>
                    <dd>{{ row.extra_payment ? formatCurrency(row.extra_payment) : 'None' }}</dd>
                  </dl>
                  <dl>
                    <dt>Total Monthly</dt>
                    <dd>{{ formatCurrency(row.min_payment + (row.extra_payment || 0)) }}</dd>
                  </dl>
                </div>

                <div>
                  <h4 class="text-secondary margin-0">Balance & Interest</h4>
                  <dl>
                    <dt>Starting Balance</dt>
                    <dd>{{ row.starting_balance ? formatCurrency(row.starting_balance) : 'Not Set' }}</dd>
                  </dl>
                  <dl>
                    <dt>Current Balance</dt>
                    <dd>{{ formatCurrency(row.balance) }}</dd>
                  </dl>
                  <dl>
                    <dt>Interest Rate (APR)</dt>
                    <dd>{{ formatPercentage(row.apr) }}</dd>
                  </dl>
                </div>

                <div>
                  <h4 class="text-secondary margin-0">Timeline</h4>
                  <dl>
                    <dt>Started</dt>
                    <dd>{{ row.start_date ? formatDate(row.start_date) : 'Not Set' }}</dd>
                  </dl>
                  <dl>
                    <dt>Next Due</dt>
                    <dd>
                      {{ row.due_date ? formatDate(calculateNextPaymentDate(row.due_date).toISOString()) : 'Not Set' }}
                    </dd>
                  </dl>
                </div>
              </Grid>
            </template>
          </DataTable>
        </Flex>
      </Flex>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Debt } from '~/types/database'

const statusFilter = ref('all')
const { fetchDebts } = useDebts({ disableFetch: true })

const debts = useState<Debt[]>('debts', () => [])
const loading = inject(DEBTS_LOADING_KEY)
const debtsNameCount = inject(DEBTS_NAME_COUNT_KEY)
const isUnique = inject(IS_UNIQUE_KEY)

const sortedDebts = computed(() => {
  return [...(debts?.value ?? [])].filter((debt) => {
    if (statusFilter.value === 'all') return true
    if (statusFilter.value === 'not_set') return debt.status === null
    return debt.status === statusFilter.value
  })
})

interface Column {
  key: string
  display: string
  type?: 'date' | 'percentage' | 'currency'
  class?: string
  sortable?: boolean
}

const columns: Column[] = [
  { key: 'name', display: 'Name', sortable: true },
  { key: 'due_date', display: 'Due', type: 'date', sortable: true },
  { key: 'apr', display: 'APR', type: 'percentage', sortable: true },
  { key: 'balance', display: 'Balance', type: 'currency', sortable: true },
  { key: 'status', display: 'Status', sortable: true },
  { key: 'actions', display: '' },
]

const statusOptions = [
  { display: 'All', key: 'all' },
  { display: 'Active', key: 'current' },
  { display: 'Behind', key: 'behind' },
  { display: 'Not set', key: 'not_set' },
  { display: 'Paid Off', key: 'paid_off' },
  { display: 'Paused', key: 'paused' },
  { display: 'Closed', key: 'closed' },
]

const statusMap = {
  current: 'Active',
  behind: 'Behind',
  not_set: 'Not Set',
  paid_off: 'Paid Off',
  paused: 'Paused',
  closed: 'Closed',
}

async function removeDebt(debtId: string) {
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
  --color-text-inverted: var(--color-gray-950);
}
</style>

<style scoped>
:deep(table) {
  table-layout: auto;
}

dt {
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

dd {
  margin: 0;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.status {
  color: var(--color-text-inverted);
}

.status-current {
  color: var(--color-notice-green-text);
}

.status-behind {
  color: var(--color-notice-red-text);
}

.status-paid_off {
  color: var(--color-notice-green-text);
}

.status-paused {
  color: var(--color-notice-yellow-text);
}

.status-closed {
  color: var(--color-notice-red-text);
}

.status-null {
  color: var(--color-notice-gray-text);
}
</style>
