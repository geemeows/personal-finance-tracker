<script setup lang="ts">
import { useRouter } from 'vue-router'
import NewTransactionForm from '@/components/transactions/NewTransactionForm.vue'

const route = useRouter()

const handleSubmitNewTransaction = () => {
  route.push('/transactions')
}
</script>

<template>
  <NewTransactionForm @submitted="handleSubmitNewTransaction" />
</template>
