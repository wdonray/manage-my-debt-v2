<template>
  <Flex stack>
    <h1>Edit Debt</h1>
    <DebtForm :id />
  </Flex>
</template>

<script setup>
useSeoMeta({
  title: 'Update Debt Details | Manage My Debt',
  description:
    'Keep your debt information accurate to get the best payoff recommendations and track your progress with confidence.',
  ogTitle: 'Edit Debt – Optimize Your Payoff Plan',
  ogDescription: 'Update balances, rates, and payments to ensure your debt payoff strategy is always up to date.',
  twitterCard: 'summary_large_image',
})
const { id } = useRoute().params
</script>
