<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'

import { useTransactionsDbStore } from '@/composables/useTransactionStore';
import { useAccountsDbStore } from '@/composables/useAccountsStore';

import { onMounted, provide, watch } from 'vue';
import { accountsKey, addAccountKey, AddTransactionKey, currentAccountKey, deleteTransactionKey, exchangeRatesKey, exchangeRatesLastUpdatedKey, getAccountsKey, getFilteredTransactionsKey, getTransactionByIdKey, getTransactionsKey, transactionsKey, updateAccountCurrencyKey, updateTransactionKey } from './utils/db';

const router = useRouter()

const {
  transactions,
  fetchTransactions,
  filterTrx,
  addTrx,
  updateTrx,
  deleteTrx,
  getTrxById, fetchExchangeRate, exchangeRate, ratesLastUpdated, currentCurrency } = useTransactionsDbStore()

const { accounts, fetchAccounts, addNewAccount, currentAccount, updateAccountCurrency } = useAccountsDbStore()


provide(transactionsKey, transactions)
provide(getTransactionsKey, fetchTransactions)
provide(getFilteredTransactionsKey, filterTrx)
provide(AddTransactionKey, addTrx)
provide(updateTransactionKey, updateTrx)
provide(deleteTransactionKey, deleteTrx)
provide(getTransactionByIdKey, getTrxById)

provide(accountsKey, accounts)
provide(currentAccountKey, currentAccount)
provide(getAccountsKey, fetchAccounts)
provide(addAccountKey, addNewAccount)
provide(updateAccountCurrencyKey, updateAccountCurrency)

provide(exchangeRatesKey, exchangeRate)
provide(exchangeRatesLastUpdatedKey, ratesLastUpdated)

onMounted(async () => {
  try {
    await fetchAccounts()
  } catch (error) {
    console.error('Error fetching accounts:', error)
  }
})

watch(() => accounts.value, (newAccounts) => {
  if (!newAccounts.length) {
    router.push('/new-account')
  }
})

watch(() => currentAccount.value, async (newAccount, oldAccount) => {
  if (newAccount && newAccount.currency !== currentCurrency.value) {
    await fetchExchangeRate(newAccount.currency)
  }
}, { deep: true })
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <Toaster />
    <RouterView />
  </component>
</template>
