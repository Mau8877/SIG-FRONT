import { useState, useEffect } from "react"
import { Clock, Plus, Trash2, Calendar, AlertCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { HorarioZona } from "../types"

const DIAS_SEMANA = [
  { id: 1, nombre: "Lunes" },
  { id: 2, nombre: "Martes" },
  { id: 3, nombre: "Miércoles" },
  { id: 4, nombre: "Jueves" },
  { id: 5, nombre: "Viernes" },
  { id: 6, nombre: "Sábado" },
  { id: 7, nombre: "Domingo" },
]

interface HorariosEditorProps {
  horarios?: HorarioZona[]
  onSave?: (horarios: HorarioZona[]) => void
  isLoading?: boolean
  readOnly?: boolean
}

export function HorariosEditor({
  horarios = [],
  onSave,
  isLoading = false,
  readOnly = false,
}: HorariosEditorProps) {
  const [lista, setLista] = useState<HorarioZona[]>(horarios)
  const [diaSeleccionado, setDiaSeleccionado] = useState<number>(1)
  const [horaInicio, setHoraInicio] = useState<string>("08:00")
  const [horaFin, setHoraFin] = useState<string>("12:00")
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null)
  const [haCambiado, setHaCambiado] = useState<boolean>(false)

  useEffect(() => {
    setLista(horarios)
    setHaCambiado(false)
  }, [horarios])

  const handleAgregar = () => {
    setErrorValidacion(null)
    if (!horaInicio || !horaFin) {
      setErrorValidacion("Por favor ingrese hora de inicio y fin.")
      return
    }
    if (horaInicio >= horaFin) {
      setErrorValidacion("La hora de inicio debe ser estrictamente anterior a la hora de fin.")
      return
    }

    const nuevo: HorarioZona = {
      dia_semana: diaSeleccionado,
      hora_inicio: horaInicio.length === 5 ? `${horaInicio}:00` : horaInicio,
      hora_fin: horaFin.length === 5 ? `${horaFin}:00` : horaFin,
      activo: true,
    }

    setLista([...lista, nuevo])
    setHaCambiado(true)
  }

  const handleEliminar = (index: number) => {
    const nuevaLista = lista.filter((_, i) => i !== index)
    setLista(nuevaLista)
    setHaCambiado(true)
  }

  const handleGuardar = () => {
    if (onSave) {
      onSave(lista)
      setHaCambiado(false)
    }
  }

  const getNombreDia = (dia: number) => {
    const encontrado = DIAS_SEMANA.find((d) => d.id === dia)
    return encontrado ? encontrado.nombre : `Día ${dia}`
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg font-semibold text-slate-800">
              Horario de Control de Zona
            </CardTitle>
          </div>
          {lista.length === 0 ? (
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium">
              Activo 24/7 por defecto
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {lista.length} franja{lista.length !== 1 ? "s" : ""} configurada{lista.length !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-600 text-sm mt-1">
          Configura los días y periodos horarios específicos en los que se debe vigilar esta zona.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {lista.length === 0 && (
          <div className="flex items-start gap-3 p-4 bg-amber-50/80 border border-amber-200 rounded-lg text-amber-800 text-sm">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sin horarios restringidos</p>
              <p className="text-amber-700 mt-0.5">
                Al no definir ninguna ventana horaria, el sistema monitoreará esta zona de forma ininterrumpida todos los días de la semana (24/7).
              </p>
            </div>
          </div>
        )}

        {!readOnly && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/80 space-y-4">
            <h4 className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-indigo-600" />
              Añadir nueva franja horaria
            </h4>

            {errorValidacion && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs font-medium">
                {errorValidacion}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-medium text-slate-600">Día de la semana</label>
                <select
                  value={diaSeleccionado}
                  onChange={(e) => setDiaSeleccionado(Number(e.target.value))}
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {DIAS_SEMANA.map((dia) => (
                    <option key={dia.id} value={dia.id}>
                      {dia.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-medium text-slate-600">Hora de inicio</label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-medium text-slate-600">Hora de fin</label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-300 bg-white px-3 py-1 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>

              <div className="sm:col-span-1">
                <Button
                  type="button"
                  onClick={handleAgregar}
                  disabled={isLoading}
                  className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-1.5"
                >
                  <Plus className="h-4 w-4" />
                  Añadir
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-700">
            Franjas horarias activas ({lista.length})
          </h4>

          {lista.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg text-slate-400 text-sm">
              No hay franjas configuradas.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {lista.map((item, index) => (
                <div
                  key={`${item.dia_semana}-${item.hora_inicio}-${index}`}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                      {getNombreDia(item.dia_semana).slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {getNombreDia(item.dia_semana)}
                      </p>
                      <p className="text-xs font-mono text-slate-500">
                        {item.hora_inicio.slice(0, 5)} hrs — {item.hora_fin.slice(0, 5)} hrs
                      </p>
                    </div>
                  </div>

                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleEliminar(index)}
                      disabled={isLoading}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Eliminar franja"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {!readOnly && onSave && (
          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button
              type="button"
              onClick={handleGuardar}
              disabled={isLoading || !haCambiado}
              className={`px-6 py-2 font-medium transition-all ${
                haCambiado
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? "Guardando..." : haCambiado ? "Guardar cambios de horario" : "Horarios guardados"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
