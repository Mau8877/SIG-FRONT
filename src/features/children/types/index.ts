export type NinoCentroSummary = {
  id_centro: number
  nombre: string
}

export type Nino = {
  id_nino?: number
  id?: number
  nombre: string
  fecha_nacimiento: string | null
  foto_url?: string | null
  activo?: boolean
  centro?: NinoCentroSummary | null
}

export type NinoPayload = {
  nombre: string
  fecha_nacimiento: string
  foto?: File | null
}

export type CentroEducativoSelection = {
  id_centro: number
  nombre: string
  direccion: string
}

export type AssignCenterPayload = {
  centro_id: number
}
