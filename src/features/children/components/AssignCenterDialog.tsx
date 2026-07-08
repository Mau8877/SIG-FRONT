import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PaginationControls } from "@/src/components/Pagination"
import { getApiErrorMessage } from "@/src/lib/apiError"

import {
  getNinoId,
  useAssignNinoCenterMutation,
  useGetCentersQuery,
} from "../api/childrenApi"
import { assignCenterSchema } from "../schemas"
import type { CentroEducativoSelection, Nino } from "../types"

type AssignCenterDialogProps = {
  nino: Nino | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (message: string) => void
}

export function AssignCenterDialog({
  nino,
  open,
  onOpenChange,
  onSuccess,
}: AssignCenterDialogProps) {
  const [page, setPage] = useState(1)
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { data, isLoading, isError, refetch } = useGetCentersQuery(
    { page },
    { skip: !open },
  )
  const [assignNinoCenter, assignState] = useAssignNinoCenterMutation()

  const currentCenterId = nino?.centro?.id_centro
  const centers = data?.results ?? []
  const parsedSelection = assignCenterSchema.safeParse({
    centro_id: selectedCenterId,
  })
  const isSameCenter = Boolean(
    selectedCenterId && currentCenterId && selectedCenterId === currentCenterId,
  )
  const canSubmit = Boolean(nino && parsedSelection.success && !isSameCenter)

  function closeDialog() {
    onOpenChange(false)
    setSelectedCenterId(null)
    setError(null)
    setPage(1)
  }

  async function handleSubmit() {
    if (!nino || !parsedSelection.success) {
      setError("Selecciona un centro educativo.")
      return
    }

    if (isSameCenter) {
      return
    }

    setError(null)

    try {
      await assignNinoCenter({
        id: getNinoId(nino),
        body: parsedSelection.data,
      }).unwrap()
      closeDialog()
      onSuccess(
        currentCenterId
          ? "Centro educativo actualizado correctamente."
          : "Centro educativo vinculado correctamente.",
      )
    } catch (assignError) {
      setError(
        getApiErrorMessage(
          assignError,
          currentCenterId
            ? "No se pudo actualizar el centro educativo."
            : "No se pudo vincular el centro educativo.",
        ),
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeDialog()}>
      {nino ? (
        <DialogContent onClose={closeDialog}>
          <DialogHeader>
            <DialogTitle>
              {currentCenterId ? "Cambiar centro" : "Vincular a centro"}
            </DialogTitle>
            <DialogDescription>
              Selecciona el centro educativo para {nino.nombre}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {nino.centro ? (
              <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
                <p className="text-muted-foreground">Centro actual</p>
                <p className="font-medium text-foreground">{nino.centro.nombre}</p>
              </div>
            ) : null}

            {isLoading ? (
              <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                Cargando centros educativos...
              </p>
            ) : null}

            {isError ? (
              <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-3 text-sm text-destructive">
                <p>No se pudieron cargar los centros.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                  Reintentar
                </Button>
              </div>
            ) : null}

            {!isLoading && !isError && centers.length === 0 ? (
              <p className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
                No hay centros educativos disponibles.
              </p>
            ) : null}

            <div className="space-y-2">
              {centers.map((center) => (
                <CenterOption
                  key={center.id_centro}
                  center={center}
                  selected={selectedCenterId === center.id_centro}
                  current={currentCenterId === center.id_centro}
                  onSelect={() => setSelectedCenterId(center.id_centro)}
                />
              ))}
            </div>

            {!isLoading && !isError && data ? (
              <PaginationControls
                currentPage={page}
                count={data.count}
                hasNext={Boolean(data.next)}
                hasPrevious={Boolean(data.previous)}
                onPrevious={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                onNext={() => setPage((currentPage) => currentPage + 1)}
              />
            ) : null}

            {isSameCenter ? (
              <p className="text-sm text-muted-foreground">
                Selecciona un centro diferente para confirmar el cambio.
              </p>
            ) : null}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit || assignState.isLoading}
            >
              {assignState.isLoading ? "Guardando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}

function CenterOption({
  center,
  selected,
  current,
  onSelect,
}: {
  center: CentroEducativoSelection
  selected: boolean
  current: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition-colors ${
        selected
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:bg-muted"
      }`}
      onClick={onSelect}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block break-words font-medium text-foreground">
            {center.nombre}
          </span>
          <span className="mt-1 block break-words text-muted-foreground">
            {center.direccion}
          </span>
        </span>
        {current ? (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            Actual
          </span>
        ) : null}
      </span>
    </button>
  )
}
