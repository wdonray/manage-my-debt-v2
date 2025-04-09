import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const userId = event.context.params?.userId

  if (!userId) {
    throw createError({ statusCode: 400, message: 'userId is required' })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('debts').select('*').eq('user_id', userId)

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
