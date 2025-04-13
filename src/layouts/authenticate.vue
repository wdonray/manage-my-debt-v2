<template>
  <div class="auth-layout" :class="{ mobile, desktop }" v-if="mounted">
    <template v-if="!desktop">
      <motion.div
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1, transition: { duration: 0.5 } }"
        class="mobile-header"
      />
    </template>

    <template v-else>
      <div class="carousel-wrapper">
        <Carousel :items="carouselItems" />
        <motion.img
          src="/webp/logo-light.webp"
          alt="logo"
          class="logo"
          :initial="{ opacity: 0, scale: 0.5 }"
          :animate="{
            opacity: 0.4,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 100,
              damping: 10,
            },
          }"
        />
      </div>
    </template>

    <main :class="{ mobile }">
      <Button
        class="btn-text appearance-toggle"
        style="color: var(--appearance-toggle-color)"
        @click="toggleColorMode"
        :aria-label="colorMode.preference === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
      >
        <Icon :name="appearanceIconName" size="var(--text-h2)" aria-hidden="true" />
      </Button>

      <Flex stack align="center" gap="2xl">
        <slot />

        <footer>
          <Flex stack gap="sm" align="center">
            <small class="text-secondary">© 2024 Manage My Debt</small>
            <small class="text-secondary">
              <a
                class="highlight"
                href="https://www.linkedin.com/in/donrayxwilliams/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built by Donray Williams
              </a>
            </small>
          </Flex>
        </footer>
      </Flex>
    </main>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const mounted = ref(false)
const colorMode = useColorMode()
const { mobile, desktop } = useBreakpoint()

const carouselItems = ['/webp/ava1.webp', '/webp/ava2.webp', '/webp/ava3.webp']

const appearanceIconName = computed(() => (colorMode.preference === 'light' ? 'ph:moon-fill' : 'ph:sun-dim-fill'))

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  mounted.value = true
})
</script>

<style>
:root {
  --z-index-low: 1;
  --z-index-medium: 100;
  --z-index-high: 200;
}

.light {
  --appearance-toggle-color: var(--color-gray-600);
  --mobile-header-bg-image:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-page-background) 0%, transparent) 0%,
      color-mix(in srgb, var(--color-page-background) 100%, transparent) 30%,
      var(--color-page-background)
    ),
    url('/webp/ava3.webp');
}

.dark {
  --appearance-toggle-color: var(--color-gray-50);
  --mobile-header-bg-image:
    linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-page-background) 80%, transparent) 0%,
      var(--color-page-background) 100%
    ),
    url('/webp/ava1.webp');
}
</style>

<style scoped>
.auth-layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
}

.auth-layout.desktop {
  grid-template-columns: 1fr 1fr;
}

.carousel-wrapper {
  position: relative;
}

.logo {
  position: absolute;
  top: var(--spacing-2xl);
  left: var(--spacing-2xl);
  width: 100px;
  height: 100px;
  z-index: var(--z-index-high);
}

main {
  height: 100%;
  width: 600px;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--spacing-4xl);
  z-index: var(--z-index-high);
}

main.mobile {
  min-height: 100vh;
  width: 100%;
  padding-inline: var(--spacing-lg);
  justify-content: center;
}

.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: var(--mobile-header-bg-image);
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s;
  z-index: var(--z-index-low);
}

.appearance-toggle {
  position: fixed;
  top: calc(var(--spacing-md) + env(safe-area-inset-top));
  right: calc(var(--spacing-md) + env(safe-area-inset-right));
  z-index: var(--z-index-medium);
}

footer {
  z-index: var(--z-index-high);
  padding-bottom: calc(var(--spacing-2xl) + env(safe-area-inset-bottom));
}
</style>
