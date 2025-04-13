import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = getRouterParam(event, 'userId')

  if (!user || user.id !== userId) {
    throw createError({ statusCode: 403, message: 'User does not have access to this resource' })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('profiles').select('*').eq('id', userId).maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  if (!data) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return data
})
