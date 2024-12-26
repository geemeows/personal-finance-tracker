<script setup lang="ts">
import type { Row } from '@tanstack/vue-table'
import type { Transaction } from '@/utils/indexedDBQueries'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import NewTransactionForm from '@/components/transactions/NewTransactionForm.vue'


import { DotsHorizontalIcon } from '@radix-icons/vue'
import { inject, ref } from 'vue'
import { deleteTransactionKey } from '@/utils/injectionKeys'

interface DataTableRowActionsProps {
  row: Row<Transaction>
}
const props = defineProps<DataTableRowActionsProps>()
const deleteTrx = inject(deleteTransactionKey) as (id: number) => void

const editModalOpen = ref(false)
const selectedTransaction = ref(props.row.original.id)


const onDeleteTransaction = () => {
  deleteTrx(props.row.original.id!)
}

const onEditTransaction = () => {
  editModalOpen.value = true
}
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
      <DropdownMenuItem @click="onEditTransaction">Edit</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="onDeleteTransaction">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Dialog :open="editModalOpen" @update:open="() => { editModalOpen = false }">
    <DialogContent class="">
      <DialogHeader>
        <DialogTitle>Edit Transaction</DialogTitle>
        <DialogDescription>
          Edit Transaction
        </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <NewTransactionForm @submitted="() => { editModalOpen = false }" :id="selectedTransaction" />
      </div>
    </DialogContent>
  </Dialog>
</template>
