<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { createTransactionSchema } from '@/types/schemas'
import { DependencyType } from '@/components/ui/auto-form/interface'
import { useToast } from '@/components/ui/toast/use-toast'

import type { Transaction } from '@/utils/indexedDB'
import { inject } from 'vue'
import { AddTransactionKey } from '@/utils/db'

const addTrx = inject(AddTransactionKey, async () => {
  throw new Error('addTrx function not provided')
})

const emit = defineEmits(['submitted'])

const { toast } = useToast()


const onSubmit = async (values: Record<string, string | number | Date>) => {
  const trxDate = new Date(values.date)

  const formValues = {
    ...values,
    date: `${trxDate.getFullYear()}-${trxDate.getMonth() + 1}-${trxDate.getDate()}`,
    amount: values.type === 'Income' ? Number(values.amount) : -Number(values.amount),
  } as Omit<Transaction, 'id'>

  try {
    await addTrx(formValues)
    toast({
      title: 'New Transaction',
      description: 'Your transaction was successfully added!',
    });
    emit('submitted')
  } catch (error) {
    toast({
      title: 'New Transaction',
      variant: 'destructive',
      description: 'Your transaction was not added!',
    });
  }
}
</script>

<template>
  <div class="flex flex-row">
    <AutoForm class="flex w-full flex-col gap-4" :schema="createTransactionSchema" @submit="onSubmit" :dependencies="[
      {
        sourceField: 'type',
        type: DependencyType.HIDES,
        targetField: 'category',
        when: type => type === 'Income',
      },
    ]">
      <Button class="w-full" type="submit">
        Submit
      </Button>
    </AutoForm>
  </div>
</template>
