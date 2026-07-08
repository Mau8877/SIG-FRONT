export interface CentroEducativo {
  id_centro: number
  nombre: string
  direccion: string
  activo: boolean
}

export interface UpdateCentroPayload {
  nombre: string
  direccion: string
}

export type GeoJSONPolygon = {
  type: "Polygon"
  coordinates: number[][][]
}

export interface InstitutionMapChild {
  id_nino: number
  nombre: string
  latitud: number | null
  longitud: number | null
  bateria: number | null
  fecha_posicion: string | null
  dentro_zona: boolean | null
}

export interface InstitutionMapZona {
  id_zona: number
  nombre: string
  poligono: GeoJSONPolygon
}

export interface InstitutionMapData {
  children: InstitutionMapChild[]
  zonas: InstitutionMapZona[]
}
