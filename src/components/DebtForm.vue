<template>
  <Grid columns="1.618fr 1fr" gap="xl" style="position: relative">
    <FormWithValidation @submit="submit">
      <Card border class="form-card">
        <Flex stack v-auto-animate>
          <section v-if="currentStep === steps.BASIC_INFO" class="form-section" v-auto-animate>
            <h3 class="section-title">
              <Icon name="ph:info" size="24" class="section-icon" />
              Debt Information
            </h3>
            <FieldText
              v-model="formData.name"
              label="Name"
              name="name"
              optional
              placeholder="e.g., Chase Freedom Card"
              description="A memorable name to identify this debt in your avalanche strategy"
              :fetching="loading"
            />
            <FieldCurrency
              v-model="formData.balance"
              label="Current Balance *"
              name="balance"
              validations="required|min_value:1"
              description="The outstanding balance you currently owe. This amount will help calculate total interest savings"
              :fetching="loading"
            />
            <FieldPercentage
              v-model="formData.apr"
              label="APR (%) *"
              name="apr"
              validations="required|min_value:0"
              description="Annual Percentage Rate - Using the debt avalanche method, we'll prioritize paying off high-APR debts first to minimize interest"
              :fetching="loading"
            />
          </section>

          <section v-else-if="currentStep === steps.PAYMENT_DETAILS" class="form-section">
            <h3 class="section-title">
              <Icon name="ph:currency-circle-dollar" size="24" class="section-icon" />
              Payment Strategy
            </h3>
            <FieldCurrency
              v-model="formData.min_payment"
              label="Minimum Payment *"
              name="min_payment"
              validations="required|min_value:1"
              description="The minimum monthly payment required. You'll continue making minimum payments on all debts while focusing extra funds on high-APR debt"
            />
            <FieldCurrency
              v-model="formData.extra_payment"
              label="Extra Payment"
              name="extra_payment"
              optional
              validations="min_value:0"
              description="Additional amount above minimum. In the avalanche method, all extra money goes toward the highest-APR debt first"
            />
            <FieldText
              v-model="formData.start_date"
              label="Start Date"
              type="date"
              name="start_date"
              optional
              description="When you began tracking this debt. Used to measure your progress over time"
            />
            <FieldText
              v-model="formData.due_date"
              label="Payment Due Date"
              type="date"
              name="due_date"
              optional
              description="Monthly due date. Important to maintain minimum payments on all debts while following the avalanche strategy"
            />
          </section>

          <section v-else-if="currentStep === steps.ADDITIONAL_SETTINGS" class="form-section">
            <h3 class="section-title">
              <Icon name="ph:gear" size="24" class="section-icon" />
              Additional Settings
            </h3>
            <FieldSelect
              v-model="formData.status"
              label="Payment Status"
              :options="statusOptions"
              name="status"
              optional
              description="Track if payments are on schedule. Staying current on all minimum payments is crucial for the avalanche method"
            />
            <FieldText
              type="number"
              v-model="formData.priority_order"
              label="Custom Priority"
              name="priority_order"
              optional
              validations="min_value:0"
              description="Optional: Override the automatic highest-APR-first ordering. Note: Following the avalanche method's APR ordering maximizes interest savings"
            />
          </section>

          <Flex style="justify-content: space-between; margin-top: var(--spacing-xl)">
            <Button class="btn-outline" type="button" @click="cancel">
              <Flex align="center" gap="sm">
                <Icon v-if="currentStep === steps.BASIC_INFO" name="ph:x" size="20" />
                <Icon v-else name="ph:arrow-left" size="20" />
                {{ currentStep === steps.BASIC_INFO ? 'Cancel' : 'Back' }}
              </Flex>
            </Button>

            <Button class="btn-primary" type="submit" :disabled="loading">
              <Flex align="center" gap="sm">
                {{ currentStep === steps.ADDITIONAL_SETTINGS ? 'Save' : 'Next' }}
                <Icon v-if="currentStep !== steps.ADDITIONAL_SETTINGS" name="ph:arrow-right" size="20" />
                <Icon v-else name="ph:check" size="20" />
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Card>
    </FormWithValidation>

    <Flex stack v-auto-animate>
      <div>
        <Card :shadow="false" class="preview-card">
          <h3 class="preview-title">
            <Icon name="ph:eye" size="24" class="preview-icon" />
            Liability Preview
          </h3>

          <hr class="preview-divider" />

          <Flex stack gap="xl" v-auto-animate>
            <!-- Name is optional -->
            <Flex v-if="formData.name" class="preview-item">
              <strong>Name</strong>
              <FlexSpace />
              <span>{{ formData.name }}</span>
            </Flex>

            <!-- Balance is required -->
            <Flex class="preview-item">
              <strong>Balance</strong>
              <FlexSpace />
              <span>{{ formData.balance ? formatCurrency(formData.balance) : 'Not Set' }}</span>
            </Flex>

            <!-- APR is required -->
            <Flex class="preview-item">
              <strong>APR</strong>
              <FlexSpace />
              <span>{{ formatPercentage(formData.apr) }}</span>
            </Flex>

            <!-- Minimum Payment is required -->
            <Flex class="preview-item">
              <strong>Minimum Payment</strong>
              <FlexSpace />
              <span>{{ formData.min_payment ? formatCurrency(formData.min_payment) : 'Not Set' }}</span>
            </Flex>

            <!-- Extra Payment is optional -->
            <Flex v-if="formData.extra_payment" class="preview-item">
              <strong>Extra Payment</strong>
              <FlexSpace />
              <span>{{ formatCurrency(formData.extra_payment) }}</span>
            </Flex>

            <!-- Start Date is optional -->
            <Flex v-if="formData.start_date" class="preview-item">
              <strong>Start Date</strong>
              <FlexSpace />
              <span>{{ formatDate(formData.start_date) }}</span>
            </Flex>

            <!-- Due Date is optional -->
            <Flex v-if="formData.due_date" class="preview-item">
              <strong>Due Date</strong>
              <FlexSpace />
              <span>{{ formatDate(formData.due_date) }}</span>
            </Flex>

            <!-- Status is optional -->
            <Flex v-if="formData.status" class="preview-item">
              <strong>Status</strong>
              <FlexSpace />
              <span class="status-badge" :class="{ ['status-' + formData.status]: true }">
                {{ statusOptions.find((option) => option.key === formData.status)?.display }}
              </span>
            </Flex>

            <!-- Priority Order is optional -->
            <Flex v-if="formData.priority_order" class="preview-item">
              <strong>Priority Order</strong>
              <FlexSpace />
              <span>{{ formData.priority_order }}</span>
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
  id?: number
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

const router = useRouter()

const steps = {
  BASIC_INFO: 0,
  PAYMENT_DETAILS: 1,
  ADDITIONAL_SETTINGS: 2,
}

const { currentStep, nextStep, previousStep } = useSteps(steps)

async function submit() {
  if (loading.value) return

  if (currentStep.value === steps.ADDITIONAL_SETTINGS) {
    formData.value.start_date = new Date().toISOString()

    if (editing && props.id) {
      await updateDebt(formData.value)
    } else {
      await addDebt(formData.value as DebtCreatePayload)
    }
    router.push('/debts')
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

<style scoped>
.form-card {
  transition: all 0.3s ease;
}

.form-section {
  animation: fadeIn 0.3s ease;
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text-primary);
}

.section-icon {
  color: var(--color-accent);
}

.preview-card {
  position: sticky;
  top: var(--spacing-xl);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  color: var(--color-text-primary);
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
  transition: background-color 0.2s ease;
}

.preview-item:hover {
  background-color: var(--color-background-hover);
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

/* Dark mode enhancements */
:root[class='dark'] .preview-card {
  background: var(--color-background);
  border-color: var(--color-border);
}

:root[class='dark'] .preview-item:hover {
  background-color: var(--color-background-hover);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
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
