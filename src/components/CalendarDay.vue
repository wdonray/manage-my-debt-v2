<template>
  <div
    class="calendar-day"
    :class="{ today: isToday(day), selected: isSelected(day), empty: day === 'empty' }"
    @click="$emit('date-clicked', day)"
  >
    <slot>
      <small class="day-number">{{ day !== 'empty' ? day : '' }}</small>
      <div v-if="day !== 'empty' && getDebtsForDay(day).length > 0" class="debt-items">
        <small
          v-for="debt in getDebtsForDay(day)"
          :key="debt.id"
          class="debt-item"
          :class="{ 'status-current': debt.status === 'current', 'status-behind': debt.status === 'behind' }"
        >
          {{ debt.name || 'Unnamed Debt' }}
        </small>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import type { Debt } from '~/types/database'

const props = defineProps({
  day: { type: [String, Number], required: true },
  currentDate: { type: Date, required: true },
  selectedDate: { type: Date, required: true },
})

defineEmits(['date-clicked'])

function isToday(day: string | number) {
  if (!day || day === 'empty') return false
  const today = new Date()
  return (
    day === today.getDate() &&
    props.currentDate.getMonth() === today.getMonth() &&
    props.currentDate.getFullYear() === today.getFullYear()
  )
}

function isSelected(day: string | number) {
  if (!day || day === 'empty') return false
  return (
    day === props.selectedDate.getDate() &&
    props.currentDate.getMonth() === props.selectedDate.getMonth() &&
    props.currentDate.getFullYear() === props.selectedDate.getFullYear()
  )
}

const debts = inject(DEBTS_KEY)

function getDebtsForDay(day: string | number) {
  if (!debts?.value) return []
  if (!debts.value?.length || day === 'empty') return []

  const currentMonthDate = new Date(props.currentDate.getFullYear(), props.currentDate.getMonth(), day)

  return debts.value.filter((debt: Debt) => {
    if (!debt.due_date) return false
    const dueDate = new Date(debt.due_date)
    return (
      dueDate.getDate() === currentMonthDate.getDate() &&
      dueDate.getMonth() === currentMonthDate.getMonth() &&
      dueDate.getFullYear() === currentMonthDate.getFullYear()
    )
  })
}
</script>

<style scoped>
.calendar-day {
  padding: var(--spacing-md);
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: black;
}

.day-number {
  position: absolute;
  top: var(--spacing-sm);
  left: var(--spacing-sm);
}

.calendar-day.today .day-number {
  font-weight: bold;
}

.debt-items {
  margin-top: calc(var(--spacing-lg) + var(--spacing-sm));
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow: auto;
}

.debt-item {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-xs);
  overflow: hidden;
  text-overflow: ellipsis;
}

.debt-item.status-current {
  background: var(--color-blue-50);
  color: var(--color-blue-700);
}

.debt-item.status-behind {
  background: var(--color-red-50);
  color: var(--color-red-700);
}
</style>
