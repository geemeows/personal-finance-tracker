import { ref, watch } from 'vue'
import { type Account, openDatabase, addAccount, getAllAccounts } from '@/utils/indexedDBQueries'
import { useGlobalDatabase } from './useDatabase'

export const useAccountsDbStore = () => {
  const {
    db,
    isInitialized: isDbInitialized,
    ensureInitialized: ensureDbInitialized,
  } = useGlobalDatabase()

  const accounts = ref<Account[]>([])
  const currentAccount = ref<Account | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const fetchAccounts = async (): Promise<void> => {
    if (!db.value) {
      throw new Error('Database not initialized')
    }

    isLoading.value = true
    error.value = null

    try {
      const fetchedAccounts = await getAllAccounts(db.value)
      accounts.value = fetchedAccounts

      if (!currentAccount.value && fetchedAccounts.length > 0) {
        currentAccount.value = { ...fetchedAccounts[0] }
      }
      isInitialized.value = true
    } catch (err) {
      error.value = (err as Error).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const addNewAccount = async (item: Account): Promise<void> => {
    try {
      if (db.value) {
        const id = await addAccount(db.value, item)
        accounts.value = [{ ...item, id }, ...accounts.value]
        await fetchAccounts()
      }
    } catch (err) {
      error.value = (err as Error).message
      await fetchAccounts()
    }
  }

  const updateAccountCurrency = (currency: string) => {
    if (currentAccount.value) {
      currentAccount.value.currency = currency
    }
  }

  watch(isDbInitialized, async (initialized) => {
    if (initialized && !isInitialized.value) {
      await fetchAccounts()
    }
  })

  const ensureInitialized = async () => {
    await ensureDbInitialized()
    if (!isInitialized.value) {
      await fetchAccounts()
    }
  }

  watch(db, async (newDb) => {
    if (newDb) {
      await fetchAccounts()
    }
  })

  return {
    accounts,
    currentAccount,
    isLoading,
    isInitialized,
    error,
    addNewAccount,
    fetchAccounts,
    updateAccountCurrency,
    ensureInitialized,
  }
}
