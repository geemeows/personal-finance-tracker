<script setup lang="ts">
import { columns } from '@/utils/dashboardColumns'
import DataTable from '@/components/common/Table/DataTable.vue'
import { useToast } from '@/components/ui/toast/use-toast'

import { inject, onMounted, type Ref } from 'vue'
import { getTransactionsKey, transactionsKey } from '@/utils/injectionKeys'
import type { Transaction } from '@/utils/indexedDBQueries'

const transactions = inject(transactionsKey) as Ref<Transaction[]>

const fetchTransactions = inject(getTransactionsKey, async () => {
  throw new Error('fetchTransactions function not provided')
})

const { toast } = useToast()

const getTransactionsData = async () => {
  try {
    await fetchTransactions()
  } catch (error) {
    toast({
      title: 'Something went wrong',
      variant: 'destructive',
      description: 'Could not get transactions data',
    });
  }
}

onMounted(async () => {
  await getTransactionsData()
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 p-2 md:flex">
    <DataTable :data="transactions" :columns="columns" :hide-pagination="true" />
  </div>
</template>
