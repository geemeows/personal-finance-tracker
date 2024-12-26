<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { createTransactionSchema } from '@/types/schemas'
import { DependencyType } from '@/components/ui/auto-form/interface'
import { useToast } from '@/components/ui/toast/use-toast'

import currencies from '@/utils/currencies.json'

import type { Transaction } from '@/utils/indexedDBQueries'
import { inject, ref, watch, h } from 'vue'
import { AddTransactionKey, currentAccountKey, getTransactionByIdKey, updateTransactionKey } from '@/utils/injectionKeys'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

import {
  CalendarDate,
} from '@internationalized/date'

import DropdownWithSearch from '@/components/common/Forms/DropdownWithSearch.vue'

const addTrx = inject(AddTransactionKey, async () => {
  throw new Error('addTrx function not provided')
})

const getTrxById = inject(getTransactionByIdKey, async () => {
  throw new Error('getTrxById function not provided')
})

const updateTrx = inject(updateTransactionKey, async () => {
  throw new Error('updateTrx function not provided')
})

const currentTrx = ref<Transaction>()

const props = defineProps<{
  id?: number
}>()

const emit = defineEmits(['submitted'])

const { toast } = useToast()

const handleFormSubmit = (values: Record<string, string | number | Date>) => {
  if (currentTrx.value)
    updateTransaction(values)
  else
    addNewTransaction(values)
}

const addNewTransaction = async (values: Record<string, string | number | Date>) => {
  const trxDate = new Date(values.date)

  const formValues = {
    ...values,
    date: `${trxDate.getFullYear()}-${trxDate.getMonth() + 1}-${trxDate.getDate() < 10 ? `0${trxDate.getDate()}` : trxDate.getDate()}`,
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

const updateTransaction = async (values: Record<string, string | number | Date>) => {
  const trxDate = new Date(values.date)

  const formValues = {
    ...values,
    date: `${trxDate.getFullYear()}-${trxDate.getMonth() + 1}-${trxDate.getDate() < 10 ? `0${trxDate.getDate()}` : trxDate.getDate()}`,
    amount: values.type === 'Income' ? Number(values.amount) : -Number(values.amount),
  } as Omit<Transaction, 'id'>

  try {
    await updateTrx({
      ...formValues,
      id: props.id
    })
    toast({
      title: 'New Transaction',
      description: 'Your transaction was successfully updated!',
    });
    emit('submitted')
  } catch (error) {
    toast({
      title: 'New Transaction',
      variant: 'destructive',
      description: 'Your transaction was not updated!',
    });
  }
}

const currentAccount = inject(currentAccountKey)

const form = useForm({
  validationSchema: toTypedSchema(createTransactionSchema),
  initialValues: {
    currency: currentTrx?.value?.currency || currentAccount?.value?.currency || '',
    type: 'Expense',
    category: 'General',
  }
})


const currenciesList = currencies.map(({ code, currency }) => ({
  label: `${code} (${currency})`,
  value: code,
}))

watch(() => props.id, async (id) => {
  if (id) {
    currentTrx.value = await getTrxById(id)
    if (currentTrx.value) {
      const formValues = {
        amount: currentTrx.value.amount,
        title: currentTrx.value.title,
        category: currentTrx.value.category,
        date: currentTrx.value.date,
        type: currentTrx.value.amount < 0 ? 'Expense' : 'Income',
        currency: currentTrx.value.currency
      } as Transaction
      const date = new Date(formValues.date)
      const trxDate = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate())
      form.setValues({
        ...formValues,
        date: trxDate as unknown as Date,
        category: formValues.category ? formValues.category as unknown as ('Food' | 'Transportation' | 'General' | 'Bills') : undefined,
        currency: formValues.currency
      })
    }

  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-row">
    <AutoForm class="flex w-full flex-col gap-4" :form="form" :schema="createTransactionSchema"
      @submit="handleFormSubmit" :dependencies="[
        {
          sourceField: 'type',
          type: DependencyType.HIDES,
          targetField: 'category',
          when: type => type === 'Income',
        },
      ]" :field-config="{
        currency: {
          component: () => h(DropdownWithSearch, {
            fieldName: 'currency',
            value: currentTrx?.currency || currentAccount?.currency || '',
            list: currenciesList,
            label: 'Transaction Currency',
            required: true,
            'onUpdate:value': (newValue: string) => {
              form.setFieldValue('currency', newValue)
            }
          }),
        }
      }">
      <Button class="w-full" type="submit">
        {{ currentTrx ? 'Update' : 'Submit' }}
      </Button>
    </AutoForm>
  </div>
</template>
