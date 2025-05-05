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
        <NavItem to="/debts" icon="ph:notebook" label="View All Debts" />
        <NavItem to="/payment-schedule" icon="ph:calendar" label="Payment Schedule" />
        <NavItem to="/goals" icon="ph:target" label="Financial Goals" />

        <FlexSpace />

        <NavGroup :title="profile.username || profile.full_name || 'Account'" reverse :local-storage="false">
          <template #icon>
            <Avatar size="32" />
          </template>
          <NavItem to="/help" icon="ph:question" label="Get Help" />
          <NavItem to="/profile" icon="ph:user-gear" label="Profile" />
          <NavAction label="Appearance">
            <AppearanceToggle :size="18" outline />
          </NavAction>
          <NavItem to="/logout" icon="ph:sign-out" label="Sign Out" class="logout-item" />
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
  --color-sign-out-text-hover: var(--color-red-500);
  --appearance-toggle-color: var(--color-gray-50);
}

.dark {
  --color-sidebar-background: var(--color-gray-800);
  --color-sidebar-text: var(--color-white);
  --color-header-background: var(--color-gray-800);
  --color-sign-out-text-hover: var(--color-red-400);
  --appearance-toggle-color: var(--color-gray-50);
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
  gap: var(--spacing-md);
  flex: 1;
}

.logout-item {
  color: var(--color-notice-red-text);
}

.logout-item:hover {
  background: var(--color-notice-red);
  color: var(--color-sign-out-text-hover);
}
</style>
