export default function useAuth({ isPublic = false }: { isPublic?: boolean } = {}) {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const url = useRequestURL()
  const redirectInfo = useSupabaseCookieRedirect()
  const router = useRouter()
  const route = useRoute()

  const loginError = useState('loginError', () => '')
  const signOutError = ref('')
  const signingIn = ref(false)
  const verifyingCode = ref(false)

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

    loginError.value = ''

    if (existingUser) {
      router.push({ path: '/one-time-code', query: { email, captchaToken } })
    } else {
      router.push({ path: '/create-account', query: { email } })
    }
  }

  async function verifyOneTimeCode(email: string, token: string) {
    if (!email || !token) {
      loginError.value = 'Email and token are required'
      return
    }

    verifyingCode.value = true

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })

    if (error) {
      loginError.value = error.message
      verifyingCode.value = false
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

  watch(
    () => route.name,
    () => {
      loginError.value = ''
    }
  )

  return {
    loginError,
    signingIn,
    signInWithOauth,
    signInWithOtp,
    signOut,
    user,
    verifyingCode,
    verifyOneTimeCode,
  }
}
