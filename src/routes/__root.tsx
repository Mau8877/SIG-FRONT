/* eslint-disable react-refresh/only-export-components */
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { AuthBootstrap } from "@/src/features/auth/components/AuthBootstrap"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <AuthBootstrap />
      <Outlet />
    </>
  )
}
