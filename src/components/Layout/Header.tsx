import { useState } from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLogoutMutation } from "@/src/features/auth"
import { authSessionCleared, selectAuthUser } from "@/src/features/auth"
import { getApiErrorMessage } from "@/src/lib/apiError"
import { useAppDispatch, useAppSelector } from "@/src/store/hooks"

import { MobileSidebar } from "./MobileSidebar"

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logout, { isLoading }] = useLogoutMutation()
  const [error, setError] = useState<string | null>(null)
  const user = useAppSelector(selectAuthUser)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  async function handleLogout() {
    setError(null)

    try {
      await logout().unwrap()
    } catch (logoutError) {
      setError(getApiErrorMessage(logoutError, "No se pudo cerrar la sesion en el servidor."))
    } finally {
      dispatch(authSessionCleared())
      void navigate({ to: "/login", replace: true })
    }
  }

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />
        <div>
          <p className="text-sm font-semibold">Panel Miraki</p>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3">
        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-sm font-medium">{user?.correo}</p>
          <p className="text-xs text-muted-foreground">{user?.rol}</p>
        </div>
        {user?.rol ? <Badge variant="outline">{user.rol}</Badge> : null}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="size-4" />
          {isLoading ? "Saliendo..." : "Salir"}
        </Button>
      </div>
    </header>
  )
}
