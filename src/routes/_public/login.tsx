/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { LoginScreen } from "@/src/features/auth"
import { PublicOnlyGuard } from "@/src/components/Layout"

export const Route = createFileRoute("/_public/login")({
  component: LoginRoute,
})

function LoginRoute() {
  return (
    <PublicOnlyGuard>
      <LoginScreen />
    </PublicOnlyGuard>
  )
}
