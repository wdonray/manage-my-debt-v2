<template>
  <header>
    <Flex align="baseline" style="padding: 0 var(--spacing-md)">
      <FlexSpace />

      <template v-if="mobile">
        <Sheet v-model="isDrawerOpen">
          <Flex stack>
            <NavItem to="/debts" icon="ph:notebook-bold" label="View All Debts" />
            <NavItem to="/debts/new" icon="ph:plus-circle-bold" label="Add New Debt" />
            <NavItem to="/payment-schedule" icon="ph:calendar-bold" label="Payment Schedule" />
            <NavItem to="/goals" icon="ph:target-bold" label="Financial Goals" />
            <FlexSpace />
            <NavItem to="/help" icon="ph:question-bold" label="Get Help" />
            <NavItem to="/profile" icon="ph:user-gear-bold" label="Settings" />
            <NavItem to="/logout" icon="ph:sign-out-bold" label="Sign Out" class="logout-item" />
          </Flex>
        </Sheet>

        <AppearanceToggle />

        <Button
          class="mobile-toggle btn-text"
          style="color: var(--appearance-toggle-color)"
          @click="isDrawerOpen = !isDrawerOpen"
        >
          <Icon :name="isDrawerOpen ? 'ph:x' : 'ph:list'" size="24" />
        </Button>
      </template>
    </Flex>
  </header>
</template>

<script setup lang="ts">
const { mobile } = useBreakpoint()
const isDrawerOpen = ref(false)
</script>

<style scoped>
header {
  padding-top: calc(var(--spacing-md) + env(safe-area-inset-top));
  width: 100%;
  z-index: 5;
  max-width: 1200px;
}

.mobile-toggle {
  z-index: 101;
}

.logout-item {
  color: var(--color-notice-red-text);
}
</style>
