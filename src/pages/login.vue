<template>
  <Flex stack gap="2xl" class="login-container">
    <div>
      <h1>Get Started!</h1>
      <small class="text-secondary">Log in to manage your debts and achieve financial freedom</small>
    </div>

    <Flex v-auto-animate stack gap="xl">
      <FormWithValidation
        aria-label="Login form"
        @submit="() => signInWithOtp(formData.email, formData.captchaToken)"
        @input="loginError = ''"
      >
        <FieldText
          id="email"
          v-model="formData.email"
          placeholder="Email"
          name="email"
          validations="required|email"
          autocomplete="email"
          aria-required="true"
          :readonly="signingIn"
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
        <Button class="btn-outline btn-block" :disabled="signingIn" @click="() => signInWithOauth('google')">
          <Flex gap="sm" align="center">
            <img src="/svg/google.svg" alt="Google" :width="iconSize" :height="iconSize" />
            Google
          </Flex>
        </Button>

        <Button class="btn-outline btn-block" :disabled="signingIn" @click="() => signInWithOauth('facebook')">
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
definePageMeta({
  layout: 'authenticate',
  middleware: 'auth',
})

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
</style>
