<script setup lang="ts">
import { ref, toRefs } from 'vue';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import {
  LockKeyholeOpen,
  KeyRound,
  ChevronsUpDown,
  Plus,
} from 'lucide-vue-next'
import type { Account } from '@/types/Account';

const { accounts } = defineProps<{
  accounts: Account[]
}>()

const activeAccount = ref(accounts[0])

const setActiveAccount = (account: typeof accounts[number]) => {
  activeAccount.value = account
}

</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div
              class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground bg-black text-white">
              <LockKeyholeOpen v-if="activeAccount.type === 'open'" class="size-4" />
              <KeyRound v-else class="size-4" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ activeAccount.name }}</span>
              <div class="flex gap-1 items-center">
                <span class="truncate text-xs capitalize">{{ activeAccount.type }}</span>
                <span v-if="activeAccount.type === 'locked'" class="truncate text-[10px] text-slate-500 italic">(Require
                  auth.)</span>
              </div>
            </div>
            <ChevronsUpDown class="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start"
          side="bottom" :side-offset="4">
          <DropdownMenuLabel class="text-xs text-muted-foreground">
            Accounts
          </DropdownMenuLabel>
          <DropdownMenuItem v-for="(account, index) in accounts" :key="account.name" class="gap-2 p-2"
            @click="setActiveAccount(account)">
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <LockKeyholeOpen v-if="account.type === 'open'" class="size-4" />
              <KeyRound v-else class="size-4" />
            </div>
            {{ account.name }}
            <DropdownMenuShortcut>⌘{{ index + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div class="flex size-6 items-center justify-center rounded-md border bg-background">
              <Plus class="size-4" />
            </div>
            <div class="font-medium text-muted-foreground">
              Add account
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>