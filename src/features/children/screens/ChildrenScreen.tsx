import { useState } from "react"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PaginationControls } from "@/src/components/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { getApiErrorMessage } from "@/src/lib/apiError"

import {
  getNinoId,
  useCreateNinoMutation,
  useDeactivateNinoMutation,
  useGetNinosQuery,
  useReactivateNinoMutation,
  useUpdateNinoMutation,
} from "../api/childrenApi"
import { AssignCenterDialog } from "../components/AssignCenterDialog"
import { ChildAvatar } from "../components/ChildAvatar"
import { ChildCenterInfo } from "../components/ChildCenterInfo"
import { NinoForm } from "../components/NinoForm"
import { RemoveCenterDialog } from "../components/RemoveCenterDialog"
import { RemovePhotoDialog } from "../components/RemovePhotoDialog"
import type { Nino, NinoPayload } from "../types"

export function ChildrenScreen() {
  const [includeInactive, setIncludeInactive] = useState(false)
  const [page, setPage] = useState(1)
  const [editingNino, setEditingNino] = useState<Nino | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<Nino | null>(null)
  const [assignCenterTarget, setAssignCenterTarget] = useState<Nino | null>(null)
  const [removeCenterTarget, setRemoveCenterTarget] = useState<Nino | null>(null)
  const [removePhotoTarget, setRemovePhotoTarget] = useState<Nino | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [removeCenterError, setRemoveCenterError] = useState<string | null>(null)
  const [removePhotoError, setRemovePhotoError] = useState<string | null>(null)
  const { data, isLoading, isError, refetch } = useGetNinosQuery({
    page,
    includeInactive,
  })
  const [createNino, createState] = useCreateNinoMutation()
  const [updateNino, updateState] = useUpdateNinoMutation()
  const [deactivateNino, deactivateState] = useDeactivateNinoMutation()
  const [reactivateNino, reactivateState] = useReactivateNinoMutation()
  const ninos = data?.results ?? []
  const total = data?.count ?? ninos.length

  async function handleCreate(values: NinoPayload) {
    setError(null)
    setSuccess(null)

    try {
      await createNino(values).unwrap()
      setShowCreate(false)
      setSuccess("Nino registrado correctamente.")
    } catch (createError) {
      setError(
        getApiErrorMessage(
          createError,
          values.foto
            ? "No se pudo guardar la fotografia."
            : "No se pudo registrar el nino.",
        ),
      )
    }
  }

  async function handleUpdate(values: NinoPayload) {
    if (!editingNino) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      await updateNino({ id: getNinoId(editingNino), body: values }).unwrap()
      setEditingNino(null)
      setSuccess(
        values.foto
          ? "Foto actualizada correctamente."
          : "Nino actualizado correctamente.",
      )
    } catch (updateError) {
      setError(
        getApiErrorMessage(
          updateError,
          values.foto
            ? "No se pudo guardar la fotografia."
            : "No se pudo actualizar el nino.",
        ),
      )
    }
  }

  async function handleDeactivate() {
    if (!deactivateTarget) {
      return
    }

    setError(null)
    setSuccess(null)

    try {
      await deactivateNino(getNinoId(deactivateTarget)).unwrap()
      setDeactivateTarget(null)
    } catch (deactivateError) {
      setError(getApiErrorMessage(deactivateError, "No se pudo dar de baja el nino."))
    }
  }

  async function handleReactivate(nino: Nino) {
    setError(null)
    setSuccess(null)

    try {
      await reactivateNino(getNinoId(nino)).unwrap()
    } catch (reactivateError) {
      setError(getApiErrorMessage(reactivateError, "No se pudo reactivar el nino."))
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Mis Ninos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Registra, edita, da de baja o reactiva registros de ninos.
            {!isLoading && !isError ? ` Total: ${total}.` : ""}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Registrar nino</Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <Checkbox
          id="includeInactive"
          checked={includeInactive}
          onChange={(event) => {
            setIncludeInactive(event.target.checked)
            setPage(1)
          }}
        />
        <Label htmlFor="includeInactive">Incluir inactivos</Label>
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success-foreground">
          {success}
        </p>
      ) : null}

      {isLoading ? <ChildrenSkeleton /> : null}

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle>No se pudo cargar la lista</CardTitle>
            <CardDescription>Intenta nuevamente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => void refetch()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && !isError && ninos.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No hay ninos registrados</CardTitle>
            <CardDescription>Registra el primer nino para comenzar.</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {ninos.map((nino) => (
          <NinoCard
            key={getNinoId(nino)}
            nino={nino}
            reactivating={reactivateState.isLoading}
            onEdit={() => setEditingNino(nino)}
            onDeactivate={() => setDeactivateTarget(nino)}
            onReactivate={() => void handleReactivate(nino)}
            onAssignCenter={() => setAssignCenterTarget(nino)}
            onRemoveCenter={() => {
              setRemoveCenterError(null)
              setRemoveCenterTarget(nino)
            }}
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

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent onClose={() => setShowCreate(false)}>
          <DialogHeader>
            <DialogTitle>Registrar nino</DialogTitle>
            <DialogDescription>Completa los datos editables permitidos.</DialogDescription>
          </DialogHeader>
          <NinoForm
            submitLabel="Registrar"
            isSubmitting={createState.isLoading}
            onCancel={() => setShowCreate(false)}
            onSubmit={handleCreate}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingNino)} onOpenChange={(open) => !open && setEditingNino(null)}>
        {editingNino ? (
          <DialogContent onClose={() => setEditingNino(null)}>
            <DialogHeader>
              <DialogTitle>Editar nino</DialogTitle>
              <DialogDescription>Solo se enviaran campos editables.</DialogDescription>
            </DialogHeader>
            <NinoForm
              initialValues={{
                nombre: editingNino.nombre,
                fecha_nacimiento: editingNino.fecha_nacimiento ?? "",
              }}
              currentPhotoUrl={editingNino.foto_url}
              submitLabel="Guardar cambios"
              isSubmitting={updateState.isLoading}
              onCancel={() => setEditingNino(null)}
              onSubmit={handleUpdate}
              onRemovePhoto={() => {
                setRemovePhotoError(null)
                setRemovePhotoTarget(editingNino)
              }}
            />
          </DialogContent>
        ) : null}
      </Dialog>

      <AlertDialog
        open={Boolean(deactivateTarget)}
        onOpenChange={(open) => !open && setDeactivateTarget(null)}
      >
        {deactivateTarget ? (
          <AlertDialogContent onClose={() => setDeactivateTarget(null)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Dar de baja a {deactivateTarget.nombre}?</AlertDialogTitle>
              <AlertDialogDescription>
                La baja no elimina permanentemente el registro.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setDeactivateTarget(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => void handleDeactivate()}
                disabled={deactivateState.isLoading}
              >
                {deactivateState.isLoading ? "Procesando..." : "Dar de baja"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        ) : null}
      </AlertDialog>

      <AssignCenterDialog
        nino={assignCenterTarget}
        open={Boolean(assignCenterTarget)}
        onOpenChange={(open) => !open && setAssignCenterTarget(null)}
        onSuccess={(message) => {
          setError(null)
          setSuccess(message)
        }}
      />

      <RemoveCenterDialog
        nino={removeCenterTarget}
        error={removeCenterError}
        open={Boolean(removeCenterTarget)}
        onOpenChange={(open) => !open && setRemoveCenterTarget(null)}
        onError={setRemoveCenterError}
        onSuccess={(message) => {
          setError(null)
          setSuccess(message)
        }}
      />

      <RemovePhotoDialog
        nino={removePhotoTarget}
        error={removePhotoError}
        open={Boolean(removePhotoTarget)}
        onOpenChange={(open) => !open && setRemovePhotoTarget(null)}
        onError={setRemovePhotoError}
        onSuccess={(nino, message) => {
          setError(null)
          setSuccess(message)
          setEditingNino((current) =>
            current && getNinoId(current) === getNinoId(nino)
              ? { ...current, foto_url: null }
              : current,
          )
        }}
      />
    </section>
  )
}

function NinoCard({
  nino,
  reactivating,
  onEdit,
  onDeactivate,
  onReactivate,
  onAssignCenter,
  onRemoveCenter,
}: {
  nino: Nino
  reactivating: boolean
  onEdit: () => void
  onDeactivate: () => void
  onReactivate: () => void
  onAssignCenter: () => void
  onRemoveCenter: () => void
}) {
  const active = nino.activo ?? true

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <ChildAvatar name={nino.nombre} photoUrl={nino.foto_url} />
            <div className="min-w-0">
              <CardTitle className="break-words">{nino.nombre}</CardTitle>
              <CardDescription>
                Nacimiento: {nino.fecha_nacimiento ?? "Sin fecha registrada"}
              </CardDescription>
            </div>
          </div>
          <Badge variant={active ? "default" : "outline"}>
            {active ? "Activo" : "Inactivo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChildCenterInfo nino={nino} />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onEdit}>
            Editar
          </Button>
          {nino.centro ? (
            <>
              <Button variant="secondary" onClick={onAssignCenter}>
                Cambiar centro
              </Button>
              <Button variant="outline" onClick={onRemoveCenter}>
                Quitar centro
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={onAssignCenter}>
              Vincular a centro
            </Button>
          )}
          {active ? (
            <Button variant="destructive" onClick={onDeactivate}>
              Dar de baja
            </Button>
          ) : (
            <Button variant="secondary" onClick={onReactivate} disabled={reactivating}>
              {reactivating ? "Reactivando..." : "Reactivar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ChildrenSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <Card key={item}>
          <CardHeader>
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
