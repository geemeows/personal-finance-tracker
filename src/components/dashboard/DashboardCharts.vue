<script setup lang="ts">
import { AreaChart } from '@/components/ui/chart-area'
import { BarChart } from '@/components/ui/chart-bar'
import ChartTooltip from '../common/Chart/ChartTooltip.vue'
import DateFilter from './DateFilter.vue'
import transactions from '@/utils/transactions.json'


import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import {
  CircleDollarSign,
  PanelsTopLeft,
} from 'lucide-vue-next'

interface Transaction {
  id: number;
  amount: string;
  title: string;
  category: string;
  date: string;
  currency: string;
}

interface BucketedTransaction {
  bucket: string; // date
  income: number; // total income in this bucket
  expense: number; // total expense in this bucket
}

interface CategoriesBucketedTransaction {
  bucket: string; // date
  food: number;
  transportation: number;
  general: number;
  bills: number;
}

function mapTransactionsToBuckets(transactions: Transaction[]): BucketedTransaction[] {
  const groupedBy: 'day' | 'month' = transactions.every(tx => tx.date.slice(0, 7) === transactions[0].date.slice(0, 7))
    ? 'day'
    : 'month';

  const buckets: Record<string, { income: number; expense: number }> = {};

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount);
    const bucket = groupedBy === 'day' ? transaction.date : transaction.date.slice(0, 7);

    if (!buckets[bucket]) {
      buckets[bucket] = { income: 0, expense: 0 };
    }

    if (amount > 0) {
      buckets[bucket].income += amount;
    } else {
      buckets[bucket].expense += Math.abs(amount);
    }
  });

  return Object.entries(buckets)
    .map(([bucket, { income, expense }]) => ({
      bucket,
      income: parseFloat(income.toFixed(2)),
      expense: parseFloat(expense.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime());
}

function mapTransactionsToBucketsByCategories(transactions: Transaction[]): CategoriesBucketedTransaction[] {
  const groupedBy: 'day' | 'month' = transactions.every(tx => tx.date.slice(0, 7) === transactions[0].date.slice(0, 7))
    ? 'day'
    : 'month';

  const buckets: Record<string, { food: number; transportation: number; general: number; bills: number }> = {};

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount);
    const bucket = groupedBy === 'day' ? transaction.date : transaction.date.slice(0, 7);

    if (!buckets[bucket]) {
      buckets[bucket] = { food: 0, transportation: 0, general: 0, bills: 0 };
    }

    switch (transaction.category.toLowerCase()) {
      case 'food':
        buckets[bucket].food += amount;
        break;
      case 'transportation':
        buckets[bucket].transportation += amount;
        break;
      case 'general':
        buckets[bucket].general += amount;
        break;
      case 'bills':
        buckets[bucket].bills += amount;
        break;
    }
  });

  return Object.entries(buckets)
    .map(([bucket, totals]) => ({
      bucket,
      food: parseFloat(totals.food.toFixed(2)),
      transportation: parseFloat(totals.transportation.toFixed(2)),
      general: parseFloat(totals.general.toFixed(2)),
      bills: parseFloat(totals.bills.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.bucket).getTime() - new Date(b.bucket).getTime());
}

const result = mapTransactionsToBuckets(transactions);
const result2 = mapTransactionsToBucketsByCategories(transactions);

</script>

<template>
  <Tabs default-value="transactions">
    <div class="flex flex-row justify-end mb-4 gap-2">
      <DateFilter />
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
    </div>

    <TabsContent value="transactions">
      <AreaChart :data="result" index="bucket" :categories="['expense', 'income']" :show-legend="false"
        :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04']" :custom-tooltip="ChartTooltip" />
    </TabsContent>

    <TabsContent value="categories">
      <BarChart :data="result2" index="bucket" :categories="['food', 'transportation', 'general', 'bills']"
        :show-legend="false" :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04', '#0ea5e9', '#f87171']"
        :custom-tooltip="ChartTooltip" />
    </TabsContent>
  </Tabs>
</template>
