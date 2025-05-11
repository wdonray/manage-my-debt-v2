<template>
  <div v-if="user && profileLoaded && debtsLoaded && debts">
    <PageHeader>
      <section class="welcome-message">
        <template v-if="name && debts.length > 0">Welcome back, {{ name }}</template>
        <template v-else>
          <Flex align="center" gap="sm" wrap>
            <Icon v-if="!mobile" name="ph:hand-waving" size="32" />
            <span>Welcome to Manage My Debt!</span>
          </Flex>
        </template>
      </section>

      <template #tools>
        <NuxtLink v-if="priorityDebt" to="/debts/new">
          <Button class="btn-primary btn-small">
            <Icon name="ph:plus-bold" size="20" />
            Add debt
          </Button>
        </NuxtLink>
      </template>
    </PageHeader>

    <Flex stack gap="xl">
      <section class="key-metrics">
        <Grid columns="1fr 1fr" align="center">
          <Flex>
            <Flex stack gap="xs">
              <h3 style="margin: 0">Total Debt</h3>
              <h2 class="metric-value">{{ formatCurrency(totalDebt) }}</h2>
            </Flex>
          </Flex>

          <div class="metric-values" :class="{ mobile }">
            <Flex stack gap="xs">
              <small class="text-secondary" style="white-space: nowrap">Active Debts</small>
              <h3>{{ debts.length }}</h3>
            </Flex>

            <Flex stack gap="xs">
              <small class="text-secondary" style="white-space: nowrap">Average Interest Rate</small>
              <h3>{{ formatPercentage(averageAPR) }}</h3>
            </Flex>

            <Flex stack gap="xs">
              <small class="text-secondary" style="white-space: nowrap">Total Monthly Payment</small>
              <h3>{{ formatCurrency(totalMonthlyPayments) }}</h3>
            </Flex>
          </div>
        </Grid>
      </section>

      <section class="priority-debt">
        <Flex v-if="priorityDebt" stack gap="xl">
          <DashboardCard>
            <template #title>
              <Flex gap="sm" align="center">
                <Icon name="ph:target-bold" size="24" style="color: var(--color-notice-red-text)" />
                <Flex align="center" gap="sm">
                  <template v-if="!mobile">
                    <h3 class="margin-0">Focus Debt</h3>
                    <Icon name="ph:arrow-right-bold" size="20" style="color: var(--color-notice-red-text)" />
                  </template>
                  <h3 class="margin-0">{{ priorityDebt.name || 'Unnamed Debt' }}</h3>
                </Flex>
                <Tooltip>
                  <template #content>This is the debt that you should focus on paying off first.</template>
                </Tooltip>
              </Flex>
            </template>

            <template #actions>
              <small>
                <NuxtLink :to="{ name: 'debts-edit-id', params: { id: priorityDebt?.id } }">
                  <Button class="btn-text">
                    <Icon name="ph:sliders-bold" size="20" />
                    Update Payment
                  </Button>
                </NuxtLink>
              </small>
            </template>

            <Flex stack gap="xl">
              <ProgressBar
                v-if="priorityDebt.starting_balance"
                :progress="payoffProgress"
                variant="success"
                :aria-label="`${payoffProgress}% of debt paid off`"
              >
                <template #label>
                  <Flex gap="xs" align="baseline">
                    <strong class="h2 margin-0">
                      {{ formatCurrency(priorityDebt.starting_balance - priorityDebt.balance) }}
                    </strong>
                    <span class="h2 text-secondary margin-0">/</span>
                    <span class="h2 text-secondary margin-0">{{ formatCurrency(priorityDebt.starting_balance) }}</span>
                  </Flex>
                </template>
              </ProgressBar>

              <Grid :columns="estimatedPayoffMonths ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr'">
                <Flex v-if="estimatedPayoffMonths" stack gap="md">
                  <span class="text-secondary">Estimated Payoff</span>
                  <h3 class="margin-0">{{ estimatedPayoffDate }}</h3>
                </Flex>

                <Flex stack gap="md" class="debt-payment">
                  <span class="text-secondary">Monthly Payment</span>

                  <Flex align="baseline" gap="sm">
                    <h3 class="margin-0">{{ formatCurrency(priorityDebt.min_payment) }}</h3>
                    <small v-if="priorityDebt.extra_payment" style="color: var(--color-notice-green-text)">
                      +{{ formatCurrency(priorityDebt.extra_payment) }} extra
                    </small>
                  </Flex>
                </Flex>

                <Flex stack gap="md" class="debt-balance">
                  <span class="text-secondary">Remaining Balance</span>
                  <h3 class="margin-0">{{ formatCurrency(priorityDebt.balance) }}</h3>
                </Flex>

                <Flex stack gap="md" class="debt-payment">
                  <span class="text-secondary">Interest Rate</span>
                  <h3 class="margin-0">{{ formatPercentage(priorityDebt.apr) }}</h3>
                </Flex>
              </Grid>

              <template v-if="priorityDebt">
                <Notice v-if="paymentOnlyCoversInterest" type="error" align="flex-start">
                  <Flex gap="sm" stack>
                    <strong>Payment Only Covers Interest</strong>
                    <span>
                      Increase payment to at least
                      {{ formatCurrency(calculateMonthlyInterest(priorityDebt.balance, priorityDebt.apr) + 1) }}
                      to start reducing your balance.
                    </span>
                    <small class="text-secondary">
                      Monthly interest:
                      {{ formatCurrency(calculateMonthlyInterest(priorityDebt.balance, priorityDebt.apr)) }}
                    </small>
                  </Flex>
                </Notice>

                <Notice
                  v-else-if="isMinPaymentTooLow(priorityDebt.balance, monthlyPayment)"
                  type="warning"
                  align="flex-start"
                >
                  <Flex gap="sm" stack>
                    <strong>Speed Up Your Progress</strong>
                    <span>
                      Recommended payment: {{ formatCurrency(calculateRecommendedMinPayment(priorityDebt.balance)) }}
                    </span>
                    <small class="text-secondary">
                      Higher payments on high-interest debt save more money over time
                    </small>
                  </Flex>
                </Notice>
              </template>
            </Flex>
          </DashboardCard>

          <hr class="margin-0" />

          <Flex stack gap="md">
            <h2 class="margin-0">Other Debts</h2>
            <DashboardCard v-for="debt in debts.filter((debt) => debt.id !== priorityDebt?.id)" :key="debt.id">
              <Grid columns="200px 1fr 1fr 1fr" align="center">
                <h3 class="margin-0">
                  {{ debt.name || 'Unnamed Debt' }}
                  <span v-if="!isUnique?.(debt.id)">({{ debtsNameCount?.[debt.id] || 0 }})</span>
                </h3>

                <Flex align="baseline" gap="sm">
                  <small class="text-secondary">Balance</small>
                  <span>{{ formatCurrency(debt.balance) }}</span>
                </Flex>

                <Flex align="baseline" gap="sm">
                  <small class="text-secondary">APR</small>
                  <span>{{ formatPercentage(debt.apr) }}</span>
                </Flex>

                <Flex align="baseline" gap="sm">
                  <small class="text-secondary">Monthly</small>
                  <span>{{ formatCurrency(debt.min_payment) }}</span>
                </Flex>
              </Grid>
            </DashboardCard>
          </Flex>
        </Flex>

        <Notice v-else type="info">
          <p>Ready to start your debt-free journey? Add your first debt to get started.</p>
          <template #actions>
            <NuxtLink to="/debts/new">
              <Button class="btn-primary">
                <Icon name="ph:plus-bold" size="20" />
                Add Your First Debt
              </Button>
            </NuxtLink>
          </template>
        </Notice>
      </section>
    </Flex>
  </div>
