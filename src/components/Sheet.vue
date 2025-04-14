<template>
  <div>
    <div v-if="open" class="overlay" :class="{ open }" aria-hidden="true" @click.stop="close" />
    <div ref="sheet" class="sheet" :class="{ open: open }" :aria-hidden="!open" @click.stop="onTapNav">
      <div class="nub-container"><div class="nub"></div></div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { watch, onUnmounted, useTemplateRef } from 'vue'
import { ref, computed } from 'vue'
import { usePointerSwipe } from '@vueuse/core'

const open = defineModel({ required: true })

let scrollPosition = 0
const positionY = ref('0')
const sheet = useTemplateRef('sheet')

const sheetHeight = computed(() => sheet.value?.offsetHeight)

const { distanceY } = usePointerSwipe(sheet, {
  onSwipe() {
    if (distanceY.value > 0) return
    positionY.value = Math.abs(distanceY.value) + 'px'
  },
  onSwipeEnd(_e, direction) {
    if (direction !== 'down') return
    if (Math.abs(distanceY.value) / sheetHeight.value >= 0.3) {
      close()
    } else {
      positionY.value = '0'
    }
  },
})

function lockBodyScroll() {
  scrollPosition = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollPosition}px`
  document.body.style.width = '100%'
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overscrollBehavior = 'none'
}

function unlockBodyScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  document.body.style.overflow = ''
  document.documentElement.style.overscrollBehavior = ''
  window.scrollTo(0, scrollPosition)
}

function onTapNav(e) {
  if (e.target.tagName === 'A') {
    close()
  }
}

function close() {
  positionY.value = '0'
  open.value = false
}

watch(open, () => {
  if (open.value) lockBodyScroll()
  else unlockBodyScroll()
})

onUnmounted(unlockBodyScroll)
</script>

<style scoped>
.overlay {
  background: var(--color-black);
  inset: 0;
  position: fixed;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.overlay.open {
  opacity: 0.5;
  z-index: 1;
}

.sheet {
  position: fixed;
  min-height: 50vh;
  height: 70vh;
  transition-property: background-color, transform;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background-color: var(--color-background);
  border-top: 1px solid var(--color-border);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  right: 0;
  transform: translateY(calc(100% + 76px));
  z-index: 1;
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-2xl) + env(safe-area-inset-bottom));
  overflow-y: scroll;
  touch-action: auto;
  -webkit-overflow-scrolling: touch;
}

.nub-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: var(--spacing-md);
}

.nub {
  height: 4px;
  width: 45px;
  border-radius: var(--radius-md);
  background-color: var(--color-border);
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  margin: 0 auto;
}

.sheet.open {
  transform: translateY(v-bind('positionY'));
}
</style>
