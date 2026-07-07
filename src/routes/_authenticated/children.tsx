/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { ChildrenScreen } from "@/src/features/children"

export const Route = createFileRoute("/_authenticated/children")({
  component: ChildrenRoute,
})

function ChildrenRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.TUTOR]}>
      <ChildrenScreen />
    </RoleGuard>
  )
}
