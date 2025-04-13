export default defineNuxtRouteMiddleware((to, from) => {
  const loginError = useState('loginError', () => '')

  if (to.name !== from.name) {
    loginError.value = ''
  }
})
