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

import { getNinoId, useRemoveNinoCenterMutation } from "../api/childrenApi"
import type { Nino } from "../types"

type RemoveCenterDialogProps = {
  nino: Nino | null
  error: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onError: (message: string | null) => void
  onSuccess: (message: string) => void
}

export function RemoveCenterDialog({
  nino,
  error,
  open,
  onOpenChange,
  onError,
  onSuccess,
}: RemoveCenterDialogProps) {
  const [removeNinoCenter, removeState] = useRemoveNinoCenterMutation()

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
      await removeNinoCenter(getNinoId(nino)).unwrap()
      closeDialog()
      onSuccess("Centro educativo desvinculado correctamente.")
    } catch (removeError) {
      onError(
        getApiErrorMessage(
          removeError,
          "No se pudo desvincular el centro educativo.",
        ),
      )
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => !nextOpen && closeDialog()}>
      {nino ? (
        <AlertDialogContent onClose={closeDialog}>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitar centro educativo?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseas quitar la vinculacion de {nino.nombre}
              {nino.centro ? ` con ${nino.centro.nombre}` : ""}?
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
              {removeState.isLoading ? "Procesando..." : "Quitar centro"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      ) : null}
    </AlertDialog>
  )
}
