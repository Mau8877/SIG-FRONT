import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ChildAvatar } from "./ChildAvatar"

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"]

type ChildPhotoPickerProps = {
  childName: string
  currentPhotoUrl?: string | null
  selectedFile: File | null
  onFileChange: (file: File | null) => void
  onRemoveCurrentPhoto?: () => void
}

export function ChildPhotoPicker({
  childName,
  currentPhotoUrl,
  selectedFile,
  onFileChange,
  onRemoveCurrentPhoto,
}: ChildPhotoPickerProps) {
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previewUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
    [selectedFile],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null

    if (!file) {
      onFileChange(null)
      setError(null)
      return
    }

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      resetFileInput()
      setError("La foto debe ser JPG, PNG o WEBP.")
      onFileChange(null)
      return
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      resetFileInput()
      setError("La foto no puede superar 5 MB.")
      onFileChange(null)
      return
    }

    setError(null)
    onFileChange(file)
  }

  function removeSelection() {
    resetFileInput()
    setError(null)
    onFileChange(null)
  }

  function resetFileInput() {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const displayedPhotoUrl = previewUrl ?? currentPhotoUrl
  const actionLabel = currentPhotoUrl ? "Cambiar foto" : "Agregar foto"

  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ChildAvatar
          name={childName}
          photoUrl={displayedPhotoUrl}
          className="size-20 rounded-xl"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <Label htmlFor="foto">{actionLabel}</Label>
            <p className="mt-1 text-xs text-muted-foreground">
              Formatos permitidos: JPG, PNG o WEBP. Maximo 5 MB.
            </p>
          </div>
          <Input
            ref={inputRef}
            id="foto"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            aria-invalid={Boolean(error)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedFile ? (
          <Button type="button" variant="outline" size="sm" onClick={removeSelection}>
            Quitar seleccion
          </Button>
        ) : null}
        {currentPhotoUrl && onRemoveCurrentPhoto ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemoveCurrentPhoto}
          >
            Quitar foto
          </Button>
        ) : null}
      </div>

      {selectedFile ? (
        <p className="text-xs text-muted-foreground">
          Nueva foto seleccionada: {selectedFile.name}
        </p>
      ) : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
