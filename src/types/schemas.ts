import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.number(),
  amount: z.string(),
  title: z.string(),
  category: z.union([z.string(), z.enum(['Bills', 'Transportation', 'General', 'Food'])]),
  date: z.string(),
  currency: z.string(),
})

export const createTransactionSchema = z.object({
  title: z.string().describe('Transaction Description'),
  amount: z.string().describe('Transaction Amount'),
  category: z.enum(['Bills', 'Transportation', 'General', 'Food']).describe('Transaction Category'),
  date: z.string().describe('Transaction Date'),
  currency: z.string().describe('Transaction Currency'),
})

export type Transaction = z.infer<typeof transactionSchema>
