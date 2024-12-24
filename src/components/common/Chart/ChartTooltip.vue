<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

defineProps<{
  title?: string
  data: {
    name: string
    color: string
    value: number
  }[]
}>()
</script>

<template>
  <Card class="text-sm bg-slate-700 text-slate-50 shadow-none">
    <CardHeader v-if="title" class="p-3 border-b-[1px] border-slate-500">
      <CardTitle>
        {{ title }}
      </CardTitle>
    </CardHeader>
    <CardContent class="p-3 min-w-[180px] flex flex-col gap-1">
      <div v-for="(item, key) in data" :key="key" class="flex justify-between">
        <div class="flex items-center">
          <div class="w-1 h-7 rounded mr-1" :style="{ backgroundColor: item.color }" />
          <span class="capitalize">{{ item.name }}</span>
        </div>
        <span class="font-semibold ml-4">{{ item.value.toLocaleString('en-US') }}</span>
      </div>
    </CardContent>
  </Card>
</template>
