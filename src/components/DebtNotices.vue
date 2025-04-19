<template>
  <Flex v-auto-animate stack gap="md" class="debt-notices">
    <!-- High APR Warning -->
    <Notice v-if="showInterestAlert" align="start" type="warning" size="xs">
      <Flex stack gap="sm">
        <strong>High Interest Rate Priority</strong>
        <span>
          This {{ formatPercentage(debouncedValues.apr) }} APR is significantly above average.
          <template v-if="debouncedValues.balance && debouncedValues.balance > 0">
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
            balance ? formatCurrency(calculateRecommendedMinPayment(balance)) : '$0.00'
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
const props = defineProps<{
  balance: number
  apr: number
  minPayment: number
  extraPayment: number
}>()

interface DebouncedValues {
  balance: number | undefined
  apr: number | undefined
  minPayment: number | undefined
  extraPayment: number | undefined
}

// Debounced values
const debouncedValues = ref<DebouncedValues>({
  balance: props.balance,
  apr: props.apr,
  minPayment: props.minPayment,
  extraPayment: props.extraPayment,
})

// Watch all props with a single watcher
watch(
  props,
  (newProps) => {
    setTimeout(() => {
      debouncedValues.value = {
        balance: newProps.balance,
        apr: newProps.apr,
        minPayment: newProps.minPayment,
        extraPayment: newProps.extraPayment,
      }
    }, 1000)
  },
  { deep: true }
)

// Update computed properties to use utility functions
const showInterestAlert = computed(
  () => isHighAPR(Number(debouncedValues.value.apr)) && Number(debouncedValues.value.balance) > 0
)

const showLargeBalanceAlert = computed(
  () => isLargeBalance(Number(debouncedValues.value.balance)) && isHighAPR(Number(debouncedValues.value.apr))
)

const showMinPaymentAlert = computed(() => {
  const balance = Number(debouncedValues.value.balance || 0)
  const minPayment = Number(debouncedValues.value.minPayment || 0)
  return isMinPaymentTooLow(balance, minPayment)
})

const showExtraPaymentNote = computed(
  () => Number(debouncedValues.value.extraPayment) > 0 && isHighAPR(Number(debouncedValues.value.apr))
)

const interestPerYear = computed(() =>
  formatCurrency(
    calculateYearlyInterest(Number(debouncedValues.value.balance || 0), Number(debouncedValues.value.apr || 0))
  )
)
</script>
