import { User, Shield, Play, Pause, AlertCircle, CheckCircle2, UserCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetNinosQuery } from "@/src/features/children"
import { getApiErrorMessage } from "@/src/lib/apiError"

import { useVincularNinoMutation, useDesactivarNinoMutation } from "../api/zonesApi"
import type { NinoAsociado } from "../types"

interface NinosSelectorProps {
  idZona: number
  ninosAsociados?: NinoAsociado[]
  readOnly?: boolean
}

export function NinosSelector({
  idZona,
  ninosAsociados = [],
  readOnly = false,
}: NinosSelectorProps) {
  // Manejo tolerante de errores por si el módulo de niños está incompleto o falla
  const { data: ninosData, isLoading: loadingNinos, isError, error } = useGetNinosQuery()
  const [vincularNino, { isLoading: vinculando }] = useVincularNinoMutation()
  const [desactivarNino, { isLoading: desactivando }] = useDesactivarNinoMutation()

  const handleVincular = async (idNino: number) => {
    if (readOnly) return
    try {
      await vincularNino({ id: idZona, id_nino: idNino }).unwrap()
    } catch (err) {
      console.error("Error al vincular niño:", err)
    }
  }

  const handleDesactivar = async (idNino: number) => {
    if (readOnly) return
    try {
      await desactivarNino({ id: idZona, id_nino: idNino }).unwrap()
    } catch (err) {
      console.error("Error al desactivar vigilancia del niño:", err)
    }
  }

  const ninosList = ninosData?.results ?? []

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg font-semibold text-slate-800">
              Niños Monitoreados en esta Zona
            </CardTitle>
          </div>
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">
            {ninosAsociados.filter((a) => a.activa).length} vigilado(s)
          </Badge>
        </div>
        <CardDescription className="text-slate-600 text-sm mt-1">
          Asocia esta zona segura a tus hijos para que el sistema emita alertas cuando entren o salgan del área.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {loadingNinos ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        ) : isError || !ninosData ? (
          /* Estado tolerante: si la API de niños falla o el backend de niños está en desarrollo */
          <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm">
            <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700">Módulo de niños no disponible temporalmente</p>
              <p className="text-slate-500 mt-0.5">
                No se pudo obtener la lista de niños ({isError ? getApiErrorMessage(error) : "Sin datos"}). Si el módulo está en configuración por otro miembro del equipo, podrás vincular a tus hijos más adelante sin afectar esta zona.
              </p>
            </div>
          </div>
        ) : ninosList.length === 0 ? (
          /* Estado sin niños registrados en el tutor */
          <div className="flex items-start gap-3 p-4 bg-blue-50/80 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Sin niños registrados en tu cuenta</p>
              <p className="text-blue-700 mt-0.5">
                Para vigilar a tus hijos en esta zona, primero debes registrarlos en la sección de Niños. Una vez agregados, aparecerán aquí listos para ser vinculados.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {ninosList.map((nino) => {
              const childId = nino.id_nino ?? nino.id ?? 0
              const asociacion = ninosAsociados.find((a) => a.id_nino === childId)
              const estaVinculado = Boolean(asociacion)
              const estaActivo = asociacion?.activa ?? false

              return (
                <div
                  key={childId}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border transition-all ${
                    estaActivo
                      ? "bg-emerald-50/40 border-emerald-200 shadow-2xs"
                      : estaVinculado
                      ? "bg-amber-50/40 border-amber-200 shadow-2xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3.5 mb-3 sm:mb-0">
                    <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {nino.foto_url ? (
                        <img
                          src={nino.foto_url}
                          alt={nino.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800">{nino.nombre}</p>
                        {estaActivo ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-medium text-xs flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Monitoreando
                          </Badge>
                        ) : estaVinculado ? (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-medium text-xs flex items-center gap-1">
                            <Pause className="h-3 w-3" />
                            Pausado
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-500 border-slate-300 text-xs">
                            No vinculado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {estaActivo
                          ? "Vigilancia activa en esta zona y sus horarios configurados."
                          : estaVinculado
                          ? "Vigilancia suspendida temporalmente (configuración conservada)."
                          : "El niño no está siendo monitoreado respecto a esta zona."}
                      </p>
                    </div>
                  </div>

                  {!readOnly && (
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      {!estaVinculado ? (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleVincular(childId)}
                          disabled={vinculando || desactivando}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs h-8 px-3 shadow-xs flex items-center gap-1.5"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Vincular zona
                        </Button>
                      ) : estaActivo ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDesactivar(childId)}
                          disabled={vinculando || desactivando}
                          className="border-amber-300 bg-amber-50/50 hover:bg-amber-100 text-amber-800 font-medium text-xs h-8 px-3 flex items-center gap-1.5"
                          title="Pausar vigilancia temporalmente sin borrar la zona (PB-10)"
                        >
                          <Pause className="h-3.5 w-3.5" />
                          Pausar vigilancia
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleVincular(childId)}
                          disabled={vinculando || desactivando}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-8 px-3 shadow-xs flex items-center gap-1.5"
                          title="Reanudar monitoreo del niño en esta zona"
                        >
                          <Play className="h-3.5 w-3.5" />
                          Reanudar vigilancia
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
