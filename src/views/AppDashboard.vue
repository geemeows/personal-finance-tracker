<script lang="ts" setup>
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import DashboardTable from '@/components/dashboard/DashboardTable.vue'
import { getFilteredTransactionsKey } from '@/utils/db';
import type { Transaction } from '@/utils/indexedDB';
import { computed, inject, onMounted, ref } from 'vue';

const today = new Date();

const filteredTransactions = ref<Transaction[]>([])
const fetchFilteredTransactions = inject(getFilteredTransactionsKey, async () => {
  throw new Error('fetchTransactions function not provided')
})

const netBalance = computed(() => filteredTransactions.value.reduce((acc, transaction) => acc + transaction.amount, 0))
const totalIncome = computed(() => filteredTransactions.value.filter(tx => tx.amount > 0).reduce((acc, transaction) => acc + transaction.amount, 0))
const totalExpenses = computed(() => filteredTransactions.value.filter(tx => tx.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0))


onMounted(async () => {
  const startDate = `${today.getFullYear()}-${today.getMonth() + 1}-01`;
  const endDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

  filteredTransactions.value = await fetchFilteredTransactions({ startDate, endDate })
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
