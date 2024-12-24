<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { createTransactionSchema } from '@/types/schemas'

function onSubmit(values: Record<string, unknown>) {
  console.log({ values })
}
</script>

<template>
  <div class="flex flex-row justify-center">
    <AutoForm class="flex w-2/3 flex-col gap-4" :schema="createTransactionSchema" @submit="onSubmit">
      <Button class="w-full" type="submit">
        Submit
      </Button>
    </AutoForm>
  </div>
</template>
