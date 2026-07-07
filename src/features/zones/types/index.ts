export type ZonaSegura = {
  id_zona: number
  nombre: string
  poligono: GeoJSONPolygon
  activo: boolean
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
