<template>
  <Grid v-if="render" columns="1.618fr 1fr" gap="xl" style="position: relative">
    <FormWithValidation @submit="submit">
      <Card border class="form-card">
        <Flex v-auto-animate stack>
          <section v-if="currentStep === steps.BASIC_INFO" v-auto-animate class="form-section">
            <h3 class="section-title">
              <Icon name="ph:info-bold" size="24" class="section-icon" />
              Basic Debt Details
            </h3>
            <FieldText
              v-model="formData.name"
              label="Debt Name"
              name="name"
              optional
              placeholder="e.g., Credit Card, Student Loan, Car Loan"
              description="Give this debt a recognizable name to track it in your avalanche strategy"
            />
            <FieldCurrency
              v-model="formData.balance"
              label="Current Balance *"
              name="balance"
              validations="required|min_value:1"
              description="The total amount you currently owe. This helps determine your debt payoff timeline"
            />
            <FieldPercentage
              v-model="formData.apr"
              label="Interest Rate (APR) *"
              name="apr"
              validations="required|min_value:0"
              description="Annual Percentage Rate - The avalanche method targets high-interest debts first to minimize interest costs"
            />
          </section>

          <section v-else-if="currentStep === steps.PAYMENT_DETAILS" class="form-section">
            <h3 class="section-title">
              <Icon name="ph:chart-line-up-bold" size="24" class="section-icon" />
              Payment Plan
            </h3>
            <FieldCurrency
              v-model="formData.min_payment"
              label="Required Monthly Payment *"
              name="min_payment"
              validations="required|min_value:1"
              description="The minimum amount due each month. The avalanche method requires keeping all minimum payments current"
            />
            <FieldCurrency
              v-model="formData.extra_payment"
              label="Extra Monthly Payment"
              name="extra_payment"
              optional
              validations="min_value:0"
              description="Additional amount you can put toward this debt. The avalanche method will direct extra payments to your highest-interest debt"
            />
            <FieldText
              v-model="formData.start_date"
              label="Tracking Start Date"
              type="date"
              name="start_date"
              optional
              description="When you started tracking this debt. Helps visualize your progress over time"
            />
            <FieldText
              v-model="formData.due_date"
              label="Monthly Due Date"
              type="date"
              name="due_date"
              optional
              description="When your payment is due each month. Important for maintaining on-time payments across all debts"
            />
          </section>

          <section v-else-if="currentStep === steps.ADDITIONAL_SETTINGS" class="form-section">
            <h3 class="section-title">
              <Icon name="ph:sliders-bold" size="24" class="section-icon" />
              Advanced Settings
            </h3>
            <FieldSelect
              v-model="formData.status"
              label="Payment Status"
              :options="statusOptions"
              name="status"
              optional
              description="Track if this debt is current or needs attention. The avalanche method works best when all payments are up-to-date"
            />
            <FieldText
              v-model="formData.priority_order"
              type="number"
              label="Custom Priority Override"
              name="priority_order"
              optional
              validations="min_value:0"
              description="Override the automatic highest-interest-first ordering. Note: Following the standard avalanche method maximizes your interest savings"
            />
          </section>

          <Flex justify="space-between" class="form-actions">
            <Button class="btn-outline" type="button" @click="cancel">
              <Flex align="center" gap="sm">
                <Icon v-if="currentStep === steps.BASIC_INFO" name="ph:x-bold" size="20" />
                <Icon v-else name="ph:arrow-left-bold" size="20" />
                {{ currentStep === steps.BASIC_INFO ? 'Cancel' : 'Previous' }}
              </Flex>
            </Button>

            <Button class="btn-primary" type="submit" :disabled="loading">
              <Flex align="center" gap="sm">
                {{ currentStep === steps.ADDITIONAL_SETTINGS ? 'Save Debt' : 'Continue' }}
                <Icon v-if="currentStep !== steps.ADDITIONAL_SETTINGS" name="ph:arrow-right-bold" size="20" />
                <Icon v-else name="ph:check-bold" size="20" />
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Card>
    </FormWithValidation>

    <Flex v-auto-animate stack>
      <div>
        <Card :shadow="false" border class="preview-card">
          <h3 class="preview-title">
            <Icon name="ph:calculator-bold" size="24" class="preview-icon" />
            Debt Summary
          </h3>

          <hr class="preview-divider" />

          <Flex v-auto-animate stack gap="xl">
            <Flex v-if="formData.name" class="preview-item">
              <strong>Debt Name</strong>
              <FlexSpace />
              <span>{{ formData.name }}</span>
            </Flex>

            <Flex class="preview-item">
              <strong>Balance</strong>
              <FlexSpace />
              <span>{{ formData.balance ? formatCurrency(formData.balance) : '—' }}</span>
            </Flex>

            <Flex class="preview-item">
              <strong>Interest Rate</strong>
              <FlexSpace />
              <span :class="{ 'high-interest': isHighInterest(Number(formData.apr || 0)) }">
                {{ formatPercentage(formData.apr) }}
              </span>
            </Flex>

            <Flex class="preview-item">
              <strong>Monthly Payment</strong>
              <FlexSpace />
              <span>{{ formData.min_payment ? formatCurrency(formData.min_payment) : '—' }}</span>
            </Flex>

            <Flex v-if="formData.extra_payment" class="preview-item highlight-extra">
              <strong>Extra Payment</strong>
              <FlexSpace />
              <span class="extra-payment">+{{ formatCurrency(formData.extra_payment) }}</span>
            </Flex>

            <Flex v-if="formData.start_date" class="preview-item">
              <strong>Started Tracking</strong>
              <FlexSpace />
              <span>{{ formatDate(formData.start_date) }}</span>
            </Flex>

            <Flex v-if="formData.due_date" class="preview-item">
              <strong>Payment Due</strong>
              <FlexSpace />
              <span>{{ formatDate(formData.due_date) }}</span>
            </Flex>

            <Flex v-if="formData.status" class="preview-item">
              <strong>Status</strong>
              <FlexSpace />
              <span class="status-badge" :class="{ ['status-' + formData.status]: true }">
                {{ statusOptions.find((option) => option.key === formData.status)?.display }}
              </span>
            </Flex>

            <Flex v-if="formData.priority_order" class="preview-item">
              <strong>Custom Priority</strong>
              <FlexSpace />
              <span class="priority-order">#{{ formData.priority_order }}</span>
            </Flex>
          </Flex>
        </Card>
      </div>

      <DebtNotices
        :balance="Number(formData.balance || 0)"
        :apr="Number(formData.apr || 0)"
        :min-payment="Number(formData.min_payment || 0)"
        :extra-payment="Number(formData.extra_payment || 0)"
      />
    </Flex>
  </Grid>
