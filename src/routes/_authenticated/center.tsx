/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { CenterManagementScreen } from "@/src/features/centers"

export const Route = createFileRoute("/_authenticated/center")({
  component: CenterRoute,
})

function CenterRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN_CENTRO]}>
      <CenterManagementScreen />
    </RoleGuard>
  )
}
