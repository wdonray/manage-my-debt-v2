<template>
  <div class="sidebar-container">
    <aside v-if="!mobile" class="sidebar">
      <div class="sidebar-header">
        <NuxtLink to="/" class="header-link">
          <span>Manage My Debt</span>
        </NuxtLink>

        <FlexSpace />

        <Button
          class="btn-text appearance-toggle"
          style="color: var(--appearance-toggle-color)"
          @click="toggleColorMode"
          :aria-label="colorMode.preference === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
        >
          <Icon :name="appearanceIconName" size="24" aria-hidden="true" />
        </Button>
      </div>

      <nav class="sidebar-nav">
        <NavGroup title="Debts" icon="ph:bank">
          <NavItem to="/debts" icon="ph:list" label="All Debts" />
          <NavItem to="/payment-plan" icon="ph:calendar-check" label="Payment Plan" />
          <NavItem to="/calendar" icon="ph:calendar" label="Calendar" />
        </NavGroup>

        <NavGroup title="Analytics" icon="ph:chart-line">
          <NavItem to="/reports" icon="ph:file-text" label="Reports" />
          <NavItem to="/goals" icon="ph:trophy" label="Goals" />
        </NavGroup>

        <NavItem to="/help" icon="ph:question" label="Help" />
        <NavItem to="/profile" icon="ph:user" label="Profile" />
        <NavItem to="/logout" icon="ph:sign-out" label="Logout" />
      </nav>
    </aside>

    <Sheet v-model="isDrawerOpen" v-else>
      <NavItem to="/" icon="ph:house" label="Dashboard" />

      <NavGroup title="Debts" icon="ph:bank">
        <NavItem to="/debts" icon="ph:list" label="All Debts" />
        <NavItem to="/payment-plan" icon="ph:calendar-check" label="Payment Plan" />
        <NavItem to="/calendar" icon="ph:calendar" label="Calendar" />
      </NavGroup>

      <NavGroup title="Analytics" icon="ph:chart-line">
        <NavItem to="/reports" icon="ph:file-text" label="Reports" />
        <NavItem to="/goals" icon="ph:trophy" label="Goals" />
      </NavGroup>

      <NavItem to="/help" icon="ph:question" label="Help" />
      <NavItem to="/profile" icon="ph:user" label="Profile" />
      <NavItem to="/logout" icon="ph:sign-out" label="Logout" />
    </Sheet>

    <Button
      v-if="mobile"
      class="mobile-toggle btn-text"
      style="color: var(--appearance-toggle-color)"
      @click="isDrawerOpen = !isDrawerOpen"
    >
      <Icon :name="isDrawerOpen ? 'ph:x' : 'ph:list'" size="24" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isDrawerOpen = ref(false)
const { mobile } = useBreakpoint()
const colorMode = useColorMode()

const appearanceIconName = computed(() => (colorMode.preference === 'light' ? 'ph:moon-fill' : 'ph:sun-dim-fill'))

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}
</script>

<style>
.light {
  --color-sidebar-bg: #fafafa;
}

.dark {
  --color-sidebar-bg: #1d1d1d;
}
</style>

<style scoped>
.sidebar-container {
  position: relative;
}

.sidebar {
  width: 245px;
  height: 100vh;
  background: var(--color-sidebar-bg);
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
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: var(--spacing-md);
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

.mobile-toggle {
  position: fixed;
  top: var(--spacing-md);
  right: var(--spacing-xl);
  z-index: 101;
}

.drawer-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
}

.header-link {
  text-decoration: none;
  white-space: nowrap;
}

.header-link:hover {
  opacity: 0.9;
}
</style>
