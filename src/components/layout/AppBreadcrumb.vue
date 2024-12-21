<script lang="ts">
import { defineComponent } from 'vue'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import useBreadcrumbs from '@/composables/useBreadcrumbs';

export default defineComponent({
  name: 'AppBreadcrumb',
  components: {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
  },

  setup() {
    const { breadcrumbs } = useBreadcrumbs()
    return { breadcrumbs }
  },
})
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <BreadcrumbItem class="xs:block">
          <BreadcrumbLink :href="index !== breadcrumbs.length - 1 ? crumb.path : ''">
            {{ crumb.text }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator class="xs:block" v-if="index !== breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>
