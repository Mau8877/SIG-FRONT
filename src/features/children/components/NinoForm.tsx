import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ninoSchema, type NinoFormValues } from "../schemas"
import type { NinoPayload } from "../types"

type NinoFormProps = {
  initialValues?: NinoFormValues
  submitLabel: string
  isSubmitting: boolean
  onSubmit: (values: NinoPayload) => Promise<void>
  onCancel: () => void
}

const emptyValues: NinoFormValues = {
  nombre: "",
  fecha_nacimiento: "",
  foto_url: "",
}

export function NinoForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
  onCancel,
}: NinoFormProps) {
  const [values, setValues] = useState<NinoFormValues>(initialValues ?? emptyValues)
  const [errors, setErrors] = useState<Partial<Record<keyof NinoFormValues, string>>>({})

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
      foto_url: parsed.data.foto_url || "",
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
      <FormInput
        id="foto_url"
        label="URL de foto opcional"
        value={values.foto_url ?? ""}
        error={errors.foto_url}
        onChange={(value) => setValues((current) => ({ ...current, foto_url: value }))}
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
