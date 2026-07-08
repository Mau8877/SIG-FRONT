import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useRegisterMutation } from "@/src/features/auth"
import { getApiErrorMessage } from "@/src/lib/apiError"

import { registerSchema, type RegisterFormValues } from "../schemas"

type AccountType = RegisterFormValues["tipo_cuenta"]

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
  setFieldValue: (field: keyof RegisterFormValues, value: string) => void
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

const accountOptions: Array<{
  value: AccountType
  label: string
  description: string
  icon: React.ReactNode
}> = [
  {
    value: "tutor",
    label: "Tutor",
    description: "Supervisa y gestiona la seguridad de tus niños.",
    icon: <UserRound className="size-5" />,
  },
  {
    value: "admin_centro",
    label: "Administrador de Centro",
    description: "Gestiona un centro educativo y consulta a los niños vinculados.",
    icon: <GraduationCap className="size-5" />,
  },
]

export function RegisterScreen() {
  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<keyof RegisterFormValues, string>>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
        setSuccess("Cuenta creada correctamente. Ahora puedes iniciar sesión.")
        setTimeout(() => {
          void navigate({ to: "/login" })
        }, 500)
      } catch (registerError) {
        setError(getApiErrorMessage(registerError, "No se pudo registrar la cuenta."))
      }
    },
  })

  function clearFieldError(field: keyof RegisterFormValues) {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current
      }

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function handleAccountTypeChange(value: AccountType) {
    form.setFieldValue("tipo_cuenta", value)
    setError(null)
    setFieldErrors((current) => {
      const next = { ...current }
      delete next.tipo_cuenta
      delete next.centro_nombre
      delete next.centro_direccion
      return next
    })

    if (value === "tutor") {
      form.setFieldValue("centro_nombre", "")
      form.setFieldValue("centro_direccion", "")
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <Link
        to="/login"
        className="fixed left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center">
        <Card className="w-full">
          <CardHeader className="space-y-3 border-b border-border">
            <div className="inline-flex w-fit rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Registro seguro
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl">Crear una cuenta</CardTitle>
              <CardDescription>
                Completa tus datos para comenzar a usar Miraki.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                event.stopPropagation()
                void form.handleSubmit()
              }}
            >
              <section className="space-y-3">
                <div>
                  <h2 className="text-base font-semibold">Tipo de cuenta</h2>
                  <p className="text-sm text-muted-foreground">
                    Elige el perfil que mejor describe tu acceso.
                  </p>
                </div>
                <form.Subscribe
                  selector={(state) => state.values.tipo_cuenta}
                  children={(accountType) => (
                    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Tipo de cuenta">
                      {accountOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          role="radio"
                          aria-checked={accountType === option.value}
                          className={`rounded-lg border px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
                            accountType === option.value
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:bg-muted"
                          }`}
                          onClick={() => handleAccountTypeChange(option.value)}
                        >
                          <span className="flex items-start gap-3">
                            <span className="mt-0.5 text-muted-foreground">
                              {option.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block font-medium text-foreground">
                                {option.label}
                              </span>
                              <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                                {option.description}
                              </span>
                            </span>
                            {accountType === option.value ? (
                              <CheckCircle2 className="size-5 shrink-0 text-success" />
                            ) : (
                              <Circle className="size-5 shrink-0 text-muted-foreground" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                />
              </section>

              <Separator />

              <section className="space-y-4">
                <SectionHeading
                  title="Datos personales"
                  description="Usaremos estos datos para identificar tu cuenta."
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    form={form}
                    name="nombre"
                    label="Nombre"
                    error={fieldErrors.nombre}
                    icon={<UserRound className="size-4" />}
                    onFieldChange={clearFieldError}
                    autoComplete="name"
                  />
                  <TextField
                    form={form}
                    name="telefono"
                    label="Teléfono"
                    type="tel"
                    error={fieldErrors.telefono}
                    icon={<Phone className="size-4" />}
                    onFieldChange={clearFieldError}
                    autoComplete="tel"
                  />
                </div>
              </section>

              <section className="space-y-4">
                <SectionHeading
                  title="Datos de acceso"
                  description="Define las credenciales para iniciar sesión."
                />
                <TextField
                  form={form}
                  name="correo"
                  label="Correo electrónico"
                  type="email"
                  error={fieldErrors.correo}
                  icon={<Mail className="size-4" />}
                  onFieldChange={clearFieldError}
                  autoComplete="email"
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <form.Field
                    name="password"
                    children={(field) => {
                      const password = String(field.state.value ?? "")

                      return (
                        <FormFieldShell
                          id="password"
                          label="Contraseña"
                          error={fieldErrors.password}
                        >
                          <PasswordInput
                            id="password"
                            value={password}
                            showPassword={showPassword}
                            autoComplete="new-password"
                            placeholder="Tu contraseña"
                            error={fieldErrors.password}
                            onToggle={() => setShowPassword((current) => !current)}
                            onBlur={field.handleBlur}
                            onChange={(value) => {
                              clearFieldError("password")
                              field.handleChange(value)
                            }}
                          />
                          <PasswordRequirements password={password} />
                        </FormFieldShell>
                      )
                    }}
                  />
                  <form.Field
                    name="confirmar_password"
                    children={(field) => (
                      <FormFieldShell
                        id="confirmar_password"
                        label="Confirmar contraseña"
                        error={fieldErrors.confirmar_password}
                      >
                        <PasswordInput
                          id="confirmar_password"
                          value={String(field.state.value ?? "")}
                          showPassword={showConfirmPassword}
                          autoComplete="new-password"
                          placeholder="Confirma tu contraseña"
                          error={fieldErrors.confirmar_password}
                          onToggle={() => setShowConfirmPassword((current) => !current)}
                          onBlur={field.handleBlur}
                          onChange={(value) => {
                            clearFieldError("confirmar_password")
                            field.handleChange(value)
                          }}
                        />
                      </FormFieldShell>
                    )}
                  />
                </div>
              </section>

              <form.Subscribe
                selector={(state) => state.values.tipo_cuenta}
                children={(accountType) =>
                  accountType === "admin_centro" ? (
                    <section className="space-y-4 rounded-lg border border-border bg-muted/20 p-4">
                      <SectionHeading
                        title="Información del centro educativo"
                        description="Estos datos crearán el centro asociado a tu cuenta."
                      />
                      <div className="grid gap-4 lg:grid-cols-2">
                        <TextField
                          form={form}
                          name="centro_nombre"
                          label="Nombre del centro educativo"
                          error={fieldErrors.centro_nombre}
                          icon={<Building2 className="size-4" />}
                          onFieldChange={clearFieldError}
                        />
                        <form.Field
                          name="centro_direccion"
                          children={(field) => (
                            <div className="space-y-2">
                              <Label htmlFor="centro_direccion">
                                Dirección del centro educativo
                              </Label>
                              <Textarea
                                id="centro_direccion"
                                value={String(field.state.value ?? "")}
                                onBlur={field.handleBlur}
                                onChange={(event) => {
                                  clearFieldError("centro_direccion")
                                  field.handleChange(event.target.value)
                                }}
                                aria-invalid={Boolean(fieldErrors.centro_direccion)}
                                aria-describedby={
                                  fieldErrors.centro_direccion
                                    ? "centro_direccion-error"
                                    : undefined
                                }
                                className="min-h-24"
                              />
                              {fieldErrors.centro_direccion ? (
                                <p
                                  id="centro_direccion-error"
                                  className="text-sm text-destructive"
                                >
                                  {fieldErrors.centro_direccion}
                                </p>
                              ) : null}
                            </div>
                          )}
                        />
                      </div>
                    </section>
                  ) : null
                }
              />

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

              <Button type="submit" className="h-11 w-full text-base" size="lg" disabled={isLoading}>
                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
              </Button>

              <div className="space-y-3 pt-1">
                <Separator />
                <p className="text-center text-sm text-muted-foreground">
                  ¿Ya tienes una cuenta?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function SectionHeading({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function TextField({
  form,
  name,
  label,
  type = "text",
  error,
  icon,
  autoComplete,
  onFieldChange,
}: {
  form: RegisterFormApi
  name: keyof RegisterFormValues
  label: string
  type?: string
  error?: string
  icon: React.ReactNode
  autoComplete?: string
  onFieldChange: (field: keyof RegisterFormValues) => void
}) {
  return (
    <form.Field
      name={name}
      children={(field: RegisterFieldApi) => (
        <FormFieldShell id={name} label={label} error={error}>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
              {icon}
            </span>
            <Input
              id={name}
              type={type}
              value={String(field.state.value ?? "")}
              onBlur={field.handleBlur}
              onChange={(event) => {
                onFieldChange(name)
                field.handleChange(event.target.value)
              }}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${name}-error` : undefined}
              autoComplete={autoComplete}
              className="h-10 pl-10 sm:h-11"
            />
          </div>
        </FormFieldShell>
      )}
    />
  )
}

function FormFieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function PasswordInput({
  id,
  value,
  showPassword,
  autoComplete,
  placeholder,
  error,
  onToggle,
  onBlur,
  onChange,
}: {
  id: string
  value: string
  showPassword: boolean
  autoComplete: string
  placeholder: string
  error?: string
  onToggle: () => void
  onBlur: () => void
  onChange: (value: string) => void
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
        <LockKeyhole className="size-4" />
      </span>
      <Input
        id={id}
        className="h-10 pl-10 pr-11 sm:h-11"
        type={showPassword ? "text" : "password"}
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 top-1/2 -translate-y-1/2"
        onClick={onToggle}
        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
      >
        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  )
}

function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    {
      label: "Mínimo 8 caracteres",
      met: password.length >= 8,
    },
    {
      label: "Al menos un carácter especial",
      met: /[!@#$%^&*()_+\-=[\]{};:'",.<>/?\\|`~]/.test(password),
    },
  ]

  return (
    <div className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-muted-foreground">
        Tu contraseña debe incluir:
      </p>
      <ul className="space-y-1">
        {requirements.map((requirement) => (
          <li
            key={requirement.label}
            className={
              requirement.met
                ? "flex items-center gap-2 text-success"
                : "flex items-center gap-2 text-muted-foreground"
            }
          >
            {requirement.met ? (
              <CheckCircle2 className="size-3.5" />
            ) : (
              <Circle className="size-3.5" />
            )}
            {requirement.label}
          </li>
        ))}
      </ul>
    </div>
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
