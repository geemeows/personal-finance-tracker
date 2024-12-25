import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.number(),
  amount: z.number(),
  title: z.string(),
  category: z.union([z.string(), z.enum(['Bills', 'Transportation', 'General', 'Food'])]),
  date: z.string(),
  currency: z.string(),
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
  currency: z.string().describe('Transaction Currency'),
})

export type Transaction = z.infer<typeof transactionSchema>
