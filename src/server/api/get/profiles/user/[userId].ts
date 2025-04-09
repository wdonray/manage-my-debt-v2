import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const userId = event.context.params?.userId

  if (!user || user.id !== userId) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: You can only update your own profile.',
    })
  }

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.from('profiles').select(`*`).eq('id', userId).single()

  if (error) {
    throw createError({ statusCode: 500, message: error.message })
  }

  return data
})
