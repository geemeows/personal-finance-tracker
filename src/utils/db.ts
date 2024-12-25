import type { Filter, Transaction } from './indexedDB'
import { type InjectionKey, type Ref } from 'vue'

type addTransactionFn = (transaction: Omit<Transaction, 'id'>) => Promise<void>
type getTransactionsFn = () => Promise<void>
type getFilteredTransactionsFn = (filter: Filter) => Promise<Transaction[]>
type updateTransactionsFn = (item: Transaction) => Promise<void>
type deleteTransactionsFn = (id: number) => Promise<void>
type getTransactionByIdFn = (id: number) => Promise<Transaction | undefined>

export const AddTransactionKey = Symbol('addTrx') as InjectionKey<addTransactionFn>

export const getTransactionsKey = Symbol('fetchTransactions') as InjectionKey<getTransactionsFn>

export const getFilteredTransactionsKey = Symbol(
  'filterTrx',
) as InjectionKey<getFilteredTransactionsFn>

export const transactionsKey = Symbol('transactions') as InjectionKey<Ref<Transaction[]>>

export const updateTransactionKey = Symbol('updateTrx') as InjectionKey<updateTransactionsFn>
export const deleteTransactionKey = Symbol('deleteTrx') as InjectionKey<deleteTransactionsFn>
export const getTransactionByIdKey = Symbol('getTrxById') as InjectionKey<getTransactionByIdFn>
