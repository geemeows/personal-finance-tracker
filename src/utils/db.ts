import type { Transaction } from './indexedDB'
import { type InjectionKey, type Ref } from 'vue'

type AddTransactionFn = (transaction: Omit<Transaction, 'id'>) => Promise<void>
type getTransactionsFn = () => Promise<void>

export const AddTransactionKey = Symbol('addTrx') as InjectionKey<AddTransactionFn>

export const getTransactionsKey = Symbol('fetchTransactions') as InjectionKey<getTransactionsFn>

export const transactionsKey = Symbol('transactions') as InjectionKey<Ref<Transaction[]>>
