<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { createAccountSchema } from '@/types/schemas'
import { useToast } from '@/components/ui/toast/use-toast'

import currencies from '@/utils/currencies.json'
import DropdownWithSearch from '@/components/common/Forms/DropdownWithSearch.vue'


import type { Account } from '@/utils/indexedDBQueries'
import { inject, h } from 'vue'
import { addAccountKey } from '@/utils/injectionKeys'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'

const router = useRouter()

const addAccount = inject(addAccountKey, async () => {
  throw new Error('addAccount function not provided')
})

const emit = defineEmits(['submitted'])
const { toast } = useToast()

const currenciesList = currencies.map(({ code, currency }) => ({
  label: `${code} (${currency})`,
  value: code,
}))

const addNewAccount = async (values: Omit<Account, 'id'>) => {
  try {
    await addAccount(values)
    toast({
      title: 'New Account',
      description: 'Your account was successfully created!',
    });
    router.push('/')
    emit('submitted')
  } catch (error) {
    toast({
      title: 'New Account',
      variant: 'destructive',
      description: 'Your account was not created!',
    });
  }
}

const form = useForm({
  validationSchema: toTypedSchema(createAccountSchema),
  initialValues: {
    currency: 'EGP',
  }
})
</script>

<template>
  <div class="flex flex-row">
    <AutoForm class="flex w-full flex-col gap-4" :form="form" :schema="createAccountSchema" :field-config="{
      password: {
        inputProps: {
          type: 'password',
        },
      },
      currency: {
        component: () => h(DropdownWithSearch, {
          fieldName: 'currency',
          value: 'EGP',
          list: currenciesList,
          label: 'Account Currency',
          required: true,
          'onUpdate:value': (newValue: string) => {
            form.setFieldValue('currency', newValue)
          }
        }),
      }
    }" @submit="addNewAccount">
      <Button class="w-full" type="submit">
        Create Account
      </Button>
    </AutoForm>
  </div>
</template>
