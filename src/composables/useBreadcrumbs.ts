import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default function useBreadcrumb() {
  const route = useRoute()

  const breadcrumbs = computed(() => {
    const matchedRoutes = route.matched
    return matchedRoutes.map((routeRecord) => ({
      text: routeRecord.meta.breadcrumb,
      path: routeRecord.path,
    }))
  })

  return { breadcrumbs }
}
