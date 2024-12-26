<script setup lang="ts">
import { AreaChart } from '@/components/ui/chart-area'
import { BarChart } from '@/components/ui/chart-bar'
import ChartTooltip from '../common/Chart/ChartTooltip.vue'
import DateFilter from './DateFilter.vue'


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import {
  CircleDollarSign,
  PanelsTopLeft,
  HandCoins,
  Download
} from 'lucide-vue-next'

import { PlusCircledIcon } from '@radix-icons/vue'


import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import NewTransactionForm from '@/components/transactions/NewTransactionForm.vue'


import { currentAccountKey, exchangeRatesKey, getFilteredTransactionsKey, transactionsKey } from '@/utils/db'
import { inject, onMounted, ref, watch, type Ref } from 'vue'
import type { Transaction } from '@/utils/indexedDB'
import { mapTransactionsToBuckets, mapTransactionsToBucketsByCategories, type BucketedTransaction, type CategoriesBucketedTransaction } from '@/utils/chartHelpers'
import { JSONToCSV } from '@/utils/helpers'


const today = new Date();
const allTransactions = inject(transactionsKey) as Ref<Transaction[]>

const exchangeRates = inject(exchangeRatesKey)
const currentAccount = inject(currentAccountKey)

const accumulator = (acc: number, transaction: Transaction) => {
  const amountRate = exchangeRates?.value?.[transaction.currency] || 1
  const convertedAmount = Math.abs(transaction.amount) * (1 / amountRate) * (exchangeRates?.value?.[currentAccount?.value?.currency!] || 1)
  return acc + convertedAmount
}

const currentSelectedDate = ref({
  start: `${today.getFullYear()}-${today.getMonth() + 1}-01`,
  end: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate() < 10 ? `0${today.getDate()}` : today.getDate()}`,
})
const filteredTransactions = ref<Transaction[]>([])
const transactionsTabData = ref<BucketedTransaction[]>([])
const categoriesTabData = ref<CategoriesBucketedTransaction[]>([])

const fetchFilteredTransactions = inject(getFilteredTransactionsKey, async () => {
  throw new Error('fetchTransactions function not provided')
})

const onDateChange = async ({ start, end }: { start: string; end: string }) => {
  currentSelectedDate.value = {
    start,
    end
  }

  filteredTransactions.value = await fetchFilteredTransactions({ startDate: start, endDate: end })
  transactionsTabData.value = mapTransactionsToBuckets(filteredTransactions.value, accumulator)
  categoriesTabData.value = mapTransactionsToBucketsByCategories(filteredTransactions.value, accumulator)
}

const newTransactionModalOpen = ref(false)

const handleSubmitNewTransaction = () => {
  newTransactionModalOpen.value = false
}

const onDownloadData = () => {
  const CSVData = JSONToCSV(filteredTransactions.value);
  // Create a CSV file and allow the user to download it
  const blob = new Blob([CSVData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'expensify_transactions.csv';
  document.body.appendChild(a);
  a.click();
}


onMounted(async () => {
  const today = new Date();
  const startDate = `${today.getFullYear()}-${today.getMonth() + 1}-01`;
  const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  filteredTransactions.value = await fetchFilteredTransactions({ startDate, endDate })
  transactionsTabData.value = mapTransactionsToBuckets(filteredTransactions.value, accumulator)
  categoriesTabData.value = mapTransactionsToBucketsByCategories(filteredTransactions.value, accumulator);
})

watch(() => allTransactions.value, () => {
  onDateChange(currentSelectedDate.value)
})

</script>

<template>
  <Tabs v-if="allTransactions.length" default-value="transactions">
    <div class="flex flex-row justify-end mb-4 gap-2">
      <DateFilter @change="onDateChange" />
      <TabsList class="mb-3 h-auto -space-x-px bg-background p-0 rtl:space-x-reverse">
        <TabsTrigger value="transactions"
          class="relative overflow-hidden rounded-none border border-border py-2 first:rounded-s-full last:rounded-e-full data-[state=active]:bg-muted data-[state=active]:shadow-none">
          <div class="flex flex-row items-center">
            <CircleDollarSign class="me-1.5 opacity-60" :size="16" :strokeWidth="2" aria-hidden="true" />
            <span>Transactions</span>
          </div>
        </TabsTrigger>
        <TabsTrigger value="categories"
          class="relative overflow-hidden rounded-none border border-border py-2 first:rounded-s-full last:rounded-e-full data-[state=active]:bg-muted data-[state=active]:shadow-none">
          <div class="flex flex-row items-center">
            <PanelsTopLeft class="me-1.5 opacity-60" :size="16" :strokeWidth="2" aria-hidden="true" />
            <span>Categories</span>
          </div>
        </TabsTrigger>
      </TabsList>
      <Button
        class="rounded-full border border-dashed border-green-500 text-green-600 hover:text-green-600 flex flex-row items-center"
        variant="outline" @click="onDownloadData">
        <Download class="w-4 h-4" />
        <span>Download CSV</span>
      </Button>
    </div>

    <TabsContent value="transactions">
      <AreaChart :data="transactionsTabData" index="bucket" :categories="['expense', 'income']" :show-legend="false"
        :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04']" :custom-tooltip="ChartTooltip" />
    </TabsContent>

    <TabsContent value="categories">
      <BarChart :data="categoriesTabData" index="bucket" :categories="['food', 'transportation', 'general', 'bills']"
        :show-legend="false" :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04', '#0ea5e9', '#f87171']"
        :custom-tooltip="ChartTooltip" />
    </TabsContent>
  </Tabs>
  <div v-else class="flex flex-col items-center justify-center h-[400px] gap-3">
    <HandCoins class="opacity-30 w-20 h-20" :size="32" :strokeWidth="2" aria-hidden="true" />
    <p class="text-muted-foreground">No transactions to show! Please add some to show your dashboard</p>

    <Dialog :open="newTransactionModalOpen" @update:open="newTransactionModalOpen = $event">
      <DialogTrigger as-child>
        <Button class="border-dashed" variant="outline" @click="newTransactionModalOpen = true">
          <PlusCircledIcon class="mr-1 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent class="">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Add new Transaction to your account
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <NewTransactionForm @submitted="handleSubmitNewTransaction" />
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
