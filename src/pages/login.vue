<template>
  <Flex stack gap="2xl" class="login-container">
    <div class="logo-wrapper" v-if="!desktop">
      <motion.img
        :src="colorMode.preference === 'light' ? '/webp/logo-light.webp' : '/webp/logo-dark.webp'"
        alt="logo"
        class="logo"
        :initial="{ opacity: 0, scale: 0.5 }"
        :animate="{
          opacity: 1,
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 10,
          },
        }"
      />
    </div>

    <div>
      <h1>Get Started!</h1>
      <small class="text-secondary">Log in to manage your debts and achieve financial freedom</small>
    </div>

    <Flex stack gap="xl" v-auto-animate>
      <Notice v-if="loginError" type="error" role="alert" aria-live="polite">
        {{ formatCapitalize(loginError) || 'An error occurred' }}
      </Notice>

      <FormWithValidation
        @submit="() => signInWithOtp(formData.email, formData.captchaToken)"
        @input="loginError = ''"
        aria-label="Login form"
      >
        <FieldText
          v-model="formData.email"
          id="email"
          placeholder="Email"
          name="email"
          validations="required|email"
          autocomplete="email"
          aria-required="true"
        />

        <Flex stack gap="xl">
          <Transition name="fade" mode="out-in">
            <NuxtTurnstile
              v-if="formData.email"
              v-model="formData.captchaToken"
              aria-label="CAPTCHA verification"
              style="align-self: center"
            />
          </Transition>
          <Button class="btn-primary btn-block" type="submit" :disabled="signingIn">
            {{ signingIn ? 'Logging in...' : 'Login' }}
          </Button>
        </Flex>
      </FormWithValidation>

      <span class="text-secondary or-text">Or continue with</span>

      <div class="btn-group">
        <Button class="btn-outline btn-block" @click="() => signInWithOauth('google')">
          <Flex gap="sm" align="center">
            <img src="/svg/google.svg" alt="Google" :width="iconSize" :height="iconSize" />
            Google
          </Flex>
        </Button>

        <Button class="btn-outline btn-block" @click="() => signInWithOauth('facebook')">
          <Flex gap="sm" align="center">
            <img src="/svg/facebook.svg" alt="Facebook" :width="iconSize" :height="iconSize" />
            Facebook
          </Flex>
        </Button>
      </div>
    </Flex>
  </Flex>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

definePageMeta({
  layout: 'authenticate',
})

const colorMode = useColorMode()
const { desktop } = useBreakpoint()

const iconSize = 30

const formData = ref({ email: '', captchaToken: '' })

const { loginError, signInWithOtp, signInWithOauth, signingIn } = useAuth({ isPublic: true })
</script>

<style scoped>
.login-container {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.or-text {
  display: flex;
  align-items: center;
  text-align: center;
  color: var(--color-text-secondary);
}

.or-text::before,
.or-text::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid var(--color-text-secondary);
  margin: 0 var(--spacing-sm);
}

.btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.btn-group button {
  color: var(--color-text-primary);
}

.logo-wrapper {
  position: fixed;
  top: calc(var(--spacing-3xl) + env(safe-area-inset-top));
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.logo {
  width: 5rem;
  height: 5rem;
}
</style>
