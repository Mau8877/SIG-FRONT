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
import { authSessionStarted, useLoginMutation } from "@/src/features/auth"
import { getApiErrorMessage } from "@/src/lib/apiError"
import { useAppDispatch } from "@/src/store/hooks"

import { loginSchema, type LoginFormValues } from "../schemas"

const defaultValues: LoginFormValues = {
  correo: "",
  password: "",
}

export function LoginScreen() {
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormValues, string>>>({})
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setError(null)
      setFieldErrors({})

      const parsed = loginSchema.safeParse(value)

      if (!parsed.success) {
        setFieldErrors(flattenIssues(parsed.error.issues))
        return
      }

      try {
        const response = await login(parsed.data).unwrap()
        dispatch(authSessionStarted(response.usuario))
        void navigate({ to: "/dashboard", replace: true })
      } catch (loginError) {
        setError(getApiErrorMessage(loginError, "Credenciales invalidas o cuenta no disponible."))
      }
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesion</CardTitle>
          <CardDescription>Accede con tu correo y contrasena.</CardDescription>
        </CardHeader>
        <CardContent>
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
                  input={
                    <Input
                      id="correo"
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={Boolean(fieldErrors.correo)}
                      autoComplete="email"
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
                  label="Contrasena"
                  error={fieldErrors.password}
                  input={
                    <Input
                      id="password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                      aria-invalid={Boolean(fieldErrors.password)}
                      autoComplete="current-password"
                    />
                  }
                />
              )}
            />

            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link to="/register" className="font-medium text-foreground underline">
                Registrate
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function FormField({
  id,
  label,
  error,
  input,
}: {
  id: string
  label: string
  error?: string
  input: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {input}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function flattenIssues(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.reduce<Partial<Record<keyof LoginFormValues, string>>>((errors, issue) => {
    const key = issue.path[0] as keyof LoginFormValues
    errors[key] = issue.message
    return errors
  }, {})
}
