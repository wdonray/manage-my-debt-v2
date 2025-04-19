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
      <DashboardCard v-if="priorityDebt" color="var(--color-border)">
        <template #title>
          <Flex :align="mobile ? 'start' : 'center'" gap="sm" :stack="mobile">
            <Icon name="ph:target-bold" size="24" style="color: var(--color-notice-red-text)" />
            <Flex gap="sm" align="baseline" :stack="mobile">
              <h3 class="margin-0">Priority Debt</h3>
              <small class="text-secondary">Highest interest at {{ formatPercentage(priorityDebt.apr) }}</small>
            </Flex>
          </Flex>
        </template>

        <template #actions>
          <NuxtLink :to="{ name: 'debts-edit-id', params: { id: priorityDebt?.id } }">
            <Button class="btn-text">
              <Icon name="ph:sliders-bold" size="20" />
              Adjust Payment
            </Button>
          </NuxtLink>
        </template>

        <Flex v-if="priorityDebt" stack>
          <Flex>
            <h2 class="margin-0">{{ priorityDebt.name || 'Unnamed Debt' }}</h2>
          </Flex>

          <Grid columns="1fr 1fr" gap="md">
            <Flex stack gap="xs" class="debt-balance">
              <span class="text-secondary">Current Balance</span>
              <h3>{{ formatCurrency(priorityDebt.balance) }}</h3>
            </Flex>

            <Flex stack gap="xs" class="debt-payment">
              <span class="text-secondary">Monthly Payment</span>
              <Flex align="center" gap="sm">
                <h3>{{ formatCurrency(priorityDebt.min_payment + (priorityDebt.extra_payment || 0)) }}</h3>
                <small v-if="priorityDebt.extra_payment" style="color: var(--color-notice-green-text)">
                  +{{ formatCurrency(priorityDebt.extra_payment) }} extra
                </small>
              </Flex>
            </Flex>
          </Grid>

          <hr class="margin-0" />

          <Notice v-if="unableToPayoff" type="warning" align="flex-start" role="alert">
            <Flex gap="sm" stack>
              <strong>Interest Exceeding Payment</strong>
              <span>
                To reduce this high-interest debt, increase your monthly payment to
                {{ formatCurrency(calculateRecommendedMinPayment(priorityDebt.balance)) }}.
              </span>
              <small class="text-secondary">
                Following debt avalanche: Pay minimum on lower-interest debts and focus extra funds here.
              </small>
            </Flex>
          </Notice>

          <Flex v-else stack gap="md">
            <span class="text-secondary">Time Until Payoff</span>

            <Flex align="baseline" gap="sm" class="timeline-details">
              <h3>{{ formattedPayoffMonths }} {{ estimatedPayoffMonths === Infinity ? '' : 'months' }}</h3>
              <small class="text-secondary">{{ estimatedPayoffDate }}</small>
            </Flex>
          </Flex>
        </Flex>
      </DashboardCard>

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
const estimatedPayoffMonths = computed(() => (priorityDebt.value ? calculatePayoffMonths(priorityDebt.value) : 0))
const estimatedPayoffDate = computed(() => (priorityDebt.value ? calculatePayoffDate(priorityDebt.value) : ''))
const unableToPayoff = computed(() => estimatedPayoffMonths.value === Infinity)
const formattedPayoffMonths = computed(() => `${estimatedPayoffMonths.value}`)
const averageAPR = computed(() => calculateAverageAPR(debts.value))
</script>

<style scoped>
.metric-value {
  font-size: calc(var(--text-h1) * 1.25); /* 2.5rem -> using h1 as base */
}

.debt-apr {
  font-size: var(--text-h3);
  font-weight: 600;
}

.debt-balance h3,
.debt-payment h3 {
  font-size: var(--text-h2);
  margin: 0;
}

.timeline-details h3 {
  font-size: var(--text-h2);
  margin: 0;
  color: var(--color-text-primary);
}

.text-notice-red {
  color: var(--color-notice-red-text);
}
</style>
