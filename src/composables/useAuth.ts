export default function useAuth({ isPublic = false }: { isPublic?: boolean } = {}) {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const url = useRequestURL()
  const redirectInfo = useSupabaseCookieRedirect()

  const loginError = ref('')
  const signOutError = ref('')
  const signingIn = ref(false)
  const oneTimeCodeRequired = ref(false)

  async function signInWithOtp(email: string, captchaToken: string) {
    signingIn.value = true

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${url.origin}/confirm`, captchaToken },
    })

    if (error) {
      loginError.value = error.message
      signingIn.value = false
      return
    }

    loginError.value = ''
    oneTimeCodeRequired.value = true
    signingIn.value = false
  }

  async function verifyOneTimeCode(email: string, token: string) {
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
      () => {
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
    oneTimeCodeRequired,
    signingIn,
    signInWithOauth,
    signInWithOtp,
    signOut,
    user,
    verifyOneTimeCode,
  }
}
