/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { AlertsScreen } from "@/src/features/alerts"

export const Route = createFileRoute("/_authenticated/alerts")({
  component: AlertsRoute,
})

function AlertsRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.TUTOR]}>
      <AlertsScreen />
    </RoleGuard>
  )
}
