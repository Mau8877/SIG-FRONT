import { Link } from "@tanstack/react-router"
import { Baby, ClipboardList, LogIn, MapPin } from "lucide-react"

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
import { useGetNinosQuery } from "@/src/features/children"
import { useGetZonasQuery } from "@/src/features/zones"
import { useAppSelector } from "@/src/store/hooks"

export function DashboardScreen() {
  const user = useAppSelector(selectAuthUser)

  if (user?.rol === USER_ROLES.TUTOR) {
    return <TutorDashboard correo={user.correo} />
  }

  if (user?.rol === USER_ROLES.ADMIN_CENTRO) {
    return <AdminCentroDashboard correo={user.correo} />
  }

  return <SuperAdminDashboard correo={user?.correo ?? ""} />
}

function TutorDashboard({ correo }: { correo: string }) {
  const { data: ninosData, isLoading: isLoadingNinos } = useGetNinosQuery({ page: 1, includeInactive: false })
  const { data: zonasData, isLoading: isLoadingZonas } = useGetZonasQuery({ page: 1, includeInactive: false })
  const totalNinos = ninosData?.count ?? 0
  const totalZonas = zonasData?.count ?? 0

  return (
    <DashboardShell title="Dashboard Tutor" description={`Bienvenido, ${correo}.`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mis Ninos</CardTitle>
            <CardDescription>Administra los ninos registrados a tu cargo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-semibold">{isLoadingNinos ? "..." : totalNinos}</p>
              <p className="text-sm text-muted-foreground">Registros visibles</p>
            </div>
            <Button render={<Link to="/children" />}>
              <Baby className="size-4" />
              Ir a Mis Ninos
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Zonas Seguras</CardTitle>
            <CardDescription>Gestiona las areas seguras personalizadas para el monitoreo.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-3xl font-semibold">{isLoadingZonas ? "..." : totalZonas}</p>
              <p className="text-sm text-muted-foreground">Zonas activas</p>
            </div>
            <Button render={<Link to="/zones" />}>
              <MapPin className="size-4" />
              Ir a Zonas Seguras
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

function AdminCentroDashboard({ correo }: { correo: string }) {
  return (
    <DashboardShell title="Dashboard AdminCentro" description={`Bienvenido, ${correo}.`}>
      <Card>
        <CardHeader>
          <CardTitle>Panel institucional</CardTitle>
          <CardDescription>
            Tu sesion esta activa. Los modulos institucionales se agregaran cuando el
            backend exponga esos casos de uso.
          </CardDescription>
        </CardHeader>
      </Card>
    </DashboardShell>
  )
}

function SuperAdminDashboard({ correo }: { correo: string }) {
  return (
    <DashboardShell title="Dashboard SuperAdmin" description={`Bienvenido, ${correo}.`}>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bitacora General</CardTitle>
            <CardDescription>Consulta operaciones registradas por el sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button render={<Link to="/audit" />}>
              <ClipboardList className="size-4" />
              Ver bitacora
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bitacora de Accesos</CardTitle>
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
