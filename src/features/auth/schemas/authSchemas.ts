import { z } from "zod"

export const loginSchema = z.object({
  correo: z.email("Ingresa un correo electrónico válido."),
  password: z.string().min(1, "La contraseña es obligatoria."),
})

const specialCharacterPattern = /[!@#$%^&*()_+\-=[\]{};:'",.<>/?\\|`~]/

export const registerSchema = z
  .object({
    tipo_cuenta: z.enum(["tutor", "admin_centro"]),
    nombre: z.string().trim().min(1, "Ingresa tu nombre."),
    telefono: z.string().trim().min(1, "Ingresa tu teléfono."),
    correo: z.email("Ingresa un correo electrónico válido."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres.")
      .regex(
        specialCharacterPattern,
        "La contraseña debe incluir al menos un carácter especial.",
      ),
    confirmar_password: z.string().min(1, "Confirma tu contraseña."),
    centro_nombre: z.string().optional(),
    centro_direccion: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmar_password) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmar_password"],
        message: "Las contraseñas no coinciden.",
      })
    }

    if (data.tipo_cuenta !== "admin_centro") {
      return
    }

    if (!data.centro_nombre?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["centro_nombre"],
        message: "Ingresa el nombre del centro educativo.",
      })
    }

    if (!data.centro_direccion?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["centro_direccion"],
        message: "Ingresa la dirección del centro educativo.",
      })
    }
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
