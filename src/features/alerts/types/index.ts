export const ALERT_TYPES = {
  SALIDA_ZONA: "salida_zona",
  BATERIA_BAJA: "bateria_baja",
  SOS: "sos",
} as const

export type AlertType = (typeof ALERT_TYPES)[keyof typeof ALERT_TYPES]

export interface Alerta {
  id_alerta: number
  id_nino: number
  nombre_nino: string
  id_zona: number | null
  nombre_zona: string | null
  id_posicion: number | null
  latitud: string | null
  longitud: string | null
  tipo: AlertType
  fecha_alerta: string
  atendida: boolean
  fecha_atencion: string | null
  atendida_por: number | null
}
