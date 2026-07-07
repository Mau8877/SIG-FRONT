/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { AuthenticatedLayout, AuthGuard } from "@/src/components/Layout"

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedRoute,
})

function AuthenticatedRoute() {
  return (
    <AuthGuard>
      <AuthenticatedLayout />
    </AuthGuard>
  )
}
