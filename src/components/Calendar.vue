<template>
  <Card class="calendar-card">
    <Flex stack>
      <Flex align="center" justify="space-between">
        <Button class="btn-icon" @click="prevMonth">
          <Icon name="ph:arrow-left" size="32" />
        </Button>

        <h1 class="margin-0">{{ currentMonthName }} {{ currentYear }}</h1>

        <Button class="btn-icon" @click="nextMonth">
          <Icon name="ph:arrow-right" size="32" />
        </Button>
      </Flex>

      <Transition name="fade" mode="out-in">
        <div :key="currentMonthName" class="calendar-container">
          <CalendarDay v-for="day in weekDays" :key="day" class="weekday">
            <h2 class="margin-0">{{ day }}</h2>
          </CalendarDay>

          <CalendarDay
            v-for="day in daysInMonth"
            :key="day"
            :current-date="today"
            :selected-date="selectedDate"
            :day
            @date-clicked="selectDate"
          />
        </div>
      </Transition>
    </Flex>
  </Card>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
})

const selectedDate = defineModel({ type: Date, required: true })

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const today = new Date()

const currentMonthName = computed(() => today.toLocaleString('default', { month: 'long' }))
const currentYear = computed(() => today.getFullYear())

const daysInMonth = computed(() => {
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  const days = []
  const startingDay = firstDay.getDay()

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDay; i++) {
    days.push('empty')
  }

  // Add days of the month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(i)
  }

  return days
})

function selectDate(day) {
  if (!day || day === 'empty') return
  const newDate = new Date(today.getFullYear(), today.getMonth(), day)
  selectedDate.value = newDate
}

function prevMonth() {
  today = new Date(today.getFullYear(), today.getMonth() - 1, 1)
}

function nextMonth() {
  today = new Date(today.getFullYear(), today.getMonth() + 1, 1)
}
</script>

<style>
.light {
  --color-calendar-background: var(--color-gray-50);
  --color-calendar-border: var(--color-gray-800);
}

.dark {
  --color-calendar-background: var(--color-gray-900);
  --color-calendar-border: var(--color-gray-700);
}
</style>

<style scoped>
.card.calendar-card {
  background-color: var(--color-calendar-background);
}

.calendar-container {
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: auto repeat(6, 1fr);
  grid-gap: 1px;
  background-color: red;
}

.weekday {
  padding: var(--spacing-md);
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 150ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
