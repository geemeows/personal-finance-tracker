import { ref, watch } from 'vue'
import { type Account, openDatabase, addAccount, getAllAccounts } from '@/utils/indexedDBQueries'

export const useAccountsDbStore = () => {
  const accounts = ref<Account[]>([])
  const currentAccount = ref<Account | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const db = ref<IDBDatabase | null>(null)

  const initializeDb = async (): Promise<void> => {
    try {
      db.value = await openDatabase('FinanceDB')
      await fetchAccounts()
    } catch (err) {
      error.value = (err as Error).message
    }
  }

  const fetchAccounts = async (): Promise<void> => {
    isLoading.value = true
    try {
      if (db.value) {
        accounts.value = await getAllAccounts(db.value)
        currentAccount.value = {
          ...accounts.value[0],
        }
      }
    } catch (err) {
      error.value = (err as Error).message
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

  watch(db, async (newDb) => {
    if (newDb) {
      await fetchAccounts()
    }
  })

  // Initialize the database
  initializeDb()

  return {
    accounts,
    currentAccount,
    isLoading,
    error,
    addNewAccount,
    fetchAccounts,
    updateAccountCurrency,
  }
}
