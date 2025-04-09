import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Get the debt ID from the URL parameter
  const debtId = event.context.params?.id

  if (!debtId) {
    throw createError({
      statusCode: 400,
      message: 'Debt ID is required',
    })
  }

  const client = await serverSupabaseClient(event)

  // First check if the debt exists
  const { data: existingDebt, error: fetchError } = await client.from('debts').select('id').eq('id', debtId).single()

  if (fetchError) {
    throw createError({
      statusCode: 500,
      message: fetchError.message,
    })
  }

  if (!existingDebt) {
    throw createError({
      statusCode: 404,
      message: 'Debt not found',
    })
  }

  // Delete the debt
  const { error } = await client.from('debts').delete().eq('id', debtId)

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }

  return { success: true, message: 'Debt deleted successfully' }
})
