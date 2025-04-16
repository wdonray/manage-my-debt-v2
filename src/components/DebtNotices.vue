<template>
  <Flex stack gap="md" class="debt-notices" v-auto-animate>
    <!-- High APR Warning -->
    <Notice v-if="showInterestAlert" align="start" type="warning" size="xs">
      <Flex stack gap="sm">
        <strong>High Interest Rate Priority</strong>
        <span>
          This {{ formatPercentage(apr) }} APR is significantly above average.
          <template v-if="balance && balance > 0">
            At this rate, you'll pay approximately {{ interestPerYear }} in interest per year if the balance remains
            unchanged. Following the debt avalanche method, this high-APR debt should be prioritized for additional
            payments after meeting minimum payments on all debts.
          </template>
        </span>
      </Flex>
    </Notice>

    <!-- Large Balance with High APR Warning -->
    <Notice v-if="showLargeBalanceAlert" align="start" type="info" size="xs">
      <Flex stack gap="sm">
        <strong>Large Balance Strategy Note</strong>
        <span>
          While this balance is substantial, remember that the debt avalanche method focuses on APR rather than balance
          size. Stay motivated by tracking your interest savings rather than the balance reduction.
        </span>
      </Flex>
    </Notice>

    <!-- Minimum Payment vs Balance Warning -->
    <Notice v-if="showMinPaymentAlert" align="start" type="warning" size="xs">
      <Flex stack gap="sm">
        <strong>Minimum Payment Alert</strong>
        <span>
          Your minimum payment is less than {{ formatPercentage(MIN_PAYMENT_THRESHOLD) }} of your balance ({{
            balance ? formatCurrency(balance * MIN_PAYMENT_THRESHOLD) : '$0.00'
          }}
          recommended). Consider increasing your minimum payment to avoid prolonged debt repayment.
        </span>
      </Flex>
    </Notice>

    <!-- Extra Payment Strategy Notice -->
    <Notice v-if="showExtraPaymentNote" align="start" type="success" size="xs">
      <Flex stack gap="sm">
        <strong>Extra Payment Strategy</strong>
        <span>
          Great! Your extra payment of {{ extraPayment ? formatCurrency(extraPayment) : '$0.00' }} will be applied to
          your highest-APR debt, maximizing your interest savings. This follows the debt avalanche method for optimal
          debt reduction.
        </span>
      </Flex>
    </Notice>
  </Flex>
</template>

<script setup lang="ts">
// Constants in human-readable format
const MIN_PAYMENT_PERCENTAGE = 3 // 3%
const LARGE_BALANCE_AMOUNT = 10000 // $10,000
const HIGH_APR_PERCENTAGE = 20 // 20%

// Converted constants for internal use
const MIN_PAYMENT_THRESHOLD = MIN_PAYMENT_PERCENTAGE / 100
const LARGE_BALANCE_THRESHOLD = LARGE_BALANCE_AMOUNT
const HIGH_APR_THRESHOLD = HIGH_APR_PERCENTAGE * 10000 // Convert to internal APR format

// Props
interface Props {
  balance: number
  apr: number
  minPayment: number
  extraPayment: number
}

const props = defineProps<Props>()

// Helper functions for APR calculations
function calculateYearlyInterest(balance: number, apr: number): number {
  return balance * (apr / 1000000) // Divide by 1M because apr is in 10000ths
}

// Computed properties
const showInterestAlert = computed(() => Number(props.apr) >= HIGH_APR_THRESHOLD && Number(props.balance) > 0)

const showLargeBalanceAlert = computed(
  () => Number(props.balance) >= LARGE_BALANCE_THRESHOLD && Number(props.apr) >= HIGH_APR_THRESHOLD
)

const showMinPaymentAlert = computed(() => {
  const balance = Number(props.balance || 0)
  const minPayment = Number(props.minPayment || 0)
  return balance > 0 && minPayment > 0 && minPayment < balance * MIN_PAYMENT_THRESHOLD
})

const showExtraPaymentNote = computed(() => Number(props.extraPayment) > 0 && Number(props.apr) >= HIGH_APR_THRESHOLD)

const interestPerYear = computed(() =>
  formatCurrency(calculateYearlyInterest(Number(props.balance || 0), Number(props.apr || 0)))
)
</script>
