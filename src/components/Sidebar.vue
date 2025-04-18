<template>
  <div class="sidebar-container">
    <aside v-if="!mobile" class="sidebar">
      <Flex align="center" justify="center" class="sidebar-header">
        <NuxtLink to="/" class="header-link">
          <span>Manage My Debt</span>
        </NuxtLink>
      </Flex>

      <nav class="sidebar-nav">
        <NavGroup title="Debts" icon="ph:credit-card">
          <NavItem to="/debts" icon="ph:list" label="My Debts" />
          <NavItem to="/debts/new" icon="ph:plus-circle" label="Add Debt" />
        </NavGroup>

        <NavItem to="/payment-schedule" icon="ph:calendar" label="Payment Schedule" />
        <NavItem to="/goals" icon="ph:trophy" label="Goals" />
        <FlexSpace />
        <NavItem to="/help" icon="ph:question" label="Help" />
        <NavItem to="/profile" icon="ph:user" label="Profile" />
        <NavItem to="/logout" icon="ph:sign-out" label="Sign Out" />
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
const { mobile } = useBreakpoint()
</script>

<style>
.light {
  --color-sidebar-background: var(--color-gray-900);
  --color-sidebar-text: var(--color-gray-300);
  --color-header-background: var(--color-gray-900);
}

.dark {
  --color-sidebar-background: var(--color-gray-800);
  --color-sidebar-text: var(--color-white);
  --color-header-background: var(--color-gray-800);
}
</style>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-sidebar-background);
  color: var(--color-sidebar-text);
  padding: var(--spacing-md);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
  font-size: var(--text-h3);
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.nav-item.active {
  font-weight: 500;
}

.header-link {
  text-decoration: none;
  white-space: nowrap;
}

.header-link:hover {
  opacity: 0.9;
}
</style>
