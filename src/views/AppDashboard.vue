<script lang="ts" setup>
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import DashboardTable from '@/components/dashboard/DashboardTable.vue'
import { currentAccountKey, exchangeRatesKey, getFilteredTransactionsKey, transactionsKey } from '@/utils/injectionKeys';
import type { Transaction } from '@/utils/indexedDBQueries';
import type { NoSubstitutionTemplateLiteral } from 'typescript';
import { computed, inject, onMounted, ref, watch, type Ref } from 'vue';

const today = new Date();

const allTransactions = inject(transactionsKey) as Ref<Transaction[]>
const exchangeRates = inject(exchangeRatesKey)
const currentAccount = inject(currentAccountKey)



const filteredTransactions = ref<Transaction[]>([])
const fetchFilteredTransactions = inject(getFilteredTransactionsKey, async () => {
  throw new Error('fetchTransactions function not provided')
})

const accumulator = (acc: number, transaction: Transaction) => {
  const amountRate = exchangeRates?.value?.[transaction.currency] || 1
  const convertedAmount = transaction.amount * (1 / amountRate) * (exchangeRates?.value?.[currentAccount?.value?.currency!] || 1)
  return acc + convertedAmount
}
const netBalance = computed(() => filteredTransactions.value.reduce((acc, transaction) => accumulator(acc, transaction), 0))
const totalIncome = computed(() => filteredTransactions.value.filter(tx => tx.amount > 0).reduce((acc, transaction) => accumulator(acc, transaction), 0))
const totalExpenses = computed(() => filteredTransactions.value.filter(tx => tx.amount < 0).reduce((acc, transaction) => accumulator(acc, transaction), 0))

const getFilteredTransactions = async () => {
  const startDate = `${today.getFullYear()}-${today.getMonth() + 1}-01`;
  const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  filteredTransactions.value = await fetchFilteredTransactions({ startDate, endDate })
}

onMounted(async () => {
  await getFilteredTransactions()
})

watch(() => allTransactions.value, async () => {
  await getFilteredTransactions()
})
</script>

<template>
  <div class="flex items-center justify-between space-y-2">
    <div>
      <h2 class="text-2xl font-bold tracking-tight">
        Welcome back!
      </h2>
      <p class="text-muted-foreground">
        Here&apos;s a glimpse of your transactions for this month!
      </p>
    </div>
  </div>
  <div class="grid gap-4 md:grid-cols-3">
    <DashboardCard title="Net Balance" description="Your current total balance over this month." :value="netBalance" />
    <DashboardCard title="Total Income" description="Your total earnings over this month." :value="totalIncome" />
    <DashboardCard title="Total Expenses" description="Your total expenses over this month." :value="totalExpenses" />
  </div>

  <div class="mt-4 p-4 rounded-xl border border-gray-200">
    <DashboardCharts />
  </div>

  <div class="mt-4 p-4 rounded-xl border border-gray-200">
    <DashboardTable />
  </div>
</template>
