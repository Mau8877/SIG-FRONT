export type Nino = {
  id_nino?: number
  id?: number
  nombre: string
  fecha_nacimiento: string
  foto_url?: string | null
  activo?: boolean
}

export type NinoPayload = {
  nombre: string
  fecha_nacimiento: string
  foto_url?: string
}
