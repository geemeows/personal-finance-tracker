<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useIndexedDbStore } from '@/composables/useTransactionStore';
import { provide } from 'vue';
import { AddTransactionKey, deleteTransactionKey, getFilteredTransactionsKey, getTransactionByIdKey, getTransactionsKey, transactionsKey, updateTransactionKey } from './utils/db';

const {
  transactions,
  fetchTransactions,
  filterTrx,
  addTrx,
  updateTrx,
  deleteTrx,
  getTrxById } = useIndexedDbStore()

provide(transactionsKey, transactions)
provide(getTransactionsKey, fetchTransactions)
provide(getFilteredTransactionsKey, filterTrx)
provide(AddTransactionKey, addTrx)
provide(updateTransactionKey, updateTrx)
provide(deleteTransactionKey, deleteTrx)
provide(getTransactionByIdKey, getTrxById)
</script>

<template>
  <AppLayout>
    <Toaster />
    <RouterView />
  </AppLayout>
</template>
