import { z } from 'zod'
import currencies from '@/utils/currencies.json'

const zodEnum = <T>(arr: T[]): [T, ...T[]] => arr as [T, ...T[]]

const codes = currencies.map((currency) => currency.code)

export const transactionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  title: z.string(),
  category: z.union([z.string(), z.enum(['Bills', 'Transportation', 'General', 'Food'])]),
  date: z.string(),
  currency: z.enum(zodEnum(codes)),
})

export const createTransactionSchema = z.object({
  title: z.string().describe('Transaction Description'),
  amount: z.number().describe('Transaction Amount'),
  type: z.enum(['Income', 'Expense']).describe('Transaction Type'),
  category: z
    .enum(['Bills', 'Transportation', 'General', 'Food'])
    .describe('Transaction Category')
    .optional(),
  date: z.coerce.date().describe('Transaction Date'),
  currency: z.enum(zodEnum(codes)).describe('Transaction Currency'),
})

export type Transaction = z.infer<typeof transactionSchema>
