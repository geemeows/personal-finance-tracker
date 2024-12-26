<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { createAccountSchema } from '@/types/schemas'
import { useToast } from '@/components/ui/toast/use-toast'

import type { Account } from '@/utils/indexedDBQueries'
import { inject, watch } from 'vue'
import { addAccountKey } from '@/utils/injectionKeys'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'

const router = useRouter()

const addAccount = inject(addAccountKey, async () => {
  throw new Error('addAccount function not provided')
})

const emit = defineEmits(['submitted'])
const { id } = defineProps<{ id?: number }>()
const { toast } = useToast()

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
})

watch(() => id, async (newId) => {
}, { immediate: true })
</script>

<template>
  <div class="flex flex-row">
    <AutoForm class="flex w-full flex-col gap-4" :form="form" :schema="createAccountSchema" :field-config="{
      password: {
        inputProps: {
          type: 'password',
        },
      },
    }" @submit="addNewAccount">
      <Button class="w-full" type="submit">
        Create Account
      </Button>
    </AutoForm>
  </div>
</template>
