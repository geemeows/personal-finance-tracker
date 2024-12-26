<script setup lang=ts>
import { useRoute } from 'vue-router'

import currencies from '@/utils/currencies.json'


import AppBreadcrumb from './AppBreadcrumb.vue'
import AccountSwitcher from './AccountSwitcher.vue'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

import { PlusCircledIcon } from '@radix-icons/vue'
import { cn } from '@/lib/utils'


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { CaretSortIcon, CheckIcon } from '@radix-icons/vue'

import NewTransactionForm from '../transactions/NewTransactionForm.vue'

import {
  LayoutDashboard,
  Banknote,
  Settings2,
  ChevronRight,
} from 'lucide-vue-next'

import { computed, inject, ref, type Ref } from 'vue'
import { accountsKey, currentAccountKey, exchangeRatesLastUpdatedKey, updateAccountCurrencyKey } from '@/utils/injectionKeys'
import type { Account } from '@/utils/indexedDBQueries'

const route = useRoute()
const currentRoute = computed(() => route.path)

const navigationItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Transactions',
    path: '/transactions',
    icon: Banknote,
    children: [
      {
        name: 'New Transaction',
        path: '/new'
      },
      {
        name: 'All Transactions',
        path: ''
      },
    ]
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings2,
  },
]

const allAccounts = inject(accountsKey) as Ref<Account[]>
const currentAccount = inject(currentAccountKey)
const updateCurrency = inject(updateAccountCurrencyKey)
const currencyRateLastUpdated = inject(exchangeRatesLastUpdatedKey)

const sidebarOpen = ref(true)
const newTransactionModalOpen = ref(false)

const selectCurrencyOpen = ref(false)
const currenciesList = currencies.map(({ code, currency }) => ({
  label: `${code} (${currency})`,
  value: code,
}))

const handleSubmitNewTransaction = () => {
  newTransactionModalOpen.value = false
}

</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AccountSwitcher :accounts="allAccounts" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <template v-for="item in navigationItems" :key="item.name">
              <SidebarMenuItem v-if="!item.children" :class="{
                'bg-slate-100 rounded': currentRoute === item.path,
              }">
                <SidebarMenuButton asChild :tooltip="item.name">
                  <router-link :to="item.path">
                    <component :is="item.icon" class="text-sidebar-foreground/70" />
                    <span>{{ item.name }}</span>
                  </router-link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible v-else as-child :default-open="true" class="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger as-child>
                    <SidebarMenuButton :tooltip="item.name">
                      <component :is="item.icon" />
                      <span>{{ item.name }}</span>
                      <ChevronRight
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem v-for="subItem in item.children" :key="subItem.name">
                        <SidebarMenuSubButton as-child :class="{
                          'bg-slate-100 rounded': currentRoute === `${item.path}${subItem.path}`,
                        }">
                          <router-link :to="`${item.path}${subItem.path}`">
                            <span>{{ subItem.name }}</span>
                          </router-link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </template>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>

    <SidebarInset :class="{
      'max-w-[1180px]': sidebarOpen
    }">
      <header
        class="px-3 flex flex-row justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 top-0 sticky bg-white border-b-[1px] z-[50]">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" @open-changed="(value) => sidebarOpen = value" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <AppBreadcrumb />
        </div>

        <div class="flex flex-row gap-2 items-center">
          <span class="text-xs text-muted-foreground">Last updated:&nbsp;{{ currencyRateLastUpdated }}</span>

          <Popover v-model:open="selectCurrencyOpen">
            <PopoverTrigger as-child>
              <Button variant="outline" role="combobox" :aria-expanded="selectCurrencyOpen"
                class="w-[250px] justify-between">
                {{ currentAccount?.currency
                  ? currenciesList.find((currency) => currency.value === currentAccount?.currency)?.label
                  : "Select currency..." }}
                <CaretSortIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[250px] p-0">
              <Command>
                <CommandInput class="h-9" placeholder="Search currency..." />
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem v-for="currency in currenciesList" :key="currency.value" :value="currency.value"
                      @select="(ev) => {
                        if (typeof ev.detail.value === 'string') {
                          updateCurrency?.(ev.detail.value)
                        }
                        selectCurrencyOpen = false
                      }">
                      {{ currency.label }}
                      <CheckIcon :class="cn(
                        'ml-auto h-4 w-4',
                        currentAccount?.currency === currency.value ? 'opacity-100' : 'opacity-0',
                      )" />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <Dialog :open="newTransactionModalOpen" @update:open="newTransactionModalOpen = $event">
            <DialogTrigger as-child>
              <Button variant="outline" @click="newTransactionModalOpen = true">
                <PlusCircledIcon class="mr-1 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent class="">
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Add new Transaction to your account
                </DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <NewTransactionForm @submitted="handleSubmitNewTransaction" />
              </div>
            </DialogContent>
          </Dialog>
        </div>


      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
