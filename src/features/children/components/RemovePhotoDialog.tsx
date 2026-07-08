import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getApiErrorMessage } from "@/src/lib/apiError"

import { getNinoId, useRemoveNinoPhotoMutation } from "../api/childrenApi"
import type { Nino } from "../types"

type RemovePhotoDialogProps = {
  nino: Nino | null
  error: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onError: (message: string | null) => void
  onSuccess: (nino: Nino, message: string) => void
}

export function RemovePhotoDialog({
  nino,
  error,
  open,
  onOpenChange,
  onError,
  onSuccess,
}: RemovePhotoDialogProps) {
  const [removeNinoPhoto, removeState] = useRemoveNinoPhotoMutation()

  function closeDialog() {
    onOpenChange(false)
    onError(null)
  }

  async function handleRemove() {
    if (!nino) {
      return
    }

    onError(null)

    try {
      await removeNinoPhoto(getNinoId(nino)).unwrap()
      closeDialog()
      onSuccess(nino, "Foto eliminada correctamente.")
    } catch (removeError) {
      onError(
        getApiErrorMessage(removeError, "No se pudo eliminar la fotografia."),
      )
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeDialog()}>
      {nino ? (
        <AlertDialogContent onClose={closeDialog}>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitar foto?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseas quitar la foto de {nino.nombre}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <AlertDialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleRemove()}
              disabled={removeState.isLoading}
            >
              {removeState.isLoading ? "Procesando..." : "Quitar foto"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  )
}
