import { z } from "zod"

export const loginSchema = z.object({
  correo: z.email("Ingresa un correo valido."),
  password: z.string().min(1, "La contrasena es obligatoria."),
})

export const registerStepOneSchema = z
  .object({
    correo: z.email("Ingresa un correo valido."),
    password: z.string().min(1, "La contrasena es obligatoria."),
    confirmar_password: z.string().min(1, "Confirma tu contrasena."),
  })
  .refine((data) => data.password === data.confirmar_password, {
    path: ["confirmar_password"],
    message: "Las contrasenas no coinciden.",
  })

export const registerSchema = registerStepOneSchema
  .extend({
    tipo_cuenta: z.enum(["tutor", "admin_centro"]),
    nombre: z.string().min(1, "El nombre es obligatorio."),
    telefono: z.string().min(1, "El telefono es obligatorio."),
    centro_nombre: z.string().optional(),
    centro_direccion: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo_cuenta !== "admin_centro") {
      return
    }

    if (!data.centro_nombre) {
      ctx.addIssue({
        code: "custom",
        path: ["centro_nombre"],
        message: "El nombre del centro es obligatorio.",
      })
    }

    if (!data.centro_direccion) {
      ctx.addIssue({
        code: "custom",
        path: ["centro_direccion"],
        message: "La direccion del centro es obligatoria.",
      })
    }
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
