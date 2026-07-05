import { createFileRoute } from "@tanstack/react-router"
import { RegisterScreen } from "@/src/features/auth"

export const Route = createFileRoute("/_public/register")({
  component: RegisterScreen,
})