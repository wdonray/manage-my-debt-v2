<template>
  <div class="container" v-if="user">
    <Flex stack gap="md" v-auto-animate>
      <Flex align="baseline">
        <span class="text-secondary">{{ user.email }}</span>
        <small>
          <NuxtLink class="highlight" to="/profile">Edit Profile</NuxtLink>
        </small>
      </Flex>

      <Flex align="center">
        <FlexSpace />
        <Button class="btn-outline btn-small" @click="resetForm" v-if="editingDebt">Cancel Edit</Button>
        <Button class="btn-primary btn-small" @click="showForm = !showForm" v-else>
          {{ showForm ? 'Cancel' : 'Add New Debt' }}
        </Button>
      </Flex>

      <Card v-if="showForm" border>
        <Flex stack gap="md">
          <h3>{{ editingDebt ? 'Edit Debt' : 'Add New Debt' }}</h3>

          <FormWithValidation @submit="saveDebt">
            <Grid columns="1fr 1fr 1fr 1fr">
              <FieldText v-model="formData.name" label="Name" optional placeholder="e.g., Chase Credit Card" />
              <FieldCurrency v-model="formData.balance" label="Balance *" validations="required|min_value:1" />
              <FieldPercentage v-model="formData.apr" label="APR (%) *" validations="required|min_value:1" />
              <FieldCurrency
                v-model="formData.min_payment"
                label="Minimum Payment *"
                validations="required|min_value:1"
              />
              <FieldCurrency
                v-model="formData.extra_payment"
                label="Extra Payment"
                optional
                validations="min_value:0"
              />
              <FieldText v-model="formData.due_date" label="Due Date" type="date" optional />
            </Grid>
            <Flex style="justify-content: flex-end">
              <Button class="btn-primary" type="submit" :disabled="loading">
                {{ editingDebt ? 'Update Debt' : 'Add Debt' }}
              </Button>
            </Flex>
          </FormWithValidation>
        </Flex>
      </Card>

      <div v-if="loading" class="text-center">
        <p>Loading debts...</p>
      </div>

      <Notice v-else-if="error" type="error" role="alert">Failed to load debts: {{ error.message }}</Notice>

      <div v-else-if="debts.length > 0">
        <DataTable :rows="debts" :columns borderless striped>
          <template #name="{ row }">
            <div>{{ row.name || 'Unnamed Debt' }}</div>
          </template>

          <template #balance="{ row }">
            <div>{{ formatCurrency(row.balance) }}</div>
          </template>

          <template #apr="{ row }">
            <div>{{ formatPercentage(row.apr) }}</div>
          </template>

          <template #min_payment="{ row }">
            <div>{{ formatCurrency(row.min_payment) }}</div>
          </template>

          <template #extra_payment="{ row }">
            <div>{{ formatCurrency(row.extra_payment) }}</div>
          </template>

          <template #due_date="{ row }">
            <div>{{ row.due_date ? formatDate(row.due_date) : 'Not set' }}</div>
          </template>

          <template #actions="{ row }">
            <Flex gap="sm">
              <Button class="btn-text btn-small" @click="editDebt(row)" :disabled="loading">Edit</Button>
              <Button class="btn-text btn-small" @click="removeDebt(row.id)" :disabled="loading">Delete</Button>
            </Flex>
          </template>
        </DataTable>
      </div>
      <Notice v-else type="info" role="alert">
        <p>No debts found. Add your first debt to get started!</p>
      </Notice>

      <Flex justify="end">
        <Button class="btn-outline btn-small" @click="signOut">Sign Out</Button>
      </Flex>
    </Flex>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import useDebts from '~/composables/useDebts'
import type { Debt, DebtCreatePayload } from '~/types/database'

const { user, signOut } = useAuth()
const { debts, loading, error, addDebt, updateDebt, removeDebt } = useDebts()

const showForm = ref(false)
const editingDebt = ref<Debt | null>(null)
const formData = ref<DebtCreatePayload>(emptyFormData())

const columns = [
  { key: 'name', display: 'Name' },
  { key: 'balance', display: 'Balance' },
  { key: 'apr', display: 'APR' },
  { key: 'min_payment', display: 'Min Payment' },
  { key: 'extra_payment', display: 'Extra Payment' },
  { key: 'due_date', display: 'Due Date' },
  { key: 'actions', display: '' },
]

function emptyFormData(): DebtCreatePayload {
  return { balance: 0, apr: 0, min_payment: 0 }
}

function resetForm() {
  editingDebt.value = null
  showForm.value = !showForm.value
  formData.value = emptyFormData()
}

function editDebt(debt: Debt) {
  editingDebt.value = debt
  const { id, user_id, created_at, updated_at, ...editableData } = debt
  formData.value = editableData
  showForm.value = true
}

async function saveDebt() {
  if (editingDebt.value) {
    await updateDebt(editingDebt.value.id, formData.value)
  } else {
    await addDebt(formData.value)
  }

  resetForm()
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  padding: var(--spacing-lg);
}
</style>
