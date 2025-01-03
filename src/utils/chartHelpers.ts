import type { Transaction } from './indexedDBQueries'

export interface BucketedTransaction {
  bucket: string
  income: number
  expense: number
}

export interface CategoriesBucketedTransaction {
  bucket: string // date
  food: number
  transportation: number
  general: number
  bills: number
}

export function mapTransactionsToBuckets(
  transactions: Transaction[],
  accumulator: (acc: number, transaction: Transaction) => number,
): BucketedTransaction[] {
  if (!transactions.length) return []

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Process initial transactions
  const buckets: Record<string, { income: number; expense: number }> = {}

  // Initialize all dates between first and last transaction
  const startDate = new Date(sortedTransactions[0].date)
  const endDate = new Date(sortedTransactions[sortedTransactions.length - 1].date)

  // Create all daily buckets with zero values
  const current = new Date(startDate)
  while (current <= endDate) {
    const dateKey = formatDate(current)
    buckets[dateKey] = { income: 0, expense: 0 }
    current.setDate(current.getDate() + 1)
  }

  // Fill in actual transaction data
  sortedTransactions.forEach((transaction) => {
    const dateKey = formatDate(new Date(transaction.date))
    if (transaction.amount > 0) {
      buckets[dateKey].income += accumulator(buckets[dateKey].income, transaction)
    } else {
      buckets[dateKey].expense += accumulator(buckets[dateKey].expense, transaction)
    }
  })

  // Convert to array and calculate running balance
  return Object.entries(buckets)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([bucket, { income, expense }]) => {
      return {
        bucket,
        income: parseFloat(income.toFixed(2)),
        expense: parseFloat(expense.toFixed(2)),
      }
    })
}

export function mapTransactionsToBucketsByCategories(
  transactions: Transaction[],
  accumulator: (acc: number, transaction: Transaction) => number,
): CategoriesBucketedTransaction[] {
  if (!transactions.length) return []

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )

  // Process initial transactions
  const buckets: Record<
    string,
    { food: number; transportation: number; general: number; bills: number }
  > = {}

  // Initialize all dates between first and last transaction
  const startDate = new Date(sortedTransactions[0].date)
  const endDate = new Date(sortedTransactions[sortedTransactions.length - 1].date)

  // Create all daily buckets with zero values
  const current = new Date(startDate)
  while (current <= endDate) {
    const dateKey = formatDate(current)
    buckets[dateKey] = { food: 0, transportation: 0, general: 0, bills: 0 }
    current.setDate(current.getDate() + 1)
  }

  // Fill in actual transaction data
  sortedTransactions.forEach((transaction) => {
    const dateKey = formatDate(new Date(transaction.date))

    switch (transaction.category?.toLowerCase()) {
      case 'food':
        buckets[dateKey].food += accumulator(buckets[dateKey].food, transaction)
        break
      case 'transportation':
        buckets[dateKey].transportation += accumulator(buckets[dateKey].transportation, transaction)
        break
      case 'general':
        buckets[dateKey].general += accumulator(buckets[dateKey].general, transaction)
        break
      case 'bills':
        buckets[dateKey].bills += accumulator(buckets[dateKey].bills, transaction)
        break
    }
  })

  // Convert to array and calculate running balance
  return Object.entries(buckets)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([bucket, totals]) => ({
      bucket,
      food: parseFloat(totals.food.toFixed(2)),
      transportation: parseFloat(totals.transportation.toFixed(2)),
      general: parseFloat(totals.general.toFixed(2)),
      bills: parseFloat(totals.bills.toFixed(2)),
    }))
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
