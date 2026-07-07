/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { RegisterScreen } from "@/src/features/auth"
import { PublicOnlyGuard } from "@/src/components/Layout"

export const Route = createFileRoute("/_public/register")({
  component: RegisterRoute,
})

function RegisterRoute() {
  return (
    <PublicOnlyGuard>
      <RegisterScreen />
    </PublicOnlyGuard>
  )
}
