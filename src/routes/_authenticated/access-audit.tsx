/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { AccessAuditScreen } from "@/src/features/audit"

export const Route = createFileRoute("/_authenticated/access-audit")({
  component: AccessAuditRoute,
})

function AccessAuditRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
      <AccessAuditScreen />
    </RoleGuard>
  )
}
