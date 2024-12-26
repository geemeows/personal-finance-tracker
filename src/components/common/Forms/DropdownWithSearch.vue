<script setup lang="ts">
import type { FieldProps } from '@/components/ui/auto-form/interface'
import { AutoFormLabel } from '@/components/ui/auto-form'
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'


import { CaretSortIcon, CheckIcon } from '@radix-icons/vue'
import { ref, watch } from 'vue'

const props = defineProps<FieldProps & { value: string; list: { label: string; value: string }[] }>()
const currentValue = ref(props.value)
const open = ref(false)
const emit = defineEmits<{
  'update:value': [value: string]
}>()

watch(() => props.value, (value) => {
  currentValue.value = value
})
</script>

<template>
  <FormField :name="fieldName">
    <FormItem v-bind="$attrs" class="flex flex-col mt-2.5">
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ label }}
      </AutoFormLabel>
      <FormControl>
        <Popover v-model:open="open">
          <PopoverTrigger as-child>
            <Button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
              {{ currentValue
                ? list.find((currency) => currency.value === currentValue)?.label
                : "Select currency..." }}
              <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[460px] p-0">
            <Command>
              <CommandInput class="h-9" placeholder="Search currency..." />
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem v-for="item in list" :key="item.value" :value="item.value" @select="(ev) => {
                    if (typeof ev.detail.value === 'string') {
                      currentValue = ev.detail.value
                      emit('update:value', ev.detail.value)
                    }
                    open = false
                  }">
                    {{ item.label }}
                    <CheckIcon :class="cn(
                      'ml-auto h-4 w-4',
                      value === item.value ? 'opacity-100' : 'opacity-0',
                    )" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </FormControl>
      <FormDescription v-if="config?.description">
        {{ config.description }}
      </FormDescription>
      <FormMessage />
    </FormItem>
  </FormField>
</template>
