export interface HistorialPosicion {
  id_posicion: number
  latitud: number
  longitud: number
  velocidad: number | null
  bateria: number | null
  fecha_posicion: string
}

export interface HistorialResponse {
  nino: { id_nino: number; nombre: string }
  count: number
  truncated: boolean
  results: HistorialPosicion[]
}

export interface HistorialParams {
  ninoId: number
  desde?: string
  hasta?: string
}
