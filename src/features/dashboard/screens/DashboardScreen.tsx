import { Link } from "@tanstack/react-router"
import { ClipboardList, LogIn } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { USER_ROLES } from "@/src/config/roles"
import { selectAuthUser } from "@/src/features/auth"
import { useAppSelector } from "@/src/store/hooks"

import { AdminCenterDashboard } from "./AdminCenterDashboard"
import { TutorDashboard } from "./TutorDashboard"

export function DashboardScreen() {
  const user = useAppSelector(selectAuthUser)

  if (user?.rol === USER_ROLES.TUTOR) {
    return <TutorDashboard />
  }

  if (user?.rol === USER_ROLES.ADMIN_CENTRO) {
    return <AdminCenterDashboard />
  }

  return <SuperAdminDashboard correo={user?.correo ?? ""} />
}

function SuperAdminDashboard({ correo }: { correo: string }) {
  return (
    <DashboardShell title="Dashboard SuperAdmin" description={`Bienvenido, ${correo}.`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bitácora General</CardTitle>
            <CardDescription>Consulta operaciones registradas por el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link to="/audit" />}>
              <ClipboardList className="size-4" />
              Ver bitácora
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bitácora de Accesos</CardTitle>
            <CardDescription>Revisa eventos de acceso y sesiones.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" render={<Link to="/access-audit" />}>
              <LogIn className="size-4" />
              Ver accesos
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

function DashboardShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}
