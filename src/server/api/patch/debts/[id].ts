import { serverSupabaseClient } from '#supabase/server'
import type { DebtUpdatePayload } from '~/types/database'
export default defineEventHandler(async (event) => {
  // Get the debt ID from the URL parameter
  const debtId = event.context.params?.id

  if (!debtId) {
    throw createError({
      statusCode: 400,
      message: 'Debt ID is required',
    })
  }

  // Get the request body
  const body = await readBody<DebtUpdatePayload>(event)

  // Validate that at least one field is being updated
  if (Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      message: 'At least one field must be provided for update',
    })
  }

  // Validate numeric fields if they are provided
  if (body.balance !== undefined && body.balance <= 0) {
    throw createError({
      statusCode: 400,
      message: 'balance must be a positive number',
    })
  }

  if (body.apr !== undefined && body.apr <= 0) {
    throw createError({
      statusCode: 400,
      message: 'apr must be a positive number',
    })
  }

  if (body.min_payment !== undefined && body.min_payment <= 0) {
    throw createError({
      statusCode: 400,
      message: 'min_payment must be a positive number',
    })
  }

  if (body.extra_payment !== undefined && body.extra_payment < 0) {
    throw createError({
      statusCode: 400,
      message: 'extra_payment must be a non-negative number',
    })
  }

  const client = await serverSupabaseClient(event)

  // Update the debt
  const { data, error } = await client.from('debts').update(body).eq('id', debtId).select()

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  if (!data || data.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Debt not found',
    })
  }

  return data[0]
})
