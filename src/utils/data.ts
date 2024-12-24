import { h } from 'vue'

import { Pizza, Bus, HandCoins, ReceiptText } from 'lucide-vue-next'

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
