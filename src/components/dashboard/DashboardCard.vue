<script lang="ts" setup>
import { computed } from 'vue';

const { title, description, value } = defineProps<{
  title: string
  description: string
  value: number
}>()

const formattedValue = computed(() => value.toLocaleString('en-US'))
</script>

<template>
  <div class="flex flex-col gap-1 bg-stone-100 rounded-2xl p-4">
    <h3 class="text-2xl text-stone-600">{{ title }}</h3>
    <p class="text-sm text-stone-400 mb-6">{{ description }}</p>
    <p class="text-3xl text-stone-800 font-medium">${{ formattedValue }}</p>
  </div>
</template>

<style lang="scss" scoped></style>
