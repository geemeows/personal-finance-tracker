<script lang="ts" setup>
import { currentAccountKey } from '@/utils/injectionKeys';
import { computed, inject } from 'vue';

const { title, description, value } = defineProps<{
  title: string
  description: string
  value: number
}>()

const currentAccount = inject(currentAccountKey)

const formattedValue = computed(() => Math.abs(parseFloat(value.toFixed(2))).toLocaleString('en-US'))
</script>

<template>
  <div class="flex flex-col gap-1 bg-stone-100 rounded-2xl p-4">
    <h3 class="text-2xl text-stone-600">{{ title }}</h3>
    <p class="text-sm text-stone-400 mb-6">{{ description }}</p>
    <p class="text-3xl text-stone-800 font-medium">
      {{ !value ? '-' : value < 0 ? `- ${currentAccount?.currency} ${formattedValue}` :
        `${currentAccount?.currency}&nbsp;${formattedValue}` }} </p>
  </div>
</template>

<style lang="scss" scoped></style>
