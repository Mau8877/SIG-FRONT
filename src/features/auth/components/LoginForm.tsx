import { useState } from "react"
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import type { LoginFormValues } from "../schemas"

type LoginFieldApi = {
  state: { value: string }
  handleBlur: () => void
  handleChange: (value: string) => void
}

type LoginFormApi = {
  Field: React.ComponentType<{
    name: keyof LoginFormValues
    children: (field: LoginFieldApi) => React.ReactNode
  }>
  handleSubmit: () => void | Promise<void>
}

type LoginFormProps = {
  form: LoginFormApi
  fieldErrors: Partial<Record<keyof LoginFormValues, string>>
  error: string | null
  isLoading: boolean
}

export function LoginForm({ form, fieldErrors, error, isLoading }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <div className="mb-5 space-y-2 sm:mb-6">
        <div className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          Acceso seguro
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Bienvenido de nuevo
          </h2>
          <p className="text-sm leading-5 text-muted-foreground sm:leading-6">
            Ingresa a tu panel para revisar zonas seguras, ubicaciones y alertas.
          </p>
        </div>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <form.Field
          name="correo"
          children={(field) => (
            <FormField
              id="correo"
              label="Correo"
              error={fieldErrors.correo}
              icon={<Mail className="size-4" />}
              input={
                <Input
                  id="correo"
                  className="h-10 pl-10 sm:h-11"
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={Boolean(fieldErrors.correo)}
                  autoComplete="email"
                  placeholder="tutor@email.com"
                />
              }
            />
          )}
        />

        <form.Field
          name="password"
          children={(field) => (
            <FormField
              id="password"
              label="Contraseña"
              error={fieldErrors.password}
              icon={<LockKeyhole className="size-4" />}
              input={
                <div className="relative">
                  <Input
                    id="password"
                    className="h-10 pl-10 pr-11 sm:h-11"
                    type={showPassword ? "text" : "password"}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={Boolean(fieldErrors.password)}
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </div>
              }
            />
          )}
        />

        {error ? (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm leading-5 text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="h-10 w-full text-base sm:h-11" size="lg" disabled={isLoading}>
          {isLoading ? "Ingresando..." : "Ingresar"}
        </Button>

        <div className="space-y-3 pt-1">
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="font-medium text-foreground underline underline-offset-4">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

function FormField({
  id,
  label,
  error,
  icon,
  input,
}: {
  id: string
  label: string
  error?: string
  icon: React.ReactNode
  input: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {input}
      </div>
      {error ? <p className="text-xs text-destructive sm:text-sm">{error}</p> : null}
    </div>
  )
}
