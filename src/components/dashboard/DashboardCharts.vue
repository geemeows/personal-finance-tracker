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
} from 'lucide-vue-next'

const data = [
  { name: 'Jan', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Feb', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Mar', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Apr', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'May', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jun', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
  { name: 'Jul', total: Math.floor(Math.random() * 2000) + 500, predicted: Math.floor(Math.random() * 2000) + 500 },
]
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
      <AreaChart :data="data" index="name" :categories="['total', 'predicted']" :show-legend="false"
        :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04']" :custom-tooltip="ChartTooltip" />
    </TabsContent>

    <TabsContent value="categories">
      <BarChart :data="data" index="name" :categories="['total', 'predicted']" :show-legend="false"
        :show-grid-line="false" :colors="['#AEA8FF', '#ca8a04']" :custom-tooltip="ChartTooltip" />
    </TabsContent>
  </Tabs>
</template>