</template>

<script setup lang="ts">
import type { Debt } from '~/types/database'
const { profile, loaded: profileLoaded } = useProfile()
const { user } = useAuth()
const { mobile } = useBreakpoint()

const debts = useState<Debt[]>('debts', () => [])
const debtsLoaded = inject(DEBTS_LOADED_KEY)
const isUnique = inject(IS_UNIQUE_KEY)
const debtsNameCount = inject(DEBTS_NAME_COUNT_KEY)
const name = computed(() => profile.value?.username || profile.value?.full_name)
const totalDebt = computed(() => calculateTotalDebt(debts?.value ?? []))
const totalMonthlyPayments = computed(() => calculateTotalMonthlyPayments(debts?.value ?? []))
const priorityDebt = computed(() => getPriorityDebt(debts?.value ?? []))
const monthlyPayment = computed(() =>
  priorityDebt.value ? priorityDebt.value?.min_payment + (priorityDebt.value?.extra_payment || 0) : 0
)
const estimatedPayoffMonths = computed(() => (priorityDebt.value ? calculatePayoffMonths(priorityDebt.value) : 0))
const estimatedPayoffDate = computed(() => (priorityDebt.value ? calculatePayoffDate(priorityDebt.value) : ''))
const paymentOnlyCoversInterest = computed(() => estimatedPayoffMonths.value === Infinity)
const averageAPR = computed(() => calculateAverageAPR(debts?.value ?? []))
const payoffProgress = computed(() => (priorityDebt.value ? calculatePayoffProgress(priorityDebt.value) : 0))
</script>

<style scoped>
.metric-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-3xl);
}

.metric-values.mobile {
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.metric-value {
  font-size: calc(var(--text-h1) * 1.25);
}

.text-notice-red {
  color: var(--color-notice-red-text);
}
</style>
