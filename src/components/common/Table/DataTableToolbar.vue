<script setup lang="ts">
import { computed, ref, type Ref } from 'vue'
import type { Table } from '@tanstack/vue-table'
import type { Transaction } from '@/types/schemas'
import { Button } from '@/components/ui/button'
import DateFilter from '@/components/dashboard/DateFilter.vue'
import { CalendarIcon } from '@radix-icons/vue'

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'


import { Input } from '@/components/ui/input'
import {
  Cross2Icon
} from '@radix-icons/vue'

import { labels, type } from '@/utils/data'
import DataTableFacetedFilter from './DataTableFacetedFilter.vue'
import DataTableViewOptions from './DataTableViewOptions.vue'
import type { DateRange } from 'radix-vue'


interface DataTableToolbarProps {
  table: Table<Transaction>
}


const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

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
    <div class="flex flex-1 items-center space-x-2">
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
    <DataTableViewOptions :table="table" />
  </div>
</template>
