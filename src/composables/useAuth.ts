export default function useAuth({ isPublic = false }: { isPublic?: boolean } = {}) {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const url = useRequestURL()
  const redirectInfo = useSupabaseCookieRedirect()
  const router = useRouter()

  const loginError = ref('')
  const signOutError = ref('')
  const signingIn = ref(false)

  async function signInWithOtp(email: string, captchaToken: string) {
    if (!email || !captchaToken) {
      loginError.value = 'Email and captcha token are required'
      return
    }

    if (signingIn.value) {
      return
    }

    signingIn.value = true

    const existingUser = await $fetch(`/api/get/emails/${email}`)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${url.origin}/confirm`,
        captchaToken,
      },
    })

    if (error) {
      loginError.value = error.message
      signingIn.value = false
      return
    }

    if (existingUser) {
      router.push({ path: '/one-time-code', query: { email, captchaToken } })
    } else {
      router.push({ path: '/create-account', query: { email } })
    }

    loginError.value = ''
    signingIn.value = false
  }

  async function verifyOneTimeCode(email: string, token: string) {
    if (!email || !token) {
      loginError.value = 'Email and token are required'
      return
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      loginError.value = error.message
      return
    }

    loginError.value = ''
    router.push('/')
  }

  async function signInWithOauth(provider: 'google' | 'facebook') {
    if (signingIn.value) {
      return
    }

    signingIn.value = true

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${url.origin}/confirm`,
      },
    })

    if (error) {
      loginError.value = error.message
      signingIn.value = false
      return
    }

    loginError.value = ''
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      signOutError.value = error.message
      return
    }

    signOutError.value = ''
    router.push('/login')
  }

  if (isPublic) {
    watch(
      user,
      async () => {
        if (user.value) {
          const path = redirectInfo.pluck()
          router.push(path || '/')
        }
      },
      { immediate: true }
    )
  }

  return {
    loginError,
    signingIn,
    signInWithOauth,
    signInWithOtp,
    signOut,
    user,
    verifyOneTimeCode,
  }
}
