/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { DashboardScreen } from "@/src/features/dashboard"

export const Route = createFileRoute(
  "/_authenticated/dashboard",
)({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <RoleGuard
      allowedRoles={[
        USER_ROLES.TUTOR,
        USER_ROLES.ADMIN_CENTRO,
        USER_ROLES.SUPER_ADMIN,
      ]}
    >
      <DashboardScreen />
    </RoleGuard>
  )
}
