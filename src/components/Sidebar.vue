<template>
  <div class="sidebar-container">
    <aside v-if="!mobile" class="sidebar">
      <Flex align="center" justify="center" class="sidebar-header">
        <NuxtLink to="/" class="header-link">
          <Icon name="ph:wallet-bold" size="24" />
          <span>Manage My Debt</span>
        </NuxtLink>
      </Flex>

      <nav class="sidebar-nav">
        <NavItem to="/debts" icon="ph:notebook-bold" label="View All Debts" />
        <NavItem to="/payment-schedule" icon="ph:calendar-bold" label="Payment Schedule" />
        <NavItem to="/goals" icon="ph:target-bold" label="Financial Goals" />

        <FlexSpace />

        <NavGroup :title="profile.username || profile.full_name || 'Account'" reverse>
          <template #icon>
            <Avatar size="32" />
          </template>
          <NavItem to="/help" icon="ph:question-bold" label="Get Help" />
          <NavItem to="/profile" icon="ph:user-gear-bold" label="Profile" />
          <NavItem to="/logout" icon="ph:sign-out-bold" label="Sign Out" class="logout-item" />
        </NavGroup>
      </nav>
    </aside>
  </div>
</template>

<script setup lang="ts">
import type { Profile } from '~/types/database'
const { mobile } = useBreakpoint()
const profile: Ref<Profile> = useState('profile', () => ({}) as Profile)
</script>

<style>
.light {
  --color-sidebar-background: var(--color-gray-900);
  --color-sidebar-text: var(--color-gray-300);
  --color-header-background: var(--color-gray-900);
  --color-sidebar-hover: var(--color-gray-800);
  --color-sidebar-active: var(--color-gray-700);
}

.dark {
  --color-sidebar-background: var(--color-gray-800);
  --color-sidebar-text: var(--color-white);
  --color-header-background: var(--color-gray-800);
  --color-sidebar-hover: var(--color-gray-700);
  --color-sidebar-active: var(--color-gray-600);
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
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
}

.sidebar-header {
  padding: var(--spacing-md) 0;
  margin-bottom: var(--spacing-lg);
  font-weight: 600;
  font-size: var(--text-h3);
}

.header-link {
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-white);
  transition: opacity 0.2s ease;
}

.header-link:hover {
  opacity: 0.9;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: var(--text-small);
  color: var(--color-sidebar-text);
}

.nav-item:hover {
  background: var(--color-sidebar-hover);
}

.nav-item.active {
  background: var(--color-sidebar-active);
  font-weight: 500;
  color: var(--color-white);
}

.logout-item {
  color: var(--color-notice-red-text);
}

.logout-item:hover {
  background: var(--color-notice-red);
  color: var(--color-white);
}
</style>