</template>

<script setup lang="ts">
import type { DebtCreatePayload, DebtUpdatePayload } from '~/types/database'

const props = defineProps<{
  id?: string
}>()

const editing = Boolean(props.id)

const formData = ref<DebtCreatePayload | DebtUpdatePayload>({
  name: '',
  balance: 0,
  apr: 0,
  min_payment: 0,
  extra_payment: 0,
  status: null,
  start_date: '',
  due_date: '',
  priority_order: 0,
})

const statusOptions = [
  { key: 'current', display: 'Current' },
  { key: 'behind', display: 'Behind' },
  { key: 'paid_off', display: 'Paid Off' },
  { key: 'paused', display: 'Paused' },
  { key: 'closed', display: 'Closed' },
]

const { addDebt, updateDebt, debt, loading } = useDebt(props.id, { disableFetch: !editing })

useForm(debt, formData)

const render = computed(() => {
  if (!editing) return true
  if (editing && formData.value.balance) return true
  return false
})

const steps = {
  BASIC_INFO: 0,
  PAYMENT_DETAILS: 1,
  ADDITIONAL_SETTINGS: 2,
}

const { currentStep, nextStep, previousStep } = useSteps(steps)

const router = useRouter()

async function submit() {
  if (loading.value) return

  if (currentStep.value === steps.ADDITIONAL_SETTINGS) {
    formData.value.start_date = new Date().toISOString()

    if (editing && props.id) {
      await updateDebt(formData.value)
    } else {
      await addDebt(formData.value as DebtCreatePayload)
    }
    router.back()
    return
  }

  nextStep()
}

function cancel() {
  if (loading.value) return

  if (currentStep.value === steps.BASIC_INFO) {
    router.back()
    return
  }

  previousStep()
}
</script>

<style>
.light {
  --color-preview-card-background: var(--color-gray-50);
  --color-high-interest: var(--color-notice-red-text);
  --color-extra-payment: var(--color-notice-green-text);
}

.dark {
  --color-preview-card-background: var(--color-gray-800);
  --color-high-interest: var(--color-notice-red-text);
  --color-extra-payment: var(--color-notice-green-text);
}
</style>

<style scoped>
.form-card {
  transition: all 0.3s ease;
}

.form-section {
  animation: fadeIn 0.3s ease;
  padding: var(--spacing-xl);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-primary);
  font-size: var(--text-h3);
}

.section-icon {
  color: var(--color-accent);
}

.form-actions {
  padding: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

:deep(.preview-card.card.border) {
  position: sticky;
  top: var(--spacing-xl);
  transition: all 0.3s ease;
  background-color: var(--color-preview-card-background);
}

.preview-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
  font-size: var(--text-h3);
}

.preview-icon {
  color: var(--color-accent);
}

.preview-divider {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: var(--spacing-md) 0;
}

.preview-item {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.preview-item:hover {
  background-color: var(--color-background-hover);
}

.preview-item strong {
  color: var(--color-text-secondary);
}

.high-interest {
  color: var(--color-high-interest);
  font-weight: 600;
}

.extra-payment {
  color: var(--color-extra-payment);
  font-weight: 600;
}

.priority-order {
  font-weight: 600;
  color: var(--color-accent);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--text-small);
  font-weight: 500;
}

.status-badge.status-current {
  background-color: var(--color-success);
  color: var(--color-white);
}

.status-badge.status-behind {
  background-color: var(--color-error);
  color: var(--color-white);
}

.status-badge.status-paid_off {
  background-color: var(--color-success);
  color: var(--color-white);
}

.status-badge.status-paused {
  background-color: var(--color-notice-yellow);
  color: var(--color-black);
}

.status-badge.status-closed {
  background-color: var(--color-error);
  color: var(--color-white);
}
</style>
