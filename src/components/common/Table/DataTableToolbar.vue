<script setup lang="ts">
import { computed, inject, ref, type Ref } from 'vue'
import type { Table } from '@tanstack/vue-table'
import type { Transaction } from '@/utils/indexedDB'
import { Button } from '@/components/ui/button'
import DateFilter from '@/components/dashboard/DateFilter.vue'
import { CalendarIcon } from '@radix-icons/vue'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'


import {
  Download
} from 'lucide-vue-next'


import { Input } from '@/components/ui/input'
import {
  Cross2Icon
} from '@radix-icons/vue'

import { JSONToCSV, labels, type } from '@/utils/helpers'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'
import type { DateRange } from 'radix-vue'
import { transactionsKey } from '@/utils/db'


interface DataTableToolbarProps {
  table: Table<Transaction>
}


const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)
const allTransactions = inject(transactionsKey) as Ref<Transaction[]>

const today = new Date();

const initialDate = ref({
  start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
  end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1).add({ days: today.getDate() - 1 }),
}) as Ref<DateRange>

const onDateChange = (date: DateRange) => {
  props?.table.getColumn('date')?.setFilterValue(
    date.start && date.end
      ? [date.start, date.end]
      : []
  )
}

const onDownloadData = () => {
  const CSVData = JSONToCSV(allTransactions.value);
  // Create a CSV file and allow the user to download it
  const blob = new Blob([CSVData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expensify_transactions.csv';
  document.body.appendChild(a);
  a.click();
}

const resetFilters = () => {
  props?.table.resetColumnFilters()
  initialDate.value = {
    start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
    end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1).add({ days: today.getDate() - 1 }),
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center gap-2 flex-wrap">
      <Input placeholder="Filter transactions..."
        :model-value="(table.getColumn('title')?.getFilterValue() as string) ?? ''" class="h-8 w-[150px] lg:w-[250px]"
        @input="table.getColumn('title')?.setFilterValue($event.target.value)" />
      <DataTableFacetedFilter v-if="table.getColumn('category')" :column="table.getColumn('category')" title="Category"
        :options="labels" />

      <DataTableFacetedFilter v-if="table.getColumn('amount')" :column="table.getColumn('amount')"
        title="Transaction Type" :options="type" />

      <DateFilter @change="onDateChange" :initialDate="initialDate">
        <template v-slot:trigger="{ value }">
          <Button variant="outline" size="sm" class="h-8 border-dashed">
            <CalendarIcon class="mr-2 h-4 w-4" />
            <template v-if="value.start">
              <template v-if="value.end">
                {{ df.format(value.start.toDate(getLocalTimeZone())) }} - {{
                  df.format(value.end.toDate(getLocalTimeZone()))
                }}
              </template>

              <template v-else>
                {{ df.format(value.start.toDate(getLocalTimeZone())) }}
              </template>
            </template>
            <template v-else>
              Pick a date
            </template>
          </Button>
        </template>
      </DateFilter>

      <Button v-if="isFiltered" variant="ghost" class="h-8 px-2 lg:px-3" @click="resetFilters">
        Reset
        <Cross2Icon class="ml-2 h-4 w-4" />
      </Button>
    </div>
    <Button
      class="mr-1 rounded-full border border-dashed border-green-500 text-green-600 hover:text-green-600 flex flex-row items-center"
      variant="outline" @click="onDownloadData">
      <Download class="w-4 h-4" />
      <span>Download CSV</span>
    </Button>
    <DataTableViewOptions :table="table" />
  </div>
</template>
