import type { Debt } from '~/types/database'
export const DEBTS_KEY = Symbol() as InjectionKey<Ref<Debt[]>>
export const DEBTS_LOADING_KEY = Symbol() as InjectionKey<Ref<boolean>>
export const DEBTS_LOADED_KEY = Symbol() as InjectionKey<Ref<boolean>>
export const DEBTS_ERROR_KEY = Symbol() as InjectionKey<Ref<Error | null>>

export const MIN_PAYMENT_PERCENTAGE = 3 // 3%
export const LARGE_BALANCE_AMOUNT = 10000 // $10,000
export const HIGH_APR_PERCENTAGE = 20 // 20%
export const HIGH_INTEREST_PERCENTAGE = 10 // 10%

export const MIN_PAYMENT_THRESHOLD = MIN_PAYMENT_PERCENTAGE / 100
export const LARGE_BALANCE_THRESHOLD = LARGE_BALANCE_AMOUNT
export const HIGH_APR_THRESHOLD = HIGH_APR_PERCENTAGE * 10000 // Convert to internal APR format
export const HIGH_INTEREST_THRESHOLD = HIGH_INTEREST_PERCENTAGE * 10000 // Convert to internal APR format
