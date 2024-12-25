<script setup lang=ts>
import { useRoute } from 'vue-router'

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import NewTransactionForm from '../transactions/NewTransactionForm.vue'

import {
  LayoutDashboard,
  Banknote,
  Settings2,
  ChevronRight,
} from 'lucide-vue-next'

import type { Account } from '@/types/Account'
import { computed, ref } from 'vue'

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

const accounts: Account[] = [
  {
    id: 0,
    name: 'Acme Inc',
    type: 'locked',
  },
  {
    id: 1,
    name: 'Acme Corp.',
    type: 'open',
  },
  {
    id: 2,
    name: 'Evil Corp.',
    type: 'locked',
  },
]

const sidebarOpen = ref(true)
const newTransactionModalOpen = ref(false)

const handleSubmitNewTransaction = () => {
  newTransactionModalOpen.value = false
}

</script>

<template>
  <SidebarProvider>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <AccountSwitcher :accounts="accounts" />
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


      </header>
      <div class="flex flex-1 flex-col gap-4 p-4">
        <slot />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
