import { sortTransactions } from './helpers'

export type Transaction = {
  id?: number
  title: string
  amount: number
  category?: string
  date: string
  currency: string
  createdAt?: Date
}

export type Filter = {
  startDate?: string
  endDate?: string
  category?: string
}

export const openDatabase = (dbName: string, version = 1): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true })
        store.createIndex('date', 'date', { unique: false })
        store.createIndex('category', 'category', { unique: false })
      }
    }

    request.onsuccess = (event) => resolve((event.target as IDBOpenDBRequest).result)
    request.onerror = (event) =>
      reject(`IndexedDB error: ${(event.target as IDBOpenDBRequest).error}`)
  })
}

export const addTransaction = (
  db: IDBDatabase,
  transaction: Omit<Transaction, 'id'>,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')
    const tx = db.transaction('transactions', 'readwrite')
    const store = tx.objectStore('transactions')
    const request = store.add({
      ...transaction,
      createdAt: new Date(),
    })

    request.onsuccess = () => resolve(request.result as number)
    request.onerror = (event) => reject((event.target as IDBRequest).error)
  })
}

export const updateTransaction = (
  db: IDBDatabase,
  id: number,
  updatedTransaction: Omit<Transaction, 'id'>,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')
    const tx = db.transaction('transactions', 'readwrite')
    const store = tx.objectStore('transactions')
    const request = store.put({ ...updatedTransaction, id })

    request.onsuccess = () => resolve(request.result as number)
    request.onerror = (event) => reject((event.target as IDBRequest).error)
  })
}

export const deleteTransaction = (db: IDBDatabase, id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')
    const tx = db.transaction('transactions', 'readwrite')
    const store = tx.objectStore('transactions')
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = (event) => reject((event.target as IDBRequest).error)
  })
}

export const getAllTransactions = (db: IDBDatabase, filter?: Filter): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')
    const tx = db.transaction('transactions', 'readonly')
    const store = tx.objectStore('transactions')
    const request = store.openCursor()
    const results: Transaction[] = []

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (cursor) {
        const { date, category } = cursor.value as Transaction
        const isWithinDateRange =
          (!filter?.startDate || new Date(date) >= new Date(filter.startDate)) &&
          (!filter?.endDate || new Date(date) <= new Date(filter.endDate))
        const isCategoryMatch = !filter?.category || category === filter.category

        if (!filter || (isWithinDateRange && isCategoryMatch)) {
          results.push(cursor.value as Transaction)
        }

        cursor.continue()
      } else {
        resolve(sortTransactions(results))
      }
    }

    request.onerror = (event) => reject((event.target as IDBRequest).error)
  })
}

export const getTransactionById = (
  db: IDBDatabase,
  id: number,
): Promise<Transaction | undefined> => {
  return new Promise((resolve, reject) => {
    if (!db) return reject('Database not initialized')
    const tx = db.transaction('transactions', 'readonly')
    const store = tx.objectStore('transactions')
    const request = store.get(id)

    request.onsuccess = (event) => {
      const transaction = (event.target as IDBRequest<IDBCursorWithValue>).result
      if (transaction) {
        resolve(transaction as unknown as Transaction)
      } else {
        resolve(undefined)
      }
    }

    request.onerror = (event) => reject((event.target as IDBRequest).error)
  })
}
