import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useForm } from "@tanstack/react-form"
import { ArrowLeft } from "lucide-react"

import { authSessionStarted, useLoginMutation } from "@/src/features/auth"
import { getApiErrorMessage } from "@/src/lib/apiError"
import { useAppDispatch } from "@/src/store/hooks"

import { LoginBrandPanel, LoginForm } from "../components"
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
    <div className="grid h-svh overflow-hidden bg-background text-foreground lg:grid-cols-[55fr_45fr]">
      <Link
        to="/"
        className="fixed left-4 top-4 z-10 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" />
        Volver al inicio
      </Link>
      <LoginBrandPanel />
      <main className="flex h-svh min-w-0 items-center justify-center overflow-hidden px-5 py-5 sm:px-8 lg:px-12">
        <LoginForm
          form={form}
          fieldErrors={fieldErrors}
          error={error}
          isLoading={isLoading}
        />
      </main>
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
