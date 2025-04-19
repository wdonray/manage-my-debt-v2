import type { Debt } from '~/types/database'

/**
 * Calculate yearly interest for a debt
 *
 * @param balance The current balance
 * @param apr The annual percentage rate (in 10000ths)
 * @returns The yearly interest amount
 */
export function calculateYearlyInterest(balance: number, apr: number): number {
  return balance * (apr / 1000000) // Divide by 1M because apr is in 10000ths
}

/**
 * Calculate monthly interest for a debt
 *
 * @param balance The current balance
 * @param apr The annual percentage rate (in 10000ths)
 * @returns The monthly interest amount
 */
export function calculateMonthlyInterest(balance: number, apr: number): number {
  return calculateYearlyInterest(balance, apr) / 12
}

/**
 * Calculate estimated payoff months for a debt
 *
 * @param debt The debt object containing balance, apr, min_payment, and extra_payment
 * @returns The number of months until payoff, or Infinity if debt cannot be paid off
 */
export function calculatePayoffMonths(debt: Debt): number {
  const monthlyPayment = debt.min_payment + (debt.extra_payment || 0)

  // If no monthly payment or payment too small, return infinity
  if (!monthlyPayment || monthlyPayment <= 0) return Infinity

  // If APR is 0, simple division
  if (debt.apr === 0) {
    return Math.ceil(debt.balance / monthlyPayment)
  }

  // Convert APR from 10000ths to decimal (e.g., 190000 -> 0.19)
  const monthlyInterestRate = debt.apr / 1000000 / 12
  const balance = debt.balance

  // If monthly payment is less than monthly interest, debt will never be paid off
  const monthlyInterest = balance * monthlyInterestRate
  if (monthlyPayment <= monthlyInterest) return Infinity

  try {
    // Using amortization formula: n = -log(1 - (P*r)/PMT) / log(1 + r)
    // Where: P = principal, r = monthly interest rate, PMT = monthly payment
    const n = -Math.log(1 - (balance * monthlyInterestRate) / monthlyPayment) / Math.log(1 + monthlyInterestRate)
    return isFinite(n) ? Math.ceil(n) : Infinity
  } catch {
    return Infinity
  }
}

/**
 * Calculate estimated payoff date for a debt
 *
 * @param debt The debt object
 * @returns The estimated payoff date as a string, or 'Never' if debt cannot be paid off
 */
export function calculatePayoffDate(debt: Debt): string {
  const payoffMonths = calculatePayoffMonths(debt)
  if (payoffMonths === Infinity) return 'Never'

  const date = new Date()
  date.setMonth(date.getMonth() + payoffMonths)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/**
 * Check if a debt has a high APR
 *
 * @param apr The annual percentage rate (in 10000ths)
 * @returns Boolean indicating if the APR is considered high
 */
export function isHighAPR(apr: number): boolean {
  return apr >= HIGH_APR_THRESHOLD
}

/**
 * Check if a debt has a large balance
 *
 * @param balance The current balance
 * @returns Boolean indicating if the balance is considered large
 */
export function isLargeBalance(balance: number): boolean {
  return balance >= LARGE_BALANCE_THRESHOLD
}

/**
 * Check if a debt has a high interest rate
 *
 * @param apr The annual percentage rate (in 10000ths)
 * @returns Boolean indicating if the interest rate is considered high
 */
export function isHighInterest(apr: number): boolean {
  return apr >= HIGH_INTEREST_THRESHOLD
}

/**
 * Check if minimum payment is too low
 *
 * @param balance The current balance
 * @param minPayment The minimum payment amount
 * @returns Boolean indicating if the minimum payment is below the recommended threshold
 */
export function isMinPaymentTooLow(balance: number, minPayment: number): boolean {
  return balance > 0 && minPayment > 0 && minPayment < balance * MIN_PAYMENT_THRESHOLD
}

/**
 * Calculate recommended minimum payment based on balance
 *
 * @param balance The current balance
 * @returns The recommended minimum payment amount
 */
export function calculateRecommendedMinPayment(balance: number): number {
  return balance * MIN_PAYMENT_THRESHOLD
}

/**
 * Sort debts by APR in descending order (highest APR first)
 *
 * @param debts Array of debt objects
 * @returns Sorted array of debts
 */
export function sortDebtsByAPR(debts: Debt[]): Debt[] {
  return [...debts].sort((a, b) => b.apr - a.apr)
}

/**
 * Get the priority debt (highest APR) from a list of debts
 *
 * @param debts Array of debt objects
 * @returns The debt with the highest APR, or undefined if no debts
 */
export function getPriorityDebt(debts: Debt[]): Debt | undefined {
  return sortDebtsByAPR(debts)[0]
}

/**
 * Calculate total debt across all debts
 *
 * @param debts Array of debt objects
 * @returns The total debt amount
 */
export function calculateTotalDebt(debts: Debt[]): number {
  return debts.reduce((acc, debt) => acc + debt.balance, 0)
}

/**
 * Calculate total monthly payments across all debts
 *
 * @param debts Array of debt objects
 * @returns The total monthly payment amount
 */
export function calculateTotalMonthlyPayments(debts: Debt[]): number {
  return debts.reduce((acc, debt) => acc + debt.min_payment, 0)
}

/**
 * Calculate total APR across all debts
 *
 * @param debts Array of debt objects
 * @returns The total APR amount
 */
export function calculateTotalAPR(debts: Debt[]): number {
  return debts.reduce((acc, debt) => acc + debt.apr, 0)
}

/**
 * Calculate average APR across all debts If there are no debts, returns 0
 *
 * @param debts Array of debt objects
 * @returns The average APR amount
 */
export function calculateAverageAPR(debts: Debt[]): number {
  if (debts.length === 0) return 0
  return debts.reduce((acc, debt) => acc + debt.apr, 0) / debts.length
}
