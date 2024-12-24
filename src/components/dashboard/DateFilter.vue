<script setup lang="ts">
import type { DateRange } from 'radix-vue'
import { Button } from '@/components/ui/button'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RangeCalendar } from '@/components/ui/range-calendar'
import { cn } from '@/lib/utils'
import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from '@internationalized/date'

import { CalendarIcon } from '@radix-icons/vue'

import { type Ref, ref, watch } from 'vue'

const emit = defineEmits(['change'])

const props = defineProps<{
  initialDate?: DateRange
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'medium',
})

const today = new Date();

const currDate = ref(props.initialDate ? props.initialDate : {
  start: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1),
  end: new CalendarDate(today.getFullYear(), today.getMonth() + 1, 1).add({ days: today.getDate() - 1 }),
}) as Ref<DateRange>

const isDateDisabled = (date: CalendarDate) => {
  return new Date(date.year, date.month - 1, date.day) > new Date();
};

const changeDate = (newDate: DateRange) => {
  emit('change', {
    start: newDate.start ? `${newDate.start.year}-${newDate.start.month}-${newDate.start.day}` : null,
    end: newDate.end ? `${newDate.end.year}-${newDate.end.month}-${newDate.end.day}` : null,
  })
}

watch(() => props.initialDate, (newDate) => {
  if (newDate) {
    currDate.value = newDate
  }
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <slot name="trigger" :value="currDate">
        <Button variant="outline" :class="cn(
          'w-[280px] justify-start text-left font-normal rounded-full',
          !currDate && 'text-muted-foreground',
        )">
          <CalendarIcon class="mr-2 h-4 w-4" />
          <template v-if="currDate.start">
            <template v-if="currDate.end">
              {{ df.format(currDate.start.toDate(getLocalTimeZone())) }} - {{
                df.format(currDate.end.toDate(getLocalTimeZone()))
              }}
            </template>

            <template v-else>
              {{ df.format(currDate.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            Pick a date
          </template>
        </Button>
      </slot>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendar v-model="currDate" initial-focus :number-of-months="2" :is-date-disabled="isDateDisabled"
        @update:modelValue="changeDate" />
    </PopoverContent>
  </Popover>
</template>
