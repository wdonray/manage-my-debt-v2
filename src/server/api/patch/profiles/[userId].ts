import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'
import type { Database, ProfileUpdatePayload } from '~/types/database'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const client = await serverSupabaseClient<Database>(event)

  const userId = event.context.params?.userId

  if (!user || user.id !== userId) {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: You can only update your own profile.',
    })
  }

  const body = await readBody<ProfileUpdatePayload>(event)

  if (!body || Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No update data provided.',
    })
  }

  const updateData = { ...body, updated_at: new Date().toISOString() }

  const { data, error } = await client.from('profiles').update(updateData).eq('id', userId).select().single()

  if (error) {
    console.error('Supabase profile update error:', error)
    throw createError({
      statusCode: 500,
      message: `Failed to update profile: ${error.message}`,
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      message: 'Profile not found or update failed.',
    })
  }

  return data
})
