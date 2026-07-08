/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"

import { RoleGuard } from "@/src/components/Layout"
import { USER_ROLES } from "@/src/config/roles"
import { CenterMapScreen } from "@/src/features/centers"

export const Route = createFileRoute("/_authenticated/center-map")({
  component: CenterMapRoute,
})

function CenterMapRoute() {
  return (
    <RoleGuard allowedRoles={[USER_ROLES.ADMIN_CENTRO]}>
      <CenterMapScreen />
    </RoleGuard>
  )
}
