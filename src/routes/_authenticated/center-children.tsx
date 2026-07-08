/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { CenterChildrenScreen } from "@/src/features/children"

export const Route = createFileRoute("/_authenticated/center-children")({
  component: CenterChildrenRoute,
})

function CenterChildrenRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN_CENTRO]}>
      <CenterChildrenScreen />
    </RoleGuard>
  )
}
