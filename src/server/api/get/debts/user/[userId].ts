import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = event.context.params?.userId

  if (!user || user.id !== userId) {
    throw createError({ statusCode: 403, message: 'User does not have access to this resource' })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('debts').select('*').eq('user_id', userId)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
