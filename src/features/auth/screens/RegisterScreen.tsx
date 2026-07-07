import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRegisterMutation } from "@/src/features/auth"
import { getApiErrorMessage } from "@/src/lib/apiError"

import {
  registerSchema,
  registerStepOneSchema,
  type RegisterFormValues,
} from "../schemas"

type RegisterFieldApi = {
  state: { value: unknown }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type RegisterFormApi = {
  Field: React.ComponentType<{
    name: keyof RegisterFormValues
    children: (field: RegisterFieldApi) => React.ReactNode
  }>
}

const defaultValues: RegisterFormValues = {
  correo: "",
  password: "",
  confirmar_password: "",
  tipo_cuenta: "tutor",
  nombre: "",
  telefono: "",
  centro_nombre: "",
  centro_direccion: "",
}

export function RegisterScreen() {
  const [step, setStep] = useState(1)
  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<keyof RegisterFormValues, string>>>({})
  const navigate = useNavigate()

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null)
      setSuccess(null)
      setFieldErrors({})

      const parsed = registerSchema.safeParse(value)

      if (!parsed.success) {
        setFieldErrors(flattenIssues(parsed.error.issues))
        return
      }

      try {
        await register(toRegisterRequest(parsed.data)).unwrap()
        setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesion.")
        setTimeout(() => {
          void navigate({ to: "/login" })
        }, 500)
      } catch (registerError) {
        setError(getApiErrorMessage(registerError, "No se pudo registrar la cuenta."))
      }
    },
  })

  function goToStepTwo() {
    setError(null)
    setFieldErrors({})

    const parsed = registerStepOneSchema.safeParse(form.state.values)

    if (!parsed.success) {
      setFieldErrors(flattenIssues(parsed.error.issues))
      return
    }

    setStep(2)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Paso {step} de 2 para registrar tu cuenta Miraki.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              void form.handleSubmit()
            }}
          >
            {step === 1 ? (
              <div className="space-y-4">
                <TextField form={form} name="correo" label="Correo" type="email" error={fieldErrors.correo} />
                <TextField form={form} name="password" label="Contrasena" type="password" error={fieldErrors.password} />
                <TextField
                  form={form}
                  name="confirmar_password"
                  label="Confirmar contrasena"
                  type="password"
                  error={fieldErrors.confirmar_password}
                />
                <Button type="button" className="w-full" size="lg" onClick={goToStepTwo}>
                  Continuar
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <form.Field
                  name="tipo_cuenta"
                  children={(field) => (
                    <div className="space-y-2">
                      <Label>Tipo de cuenta</Label>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {[
                          ["tutor", "Tutor"],
                          ["admin_centro", "AdminCentro"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                              field.state.value === value
                                ? "border-primary bg-primary/10"
                                : "border-border bg-background hover:bg-muted"
                            }`}
                            onClick={() => field.handleChange(value as RegisterFormValues["tipo_cuenta"])}
                          >
                            <span className="font-medium">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                />
                <TextField form={form} name="nombre" label="Nombre" error={fieldErrors.nombre} />
                <TextField form={form} name="telefono" label="Telefono" error={fieldErrors.telefono} />
                {form.state.values.tipo_cuenta === "admin_centro" ? (
                  <>
                    <TextField
                      form={form}
                      name="centro_nombre"
                      label="Nombre del centro"
                      error={fieldErrors.centro_nombre}
                    />
                    <form.Field
                      name="centro_direccion"
                      children={(field) => (
                        <div className="space-y-2">
                          <Label htmlFor="centro_direccion">Direccion escrita del centro</Label>
                          <Textarea
                            id="centro_direccion"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(event) => field.handleChange(event.target.value)}
                            aria-invalid={Boolean(fieldErrors.centro_direccion)}
                          />
                          {fieldErrors.centro_direccion ? (
                            <p className="text-sm text-destructive">{fieldErrors.centro_direccion}</p>
                          ) : null}
                        </div>
                      )}
                    />
                  </>
                ) : null}
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
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Volver
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Registrando..." : "Crear cuenta"}
                  </Button>
                </div>
              </div>
            )}
            <p className="text-center text-sm text-muted-foreground">
              Ya tienes cuenta?{" "}
              <Link to="/login" className="font-medium text-foreground underline">
                Inicia sesion
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function TextField({
  form,
  name,
  label,
  type = "text",
  error,
}: {
  form: RegisterFormApi
  name: keyof RegisterFormValues
  label: string
  type?: string
  error?: string
}) {
  return (
    <form.Field
      name={name}
      children={(field: RegisterFieldApi) => (
        <div className="space-y-2">
          <Label htmlFor={name}>{label}</Label>
          <Input
            id={name}
            type={type}
            value={String(field.state.value ?? "")}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            aria-invalid={Boolean(error)}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
      )}
    />
  )
}

function toRegisterRequest(values: RegisterFormValues) {
  if (values.tipo_cuenta === "admin_centro") {
    return {
      correo: values.correo,
      password: values.password,
      confirmar_password: values.confirmar_password,
      tipo_cuenta: values.tipo_cuenta,
      nombre: values.nombre,
      telefono: values.telefono,
      centro: {
        nombre: values.centro_nombre ?? "",
        direccion: values.centro_direccion ?? "",
      },
    }
  }

  return {
    correo: values.correo,
    password: values.password,
    confirmar_password: values.confirmar_password,
    tipo_cuenta: values.tipo_cuenta,
    nombre: values.nombre,
    telefono: values.telefono,
  }
}

function flattenIssues(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.reduce<Partial<Record<keyof RegisterFormValues, string>>>((errors, issue) => {
    const key = issue.path[0] as keyof RegisterFormValues
    errors[key] = issue.message
    return errors
  }, {})
}
