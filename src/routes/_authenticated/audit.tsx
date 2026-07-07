/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { GeneralAuditScreen } from "@/src/features/audit"

export const Route = createFileRoute("/_authenticated/audit")({
  component: AuditRoute,
})

function AuditRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.SUPER_ADMIN]}>
      <GeneralAuditScreen />
    </RoleGuard>
  )
}
