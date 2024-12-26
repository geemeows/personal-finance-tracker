import { ref, watch } from 'vue'
import {
  type Transaction,
  openDatabase,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  type Filter,
  getTransactionById,
} from '@/utils/indexedDBQueries'
import { sortTransactions } from '@/utils/helpers'
import { getExchangeRates } from '@/services/exchangeRates.servieces'

export const useTransactionsDbStore = () => {
  const currentCurrency = ref('')
  const exchangeRate = ref<{ [key: string]: number }>()
  const ratesLastUpdated = ref<string>()

  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const db = ref<IDBDatabase | null>(null)
  const currentFilter = ref<Filter | null>(null)

  const initializeDb = async (): Promise<void> => {
    try {
      db.value = await openDatabase('FinanceDB')
      await fetchTransactions()
    } catch (err) {
      error.value = (err as Error).message
    }
  }

  const fetchExchangeRate = async (curr: string): Promise<void> => {
    currentCurrency.value = curr
    try {
      const { rates, lastUpdated } = await getExchangeRates(curr)
      exchangeRate.value = { ...rates }
      ratesLastUpdated.value = lastUpdated
    } catch (err) {
      error.value = (err as Error).message
    }
  }

  const fetchTransactions = async (): Promise<void> => {
    isLoading.value = true
    try {
      if (db.value) {
        transactions.value = await getAllTransactions(db.value, currentFilter.value || undefined)
      }
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  const filterTrx = async (filter: Filter): Promise<Transaction[]> => {
    currentFilter.value = filter
    if (db.value) {
      const transactions = await getAllTransactions(db.value, currentFilter.value || undefined)
      return transactions
    }
    return []
  }

  const addTrx = async (item: Transaction): Promise<void> => {
    try {
      if (db.value) {
        const id = await addTransaction(db.value, item)
        transactions.value = sortTransactions([{ ...item, id }, ...transactions.value])
      }
    } catch (err) {
      error.value = (err as Error).message
      await fetchTransactions()
    }
  }

  const updateTrx = async (item: Transaction): Promise<void> => {
    try {
      if (db.value) {
        await updateTransaction(db.value, item.id!, {
          ...item,
          category: item.amount > 0 ? undefined : item.category,
        })
        const index = transactions.value.findIndex((t) => t.id === item.id)
        if (index !== -1) {
          transactions.value = sortTransactions([
            ...transactions.value.slice(0, index),
            item,
            ...transactions.value.slice(index + 1),
          ])
        }
      }
    } catch (err) {
      error.value = (err as Error).message
      await fetchTransactions()
    }
  }

  const deleteTrx = async (id: number): Promise<void> => {
    try {
      if (db.value) {
        await deleteTransaction(db.value, id)
        transactions.value = transactions.value.filter((t) => t.id !== id)
      }
    } catch (err) {
      error.value = (err as Error).message
      await fetchTransactions()
    }
  }

  const getTrxById = async (id: number): Promise<Transaction | undefined> => {
    try {
      if (db.value) {
        const trx = await getTransactionById(db.value, id)
        return trx
      }
    } catch (err) {
      error.value = (err as Error).message
      await fetchTransactions()
    }
  }

  watch(db, async (newDb) => {
    if (newDb) {
      await fetchTransactions()
    }
  })

  // Initialize the database
  initializeDb()

  return {
    currentCurrency,
    exchangeRate,
    ratesLastUpdated,
    transactions,
    isLoading,
    error,
    addTrx,
    filterTrx,
    updateTrx,
    deleteTrx,
    fetchTransactions,
    fetchExchangeRate,
    getTrxById,
  }
}
