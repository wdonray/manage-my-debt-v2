<template>
  <Grid columns="1fr 1fr 1fr" class="quick-actions">
    <NuxtLink v-for="action in actions" :key="action.label" :to="action.to" class="link" :aria-label="action.ariaLabel">
      <Card border class="quick-action" disable-fetching :shadow="false">
        <Flex>
          <Icon :name="action.icon" size="32" :style="{ color: action.color }" />
          <div class="action-text">
            <strong>{{ action.label }}</strong>
            <span class="subtitle">{{ action.subtitle }}</span>
          </div>
        </Flex>
      </Card>
    </NuxtLink>
  </Grid>
</template>

<script setup lang="ts">
const actions = [
  {
    icon: 'ph:plus-circle',
    label: 'Add Debt',
    subtitle: 'Record a new liability',
    to: '/debts/new',
    ariaLabel: 'Add a new debt to track',
    color: 'var(--color-notice-green)',
  },
  {
    icon: 'ph:calendar',
    label: 'Payment Schedule',
    subtitle: 'View upcoming payments',
    to: '/calendar',
    ariaLabel: 'View your debt payment schedule',
    color: 'var(--color-notice-blue)',
  },
  {
    icon: 'ph:trophy',
    label: 'Goals',
    subtitle: 'Track your milestones',
    to: '/goals',
    ariaLabel: 'View and manage your debt payoff goals',
    color: 'var(--color-notice-yellow)',
  },
]
</script>

<style>
.light {
  --color-quick-action-hover: var(--color-gray-200);
}

.dark {
  --color-quick-action-hover: var(--color-gray-700);
}
</style>

<style scoped>
.quick-actions {
  padding-block: var(--spacing-md);
}

.quick-action {
  padding: var(--spacing-md);
  cursor: pointer;
}

.link {
  text-decoration: none;
}

.action-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.quick-action:hover {
  background-color: var(--color-quick-action-hover);
}

.quick-action:active {
  transform: translateY(0);
}
</style>
