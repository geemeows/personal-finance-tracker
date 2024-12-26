<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useTransactionsDbStore } from '@/composables/useTransactionStore'
import { useAccountsDbStore } from '@/composables/useAccountsStore'
import { useGlobalDatabase } from '@/composables/useDatabase'
import { onMounted, provide, watch } from 'vue'
import {
  accountsKey,
  addAccountKey,
  AddTransactionKey,
  currentAccountKey,
  deleteTransactionKey,
  exchangeRatesKey,
  exchangeRatesLastUpdatedKey,
  getAccountsKey,
  getFilteredTransactionsKey,
  getTransactionByIdKey,
  getTransactionsKey,
  transactionsKey,
  updateAccountCurrencyKey,
  updateTransactionKey
} from './utils/injectionKeys'

const router = useRouter()

// Get global database instance
const { ensureInitialized: ensureDbInitialized } = useGlobalDatabase()

const {
  transactions,
  fetchTransactions,
  filterTrx,
  addTrx,
  updateTrx,
  deleteTrx,
  getTrxById,
  fetchExchangeRate,
  exchangeRate,
  ratesLastUpdated,
  currentCurrency,
  isInitialized: isTransactionsInitialized,
  ensureInitialized: ensureTransactionsInitialized
} = useTransactionsDbStore()

const {
  accounts,
  fetchAccounts,
  addNewAccount,
  currentAccount,
  updateAccountCurrency,
  isInitialized: isAccountsInitialized,
  ensureInitialized: ensureAccountsInitialized
} = useAccountsDbStore()

// Provide all dependencies
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
    await ensureDbInitialized()

    await Promise.all([
      ensureAccountsInitialized(),
      ensureTransactionsInitialized()
    ])
  } catch (error) {
    console.error('Error during initialization:', error)
    // You might want to show a global error state or redirect to an error page
  }
})

// Watch for empty accounts to redirect
watch(() => accounts.value, (newAccounts) => {
  if (isAccountsInitialized.value && !newAccounts.length) {
    router.push('/new-account')
  }
}, { immediate: true })

// Watch for currency changes
watch(() => currentAccount.value, async (newAccount) => {
  if (newAccount && newAccount.currency !== currentCurrency.value) {
    await fetchExchangeRate(newAccount.currency)
  }
}, { deep: true })
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <Suspense>
      <template #default>
        <div>
          <Toaster />
          <RouterView v-if="isAccountsInitialized && isTransactionsInitialized" />
          <div v-else class="flex items-center justify-center min-h-screen">
            <p>Loading...</p>
          </div>
        </div>
      </template>
      <template #fallback>
        <div class="flex items-center justify-center min-h-screen">
          <p>Loading...</p>
        </div>
      </template>
    </Suspense>
  </component>
</template>
