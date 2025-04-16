<template>
  <Flex stack>
    <h1>Edit Debt</h1>
    <DebtForm :id />
  </Flex>
</template>

<script setup>
const { id } = useRoute().params

</script>
