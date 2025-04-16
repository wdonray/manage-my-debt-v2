<template>
  <header>
    <Flex align="baseline" style="padding: 0 var(--spacing-md)">
      <FlexSpace />

      <Avatar v-if="!mobile" />

      <template v-else>
        <Sheet v-model="isDrawerOpen">
          <Flex>
            <FlexSpace />
            <Avatar />
          </Flex>

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
</style>
