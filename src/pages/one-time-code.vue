<template>
  <Flex stack class="one-time-code-container">
    <FormWithValidation
      @submit="() => verifyOneTimeCode(email, formData.token)"
      @input="loginError = ''"
      aria-label="Verify one-time code form"
    >
      <Flex stack gap="sm" style="margin-bottom: var(--spacing-lg)">
        <span>
          We've sent a login link and one-time code to
          <strong>{{ email }}</strong>
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

        <Grid gap="md">
          <Button class="btn-outline" type="button" @click="$router.back()">Back</Button>
          <Button class="btn-primary" type="submit" aria-busy="signingIn">Verify Code</Button>
        </Grid>
      </Flex>
    </FormWithValidation>
  </Flex>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'authenticate',
})
const router = useRouter()

const { email, captchaToken } = useRoute().query as { email: string; captchaToken: string }

if (!email || !captchaToken) {
  router.push('/login')
}

const { loginError, verifyOneTimeCode, signInWithOtp } = useAuth({ isPublic: true })

const formData = ref({ token: '' })

const countdownTime = 30

const resendCodeTimer = ref(countdownTime)
const timer = ref<NodeJS.Timeout | null>(setInterval(countdownResendCode, 1000))

function countdownResendCode() {
  resendCodeTimer.value--
  if (resendCodeTimer.value <= 0 && timer.value) {
    clearInterval(timer.value)
  }
}

async function resendCode() {
  resendCodeTimer.value = countdownTime
  await signInWithOtp(email, captchaToken)
  timer.value = setInterval(countdownResendCode, 1000)
}
</script>

<style scoped>
.one-time-code-container {
  width: 100%;
}
</style>
