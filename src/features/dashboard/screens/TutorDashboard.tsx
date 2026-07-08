import { Link } from "@tanstack/react-router"
import { Baby, BookOpenCheck, MapPin, School, UsersRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useGetNinosQuery } from "@/src/features/children"

import {
  ChildrenPreview,
  DashboardStatCard,
  DashboardWelcome,
  QuickActions,
  StatActionButton,
} from "../components"

export function TutorDashboard() {
  const {
    data: ninosData,
    isLoading,
    isError,
    refetch,
  } = useGetNinosQuery({ page: 1, includeInactive: false })
  const ninos = ninosData?.results ?? []

  return (
    <section className="space-y-6">
      <DashboardWelcome
        title="Tu familia, siempre cerca"
        description="Organiza la información de tus niños y sus centros educativos desde un solo lugar."
        icon={UsersRound}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Niños registrados"
          description="Total real registrado en tu cuenta."
          icon={Baby}
          value={ninosData?.count ?? 0}
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Gestión familiar"
          description="Administra los perfiles de tus niños desde un solo lugar."
          icon={BookOpenCheck}
          action={
            <StatActionButton render={<Link to="/children" />}>
              Ver Mis Niños
            </StatActionButton>
          }
        />
        <DashboardStatCard
          title="Centros educativos"
          description="Vincula tus niños con un centro educativo."
          icon={School}
          action={
            <StatActionButton render={<Link to="/children" />}>
              Gestionar vínculos
            </StatActionButton>
          }
        />
        <DashboardStatCard
          title="Zonas seguras"
          description="Perímetros de vigilancia geográfica familiar."
          icon={MapPin}
          action={
            <StatActionButton render={<Link to="/zones" />}>
              Ver Mis Zonas
            </StatActionButton>
          }
        />
      </div>

      <ChildrenPreview
        title="Tus niños"
        description="Vista previa de los primeros registros disponibles."
        childrenList={ninos}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="Aún no tienes niños registrados"
        emptyDescription="Registra tu primer niño para comenzar a configurar su información y vinculación con centros educativos."
        errorMessage="No pudimos cargar la información de tus niños."
        actionLabel="Ver todos"
        actionTo="/children"
        onRetry={() => void refetch()}
        showCenter
        emptyAction={
          <Button render={<Link to="/children" />}>
            Registrar niño
          </Button>
        }
      />

      <QuickActions
        title="Accesos rápidos"
        actions={[
          {
            label: "Ver Mis Niños",
            description: "Consulta y administra los perfiles registrados.",
            to: "/children",
            icon: Baby,
          },
          {
            label: "Mis Zonas Seguras",
            description: "Configura áreas geográficas y horarios de vigilancia.",
            to: "/zones",
            icon: MapPin,
          },
          {
            label: "Registrar Niño",
            description: "Accede al flujo existente de registro.",
            to: "/children",
            icon: BookOpenCheck,
          },
          {
            label: "Gestionar Centro Educativo",
            description: "Vincula o cambia el centro educativo de tus niños.",
            to: "/children",
            icon: School,
          },
        ]}
      />
    </section>
  )
}
