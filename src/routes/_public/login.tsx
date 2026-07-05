import { createFileRoute } from "@tanstack/react-router"
import { LoginScreen } from "@/src/features/auth"

export const Route = createFileRoute("/_public/login")({
  component: LoginScreen,
})