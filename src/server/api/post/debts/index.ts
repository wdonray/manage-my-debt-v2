import { serverSupabaseClient } from '#supabase/server'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  // Get the request body
  const body = await readBody(event)

  // Validate required fields
  if (!body.user_id) {
    throw createError({
      statusCode: 400,
      message: 'user_id is required',
    })
  }

  if (!body.balance || body.balance <= 0) {
    throw createError({
      statusCode: 400,
      message: 'balance must be a positive number',
    })
  }

  if (!body.min_payment || body.min_payment <= 0) {
    throw createError({
      statusCode: 400,
      message: 'min_payment must be a positive number',
    })
  }

  const client = await serverSupabaseClient<Database>(event)

  // Insert the new debt
  const { data, error } = await client
    .from('debts')
    .insert({
      user_id: body.user_id,
      name: body.name || null,
      balance: body.balance,
      apr: body.apr,
      min_payment: body.min_payment,
      starting_balance: body.starting_balance || null,
      extra_payment: body.extra_payment || 0,
      due_date: body.due_date || null,
      priority_order: body.priority_order || null,
      status: body.status || null,
      start_date: body.start_date || null,
    })
    .select()

  if (error) {
    // Log the specific Supabase error for debugging
    console.error('Supabase insert error:', error)
    throw createError({
      statusCode: 500,
      // Provide a more informative error message if possible
      message: `Failed to insert debt: ${error.message}`,
    })
  }

  // Ensure data is not null before returning
  if (!data) {
    throw createError({
      statusCode: 500,
      message: 'Failed to retrieve inserted debt data.',
    })
  }

  return data[0]
})
