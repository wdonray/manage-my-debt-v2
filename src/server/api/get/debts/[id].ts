import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const debtId = getRouterParam(event, 'id')

  if (!user) {
    throw createError({ statusCode: 403, message: 'User does not have access to this resource' })
  }

  if (!debtId) {
    throw createError({ statusCode: 400, message: 'Debt ID is required' })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('debts').select('*').eq('id', debtId).single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
