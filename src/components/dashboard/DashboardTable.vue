<script setup lang="ts">
import { columns } from '@/utils/dashboardColumns'
import DataTable from '@/components/common/Table/DataTable.vue'
import transactions from '@/utils/transactions.json'
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 p-2 md:flex">
    <DataTable :data="transactions" :columns="columns" :hide-pagination="true" />
  </div>
</template>
