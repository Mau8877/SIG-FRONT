import type { UserRole } from "@/src/config/roles"

export type AuthStatus = "initializing" | "authenticated" | "unauthenticated"

export type AuthUser = {
  id_usuario: number
  correo: string
  rol: UserRole
}

export type LoginRequest = {
  correo: string
  password: string
}

export type LoginResponse = {
  usuario: AuthUser
}

export type RegisterRequest =
  | {
      correo: string
      password: string
      confirmar_password: string
      tipo_cuenta: "tutor"
      nombre: string
      telefono: string
    }
  | {
      correo: string
      password: string
      confirmar_password: string
      tipo_cuenta: "admin_centro"
      nombre: string
      telefono: string
      centro: {
        nombre: string
        direccion: string
      }
    }
