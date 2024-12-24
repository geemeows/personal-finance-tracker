import { z } from 'zod'

export const transactionSchema = z.object({
  id: z.number(),
  amount: z.string(),
  title: z.string(),
  category: z.string(),
  date: z.string(),
  currency: z.string(),
})

export type Transaction = z.infer<typeof transactionSchema>
