<template>
  <div class="carousel-outer">
    <div class="carousel-container">
      <div class="carousel-overlay" />

      <motion.div :initial="false" :animate="carouselAnimation" class="carousel-track">
        <div v-for="item in items" :key="item" class="carousel-item">
          <img :src="item" :alt="item" loading="eager" >
        </div>
      </motion.div>

      <div class="carousel-bullets">
        <motion.div
          v-for="(item, index) in items"
          :key="item"
          class="carousel-bullet"
          :class="{ active: currentIndex === index }"
          :animate="animateBullets(index)"
          @click="currentIndex = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{ items: string[] }>()

const currentIndex = ref(0)
const interval = ref<NodeJS.Timeout | null>(null)

const carouselAnimation = computed(() => ({
  x: `-${currentIndex.value * 100}%`,
  transition: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
    mass: 1,
    velocity: 0,
  },
}))

function animateBullets(index: number) {
  return {
    scale: currentIndex.value === index ? 1.1 : 1,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  }
}

function next() {
  if (currentIndex.value === props.items.length - 1) return (currentIndex.value = 0)
  currentIndex.value++
}

onMounted(() => {
  interval.value = setInterval(next, 6000)
})

onUnmounted(() => {
  if (!interval.value) return
  clearInterval(interval.value)
  interval.value = null
})
</script>

<style>
.light {
  --carousel-overlay-opacity: 0.1;
}

.dark {
  --carousel-overlay-opacity: 0.3;
}
</style>

<style scoped>
.carousel-outer {
  padding: var(--spacing-lg);
  padding-right: 0;
  height: 100%;
}

.carousel-container {
  overflow: hidden;
  height: 100%;
  border-radius: var(--radius-md);
  position: relative;
}

.carousel-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-accent);
  opacity: var(--carousel-overlay-opacity);
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
}

.carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  position: relative;
  z-index: 0;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  will-change: transform;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  backface-visibility: hidden;
  transform: translateZ(0);
}

.carousel-bullets {
  position: absolute;
  bottom: var(--spacing-xl);
  z-index: 1;
  display: flex;
  gap: var(--spacing-sm);
  left: 50%;
  transform: translateX(-50%);
}

.carousel-bullet {
  width: 45px;
  height: 5px;
  border-radius: var(--radius-sm);
  background-color: var(--color-card-bg);
  cursor: pointer;
}

.carousel-bullet.active {
  background-color: var(--color-accent);
}
</style>
