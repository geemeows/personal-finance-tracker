<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useIndexedDbStore } from '@/composables/useTransactionStore';
import { provide } from 'vue';
import { AddTransactionKey, getTransactionsKey, transactionsKey } from './utils/db';

const {
  transactions,
  fetchTransactions,
  filterTrx,
  addTrx,
  updateTrx,
  deleteTrx,
  isLoading: isLoadingTrx,
  error: errorTrx } = useIndexedDbStore()

provide(transactionsKey, transactions)
provide(getTransactionsKey, fetchTransactions)
provide('filterTrx', filterTrx)
provide(AddTransactionKey, addTrx)
provide('updateTrx', updateTrx)
provide('deleteTrx', deleteTrx)
provide('isLoadingTrx', isLoadingTrx)
provide('errorTrx', errorTrx)
</script>

<template>
  <AppLayout>
    <Toaster />
    <RouterView />
  </AppLayout>
</template>
