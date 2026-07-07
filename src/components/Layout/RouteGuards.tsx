import { Navigate } from "@tanstack/react-router"

import { hasRole } from "@/src/config/permissions"
import type { UserRole } from "@/src/config/roles"
import { useAppSelector } from "@/src/store/hooks"
import { selectAuthRole, selectAuthStatus } from "@/src/features/auth"

import { FullPageLoading } from "./FullPageLoading"

type AuthGuardProps = {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const status = useAppSelector(selectAuthStatus)

  if (status === "initializing") {
    return <FullPageLoading label="Restaurando sesion..." />
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

type PublicOnlyGuardProps = {
  children: React.ReactNode
}

export function PublicOnlyGuard({ children }: PublicOnlyGuardProps) {
  const status = useAppSelector(selectAuthStatus)

  if (status === "initializing") {
    return <FullPageLoading label="Verificando sesion..." />
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const role = useAppSelector(selectAuthRole)

  if (!hasRole(role, allowedRoles)) {
    return <Navigate to="/forbidden" replace />
  }

  return <>{children}</>
}
