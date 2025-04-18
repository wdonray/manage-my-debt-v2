<template>
  <Flex v-if="user && profileLoaded && debtsLoaded" stack class="container">
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

      <Notice v-if="debts.length === 0" type="info" role="alert">
        Let's get started by adding your first debt
        <template #actions>
          <NuxtLink to="/debts/new">
            <Button class="btn-primary btn-small">Add Debt</Button>
          </NuxtLink>
        </template>
      </Notice>
    </section>

    <Notice v-if="totalMonthlyPayments > totalDebt" type="warning" role="alert">
      <small>
        Your total monthly payments ({{ formatCurrency(totalMonthlyPayments) }}) exceed your total debt ({{
          formatCurrency(totalDebt)
        }}). Please review your debt entries in
        <NuxtLink to="/debts" class="highlight">Debts.</NuxtLink>
      </small>
    </Notice>

    <section class="quick-actions">
      <QuickActions />
      <hr />
    </section>

    <Flex stack gap="xl">
      <section class="debt-summary">
        <Grid columns="1fr 1fr 1fr" gap="md">
          <DashboardCard icon="ph:money" title="Total Debt" color="var(--color-notice-blue)">
            <h2>{{ formatCurrency(totalDebt) }}</h2>
          </DashboardCard>

          <DashboardCard icon="ph:calendar-check" title="Monthly Payments" color="var(--color-notice-blue)">
            <h2>{{ formatCurrency(totalMonthlyPayments) }}</h2>
          </DashboardCard>

          <DashboardCard icon="ph:rocket" title="Extra Payment" color="var(--color-notice-blue)">
            <h2>{{ formatCurrency(totalExtraPayment) }}</h2>
          </DashboardCard>
        </Grid>
      </section>

      <section class="debt-overview">
        <Grid columns="1fr 1fr" gap="md">
          <DashboardCard color="var(--color-notice-green)">
            <template #title>
              <Flex align="center" gap="sm">
                <Icon name="ph:target" size="24" style="color: var(--color-notice-green)" />
                <h3 style="margin: 0">Priority Debt</h3>
                <small class="text-secondary">(Highest APR)</small>
              </Flex>
            </template>

            <Flex v-if="priorityDebt" stack>
              <Flex gap="sm">
                <span class="text-secondary">Name</span>
                <strong>{{ priorityDebt.name || 'Unnamed Debt' }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">APR</span>
                <strong>{{ formatPercentage(priorityDebt.apr) }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">Balance</span>
                <strong>{{ formatCurrency(priorityDebt.balance) }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">Monthly Payment</span>
                <strong>{{ formatCurrency(priorityDebt.min_payment + (priorityDebt.extra_payment || 0)) }}</strong>
              </Flex>
            </Flex>

            <p v-else class="text-secondary">No debts found</p>
          </DashboardCard>

          <DashboardCard color="var(--color-notice-green)">
            <template #title>
              <Flex align="center" gap="sm">
                <Icon name="ph:chart-line-up" size="24" style="color: var(--color-notice-green)" />
                <h3 style="margin: 0">Debt Overview</h3>
              </Flex>
            </template>

            <Flex stack>
              <Flex gap="sm">
                <span class="text-secondary">Total Debts</span>
                <strong>{{ debts.length }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">Average APR</span>
                <strong>{{ formatPercentage(averageApr) }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">Total Interest Rate</span>
                <strong>{{ formatPercentage(totalInterestRate) }}</strong>
              </Flex>

              <Flex gap="sm">
                <span class="text-secondary">Total Debt</span>
                <strong>{{ formatCurrency(totalDebt) }}</strong>
              </Flex>
            </Flex>
          </DashboardCard>
        </Grid>
      </section>

      <section v-if="nextDebts.length > 0" class="next-debts">
        <Flex align="center" gap="sm" style="margin-bottom: var(--spacing-md)">
          <Icon name="ph:list-numbers" size="24" color="var(--color-blue-500)" />
          <h3 style="margin: 0">Next Priority Debts</h3>
        </Flex>
        <Grid columns="1fr 1fr" gap="md">
          <DashboardCard v-for="(debt, index) in nextDebts" :key="debt.id" color="var(--color-notice-green)">
            <template #title>
              <Flex align="center" gap="sm">
                <Icon
                  :name="index === 0 ? 'ph:number-circle-one' : 'ph:number-circle-two'"
                  size="24"
                  color="var(--color-notice-green)"
                />
                <span class="text-secondary">Name</span>
              </Flex>
            </template>
            <Flex stack>
              <Flex gap="sm">
                <span class="text-secondary">Name</span>
                <strong>{{ debt.name || 'Unnamed Debt' }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">APR</span>
                <strong>{{ formatPercentage(debt.apr) }}</strong>
              </Flex>
              <Flex gap="sm">
                <span class="text-secondary">Balance</span>
                <strong>{{ formatCurrency(debt.balance) }}</strong>
              </Flex>
            </Flex>
          </DashboardCard>
        </Grid>
      </section>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
const { profile, loaded: profileLoaded } = useProfile()
const { user } = useAuth()
const { debts, loaded: debtsLoaded } = useDebts()
const { mobile } = useBreakpoint()

const name = computed(() => profile.value?.username || profile.value?.full_name)
const totalDebt = computed(() => debts.value.reduce((acc, debt) => acc + debt.balance, 0))
const totalMonthlyPayments = computed(() => debts.value.reduce((acc, debt) => acc + debt.min_payment, 0))
const totalExtraPayment = computed(() => debts.value.reduce((acc, debt) => acc + (debt.extra_payment || 0), 0))

// Sort debts by APR in descending order
const sortedDebts = computed(() => [...debts.value].sort((a, b) => b.apr - a.apr))
const priorityDebt = computed(() => sortedDebts.value[0])
const nextDebts = computed(() => sortedDebts.value.slice(1, 3)) // Show next 2 highest APR debts

// Calculate average APR
const averageApr = computed(() => {
  if (debts.value.length === 0) return 0
  const totalApr = debts.value.reduce((acc, debt) => acc + debt.apr, 0)
  return totalApr / debts.value.length
})

// Calculate total interest rate (weighted by balance)
const totalInterestRate = computed(() => {
  if (debts.value.length === 0) return 0
  const totalBalance = totalDebt.value
  if (totalBalance === 0) return 0
  return debts.value.reduce((acc, debt) => acc + debt.apr * debt.balance, 0) / totalBalance
})
</script>
