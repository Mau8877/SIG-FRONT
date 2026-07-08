import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ninoSchema, type NinoFormValues } from "../schemas"
import type { NinoPayload } from "../types"
import { ChildPhotoPicker } from "./ChildPhotoPicker"

type NinoFormProps = {
  initialValues?: NinoFormValues
  currentPhotoUrl?: string | null
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: NinoPayload) => Promise<void>
  onCancel: () => void
  onRemovePhoto?: () => void
}

const emptyValues: NinoFormValues = {
  nombre: "",
  fecha_nacimiento: "",
}

export function NinoForm({
  initialValues,
  currentPhotoUrl,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
  onRemovePhoto,
}: NinoFormProps) {
  const [values, setValues] = useState<NinoFormValues>(initialValues ?? emptyValues)
  const [errors, setErrors] = useState<Partial<Record<keyof NinoFormValues, string>>>({})
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrors({})

    const parsed = ninoSchema.safeParse(values)

    if (!parsed.success) {
      setErrors(
        parsed.error.issues.reduce<Partial<Record<keyof NinoFormValues, string>>>(
          (formErrors, issue) => {
            const key = issue.path[0] as keyof NinoFormValues
            formErrors[key] = issue.message
            return formErrors
          },
          {},
        ),
      )
      return
    }

    await onSubmit({
      nombre: parsed.data.nombre,
      fecha_nacimiento: parsed.data.fecha_nacimiento,
      foto: photoFile,
    })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <FormInput
        id="nombre"
        label="Nombre"
        value={values.nombre}
        error={errors.nombre}
        onChange={(value) => setValues((current) => ({ ...current, nombre: value }))}
      />
      <FormInput
        id="fecha_nacimiento"
        label="Fecha de nacimiento"
        type="date"
        value={values.fecha_nacimiento}
        error={errors.fecha_nacimiento}
        onChange={(value) =>
          setValues((current) => ({ ...current, fecha_nacimiento: value }))
        }
      />
      <ChildPhotoPicker
        childName={values.nombre}
        currentPhotoUrl={currentPhotoUrl}
        selectedFile={photoFile}
        onFileChange={setPhotoFile}
        onRemoveCurrentPhoto={currentPhotoUrl ? onRemovePhoto : undefined}
      />
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

function FormInput({
  id,
  label,
  type = "text",
  value,
  error,
  onChange,
}: {
  id: keyof NinoFormValues
  label: string
  type?: string
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
