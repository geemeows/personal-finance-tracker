<script lang="ts" setup>
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'
import DashboardTable from '@/components/dashboard/DashboardTable.vue'
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
    <DashboardCard title="Net Balance" description="Your current total balance over this month." :value="5500 - 154" />
    <DashboardCard title="Total Income" description="Your total earnings over this month." :value="5500" />
    <DashboardCard title="Total Expenses" description="Your total expenses over this month." :value="154" />
  </div>

  <div class="mt-4 p-4 rounded-xl border border-gray-200">
    <DashboardCharts />
  </div>

  <div class="mt-4 p-4 rounded-xl border border-gray-200">
    <DashboardTable />
  </div>
</template>
