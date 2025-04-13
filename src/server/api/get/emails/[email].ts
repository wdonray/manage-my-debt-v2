import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, 'email')

  if (!email) {
    throw createError({ statusCode: 400, message: 'Email is required' })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('emails').select('*').eq('email', email).maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
