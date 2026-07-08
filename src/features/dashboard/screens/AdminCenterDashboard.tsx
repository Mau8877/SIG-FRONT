import { Link } from "@tanstack/react-router"
import { ClipboardList, School, UsersRound } from "lucide-react"

import { useGetInstitutionChildrenQuery } from "@/src/features/children"

import {
  ChildrenPreview,
  DashboardStatCard,
  DashboardWelcome,
  QuickActions,
  StatActionButton,
} from "../components"

export function AdminCenterDashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetInstitutionChildrenQuery({ page: 1 })
  const ninos = data?.results ?? []

  return (
    <section className="space-y-6">
      <DashboardWelcome
        title="Gestión del Centro Educativo"
        description="Consulta los niños vinculados y mantén organizada la información institucional desde Miraki."
        icon={School}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <DashboardStatCard
          title="Niños vinculados"
          description="Niños activos actualmente asociados al centro."
          icon={UsersRound}
          value={data?.count ?? 0}
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Listado institucional"
          description="Consulta la información de los niños vinculados."
          icon={ClipboardList}
          action={
            <StatActionButton render={<Link to="/center-children" />}>
              Ver niños
            </StatActionButton>
          }
        />
      </div>

      <ChildrenPreview
        title="Niños del Centro"
        description="Vista previa de los niños vinculados en la primera página."
        childrenList={ninos}
        isLoading={isLoading}
        isError={isError}
        emptyTitle="Aún no hay niños vinculados"
        emptyDescription="Los niños vinculados por sus Tutores aparecerán aquí."
        errorMessage="No pudimos cargar los niños vinculados al centro."
        actionLabel="Ver lista completa"
        actionTo="/center-children"
        onRetry={() => void refetch()}
      />

      <QuickActions
        title="Acceso institucional"
        actions={[
          {
            label: "Niños del Centro",
            description: "Consulta la lista completa en modo solo lectura.",
            to: "/center-children",
            icon: ClipboardList,
          },
        ]}
      />
    </section>
  )
}
