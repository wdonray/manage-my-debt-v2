<template>
  <div class="login-container">
    <Card border class="login-card" disable-fetching>
      <Flex stack v-auto-animate>
        <template v-if="!oneTimeCodeRequired">
          <Button class="btn-outline btn-block" @click="() => signInWithOauth('google')" :disabled="signingIn">
            <Flex gap="sm" align="center">
              <Icon name="mdi:google" size="20px" />
              Google
            </Flex>
          </Button>

          <Button class="btn-outline btn-block" @click="() => signInWithOauth('facebook')" :disabled="signingIn">
            <Flex gap="sm" align="center">
              <Icon name="mdi:facebook" size="20px" />
              Facebook
            </Flex>
          </Button>

          <hr />
        </template>

        <Notice v-if="loginError" type="error" role="alert" aria-live="polite">
          {{ formatCapitalize(loginError) || 'An error occurred' }}
        </Notice>

        <FormWithValidation
          v-if="!oneTimeCodeRequired"
          @submit="() => signInWithOtp(formData.email, formData.captchaToken)"
          @input="loginError = ''"
          aria-label="Login form"
        >
          <FieldText
            v-model="formData.email"
            label="Email"
            id="email"
            name="email"
            validations="required|email"
            autocomplete="email"
            aria-required="true"
          />

          <Flex stack gap="xl">
            <NuxtTurnstile
              v-model="formData.captchaToken"
              :options="{ theme: colorMode.preference, action: 'vue' }"
              aria-label="CAPTCHA verification"
              style="align-self: center"
            />

            <Button class="btn-primary btn-block" type="submit" aria-busy="signingIn" :disabled="signingIn">
              Login
            </Button>
          </Flex>
        </FormWithValidation>

        <FormWithValidation
          v-else
          @submit="() => verifyOneTimeCode(formData.email, formData.token)"
          @input="loginError = ''"
          aria-label="Verify one-time code form"
        >
          <Flex stack gap="sm" style="margin-bottom: var(--spacing-lg)">
            <span>
              We've sent a login link and one-time code to
              <strong>{{ formData.email }}</strong>
            </span>
            <small class="text-secondary">
              You can either click the magic link in your email or enter the one-time code below. If you don't see the
              email, check your spam folder.
            </small>
          </Flex>

          <FieldText
            v-model="formData.token"
            label="One-time code"
            id="token"
            name="token"
            validations="required"
            placeholder="Enter the 6-digit code"
            autocomplete="one-time-code"
          />

          <Flex stack gap="xl">
            <div>
              <Button
                class="btn-text"
                style="font-size: var(--text-xsmall)"
                @click="resendCode"
                :disabled="resendCodeTimer > 0"
              >
                Didn't receive the code? Click to resend
                <span v-if="resendCodeTimer > 0">({{ resendCodeTimer }}s)</span>
              </Button>
            </div>

            <Flex gap="md" style="justify-content: end">
              <Button class="btn-outline" type="button" @click="oneTimeCodeRequired = false" :disabled="signingIn">
                Back
              </Button>
              <Button class="btn-primary" type="submit" aria-busy="signingIn" :disabled="signingIn">Verify Code</Button>
            </Flex>
          </Flex>
        </FormWithValidation>
      </Flex>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const colorMode = useColorMode()

const formData = ref({
  email: '',
  captchaToken: '',
  token: '', // one-time code
})

const resendCodeTimer = ref(60)

const { user, loginError, signingIn, signInWithOtp, signInWithOauth, oneTimeCodeRequired, verifyOneTimeCode } = useAuth(
  { isPublic: true }
)

function countdownResendCode() {
  resendCodeTimer.value--
  if (resendCodeTimer.value <= 0) {
    clearInterval(timer)
  }
}

async function resendCode() {
  resendCodeTimer.value = 60
  await signInWithOtp(formData.value.email, formData.value.captchaToken)

  const timer = setInterval(countdownResendCode, 1000)
}

watch(oneTimeCodeRequired, (value) => {
  if (value) {
    const timer = setInterval(countdownResendCode, 1000)
  }
})
</script>

<style scoped>
.login-container {
  margin: auto;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 450px;
  padding: var(--spacing-xl);
  position: relative;
}
</style>
