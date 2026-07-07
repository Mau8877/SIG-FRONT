import { z } from "zod"

const today = new Date()
today.setHours(0, 0, 0, 0)

export const ninoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio."),
  fecha_nacimiento: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria.")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00`)
      return !Number.isNaN(date.getTime()) && date <= today
    }, "La fecha no puede ser futura."),
  foto_url: z.string().optional(),
})

export type NinoFormValues = z.infer<typeof ninoSchema>
