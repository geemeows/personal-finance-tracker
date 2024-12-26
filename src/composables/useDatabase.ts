import { ref, onMounted } from 'vue'
import { openDatabase } from '@/utils/indexedDBQueries'

export const useDatabase = () => {
  const db = ref<IDBDatabase | null>(null)
  const isInitialized = ref(false)
  const error = ref<string | null>(null)
  const initializationPromise = ref<Promise<void> | null>(null)

  const initializeDb = async (): Promise<void> => {
    if (isInitialized.value) return

    try {
      db.value = await openDatabase('FinanceDB')
      isInitialized.value = true
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  const ensureInitialized = async () => {
    if (!initializationPromise.value) {
      initializationPromise.value = initializeDb()
    }
    return initializationPromise.value
  }

  onMounted(() => {
    ensureInitialized()
  })

  return {
    db,
    isInitialized,
    error,
    ensureInitialized,
  }
}

const globalDb = useDatabase()
export const useGlobalDatabase = () => globalDb
