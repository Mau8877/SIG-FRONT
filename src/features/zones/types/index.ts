export type HorarioZona = {
  id_horario?: number
  dia_semana: number // 1=Lunes ... 7=Domingo
  hora_inicio: string // "08:00:00" o "08:00"
  hora_fin: string // "12:00:00" o "12:00"
  activo?: boolean
}

export type NinoAsociado = {
  id: number
  id_nino: number
  nombre: string
  foto_url?: string | null
  activa: boolean
}

export type ZonaSegura = {
  id_zona: number
  nombre: string
  poligono: GeoJSONPolygon
  activo: boolean
  horarios?: HorarioZona[]
  ninos_asociados?: NinoAsociado[]
  fecha_creacion: string
  fecha_modificacion: string
}

export type GeoJSONPolygon = {
  type: 'Polygon'
  coordinates: number[][][]
}

export type ZonaPayload = {
  nombre: string
  poligono: GeoJSONPolygon
}

export type ZonaUpdatePayload = {
  nombre?: string
  poligono?: GeoJSONPolygon
}
