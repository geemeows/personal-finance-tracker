<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Transaction } from '@/utils/indexedDB'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DotsHorizontalIcon } from '@radix-icons/vue'
import { computed } from 'vue'

import { labels } from '@/utils/helpers'
import { transactionSchema } from '@/types/schemas'

interface DataTableRowActionsProps {
  row: Row<Transaction>
}
const props = defineProps<DataTableRowActionsProps>()

const transaction = computed(() => transactionSchema.parse(props.row.original))
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
        <DotsHorizontalIcon class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem>Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
