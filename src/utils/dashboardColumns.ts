import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { Transaction } from '@/types/schemas'

import { Badge } from '@/components/ui/badge'
import DataTableColumnHeader from '@/components/common/Table/DataTableColumnHeader.vue'
import DataTableRowActions from '@/components/common/Table/DataTableRowActions.vue'

import { labels, type } from '@/utils/data'

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Title' }),

    cell: ({ row }) => {
      const label = labels.find(({ label }) => label === row.original.category)

      return h(
        'div',
        { class: 'flex space-x-2' },
        h('span', { class: 'max-w-[500px] truncate font-medium' }, row.getValue('title')),
      )
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Category' }),

    cell: ({ row }) => {
      const label = labels.find(({ label }) => label === row.original.category)

      return h(
        'div',
        { class: 'flex space-x-2' },
        label
          ? h(
              Badge,
              {
                variant: 'outline',
              },
              () =>
                h('div', { class: 'flex items-center gap-1' }, [
                  h(label.icon, { class: 'w-3.5 h-3.5' }),
                  h('span', label.label),
                ]),
            )
          : 'N/A',
      )
    },

    filterFn: (row, _, value) => {
      return value.includes(row.getValue('category'))
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Transaction Amount' }),

    cell: ({ row }) => {
      const isExpense = Number(row.getValue('amount')) < 0
      const classes = isExpense ? 'text-red-500' : 'text-green-500'
      const transactionValue = `${isExpense ? '-' : '+'} ${row.original.currency}${Math.abs(Number(row.getValue('amount'))).toLocaleString('en-US')}`

      return h('div', { class: classes }, transactionValue)
    },
    filterFn: (row, id, value) => {
      const txType = Number(row.getValue('amount')) < 0 ? 'money_out' : 'money_in'
      return value.includes(txType)
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => h(DataTableColumnHeader, { column, title: 'Transaction Date' }),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'))
      return h('div', { class: 'flex items-center' }, [
        date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ])
    },
    filterFn: (row, id, value) => {
      if (value.length !== 2) return true

      const [startDateStr, endDateStr] = value
      const startDate = new Date(startDateStr)
      const endDate = new Date(endDateStr)
      const targetDate = new Date(row.getValue('date'))

      return targetDate >= startDate && targetDate <= endDate
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
]
