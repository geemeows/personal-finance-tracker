import { h } from 'vue'

import { Pizza, Bus, HandCoins, ReceiptText } from 'lucide-vue-next'
import type { Transaction } from './indexedDB'

export const labels = [
  {
    label: 'Bills',
    value: 'Bills',
    icon: h(ReceiptText),
  },
  {
    label: 'Transportation',
    value: 'Transportation',
    icon: h(Bus),
  },
  {
    label: 'General',
    value: 'General',
    icon: h(HandCoins),
  },
  {
    label: 'Food',
    value: 'Food',
    icon: h(Pizza),
  },
]

export const type = [
  {
    label: '🤑 Income',
    value: 'money_in',
  },
  {
    label: '💸 Expense',
    value: 'money_out',
  },
]

export const sortTransactions = (transactions: Transaction[]): Transaction[] => {
  return [...transactions].sort((a, b) => {
    // First compare by date
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime()

    // If dates are equal, compare by createdAt
    if (dateComparison === 0) {
      // Handle cases where createdAt might be undefined
      const aCreated = a.createdAt?.getTime() ?? 0
      const bCreated = b.createdAt?.getTime() ?? 0
      return bCreated - aCreated
    }

    return dateComparison
  })
}
