<template>
  <Flex v-if="user && profileLoaded && debtsLoaded" stack class="container" gap="xl">
    <section class="welcome-message">
      <h1 style="font-size: 32px">
        <template v-if="name && debts.length > 0">Welcome back, {{ name }}</template>
        <template v-else>
          <Flex align="center" gap="sm" wrap>
            <Icon v-if="!mobile" name="ph:hand-waving" size="32" />
            <span>Welcome to Manage My Debt!</span>
          </Flex>
        </template>
      </h1>
    </section>

    <section class="key-metrics">
      <Flex stack gap="xl">
        <Flex>
          <Flex stack gap="xs">
            <h3 style="margin: 0">Total Debt</h3>
            <h2 class="metric-value">{{ formatCurrency(totalDebt) }}</h2>
          </Flex>

          <FlexSpace />

          <NuxtLink v-if="priorityDebt" to="/debts/new">
            <Button class="btn-primary">
              <Icon name="ph:plus-bold" size="20" />
              Add New Debt
            </Button>
          </NuxtLink>
        </Flex>

        <Flex gap="3xl">
          <Flex stack gap="xs">
            <small class="text-secondary">Active Debts</small>
            <h3>{{ debts.length }}</h3>
          </Flex>

          <Flex stack gap="xs">
            <small class="text-secondary">Average Interest Rate</small>
            <h3>{{ formatPercentage(averageAPR) }}</h3>
          </Flex>

          <Flex stack gap="xs">
            <small class="text-secondary">Total Monthly Payment</small>
            <h3>{{ formatCurrency(totalMonthlyPayments) }}</h3>
          </Flex>
        </Flex>
      </Flex>
    </section>

    <section class="priority-debt">
      <Flex v-if="priorityDebt" stack gap="xl">
        <DashboardCard>
          <template #title>
            <Flex gap="sm">
              <Icon name="ph:target-bold" size="24" style="color: var(--color-notice-red-text)" />
              <Flex align="center" gap="sm">
                <template v-if="!mobile">
                  <h3 class="margin-0">Focus Debt</h3>
                  <Icon name="ph:arrow-right-bold" size="20" style="color: var(--color-notice-red-text)" />
                </template>
                <h3 class="margin-0">{{ priorityDebt.name || 'Unnamed Debt' }}</h3>
              </Flex>
            </Flex>
          </template>

          <template #actions>
            <NuxtLink :to="{ name: 'debts-edit-id', params: { id: priorityDebt?.id } }">
              <Button class="btn-text">
                <Icon name="ph:sliders-bold" size="20" />
                Update Payment
              </Button>
            </NuxtLink>
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
              <Notice v-if="paymentOnlyCoversInterest" type="error" align="flex-start" role="alert">
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
                role="alert"
              >
                <Flex gap="sm" stack>
                  <strong>Speed Up Your Progress</strong>
                  <span>
                    Recommended payment: {{ formatCurrency(calculateRecommendedMinPayment(priorityDebt.balance)) }}
                  </span>
                  <small class="text-secondary">Higher payments on high-interest debt save more money over time</small>
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
              <h3 class="margin-0">{{ debt.name || 'Unnamed Debt' }}</h3>

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

      <Notice v-else type="info" role="alert">
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
</template>

<script setup lang="ts">
const { profile, loaded: profileLoaded } = useProfile()
const { user } = useAuth()
const { debts, loaded: debtsLoaded } = useDebts()
const { mobile } = useBreakpoint()

const name = computed(() => profile.value?.username || profile.value?.full_name)
const totalDebt = computed(() => calculateTotalDebt(debts.value))
const totalMonthlyPayments = computed(() => calculateTotalMonthlyPayments(debts.value))
const priorityDebt = computed(() => getPriorityDebt(debts.value))
const monthlyPayment = computed(() =>
  priorityDebt.value ? priorityDebt.value?.min_payment + (priorityDebt.value?.extra_payment || 0) : 0
)
const estimatedPayoffMonths = computed(() => (priorityDebt.value ? calculatePayoffMonths(priorityDebt.value) : 0))
const estimatedPayoffDate = computed(() => (priorityDebt.value ? calculatePayoffDate(priorityDebt.value) : ''))
const paymentOnlyCoversInterest = computed(() => estimatedPayoffMonths.value === Infinity)
const averageAPR = computed(() => calculateAverageAPR(debts.value))
const payoffProgress = computed(() => (priorityDebt.value ? calculatePayoffProgress(priorityDebt.value) : 0))
</script>

<style scoped>
.metric-value {
  font-size: calc(var(--text-h1) * 1.25);
}

.text-notice-red {
  color: var(--color-notice-red-text);
}
</style>
