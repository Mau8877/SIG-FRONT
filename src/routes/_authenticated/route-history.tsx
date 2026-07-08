/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { RouteHistoryScreen } from "@/src/features/route-history"

export const Route = createFileRoute("/_authenticated/route-history")({
  component: RouteHistoryRoute,
})

function RouteHistoryRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.TUTOR]}>
      <RouteHistoryScreen />
    </RoleGuard>
  )
}
