import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { ALERT_TYPES, type Alerta, type AlertType } from "../types"

type AlertsTableProps = {
  rows: Alerta[]
  onAtender: (alerta: Alerta) => void
  attendingId: number | null
}

const TYPE_LABELS: Record<AlertType, string> = {
  [ALERT_TYPES.SALIDA_ZONA]: "Salida de zona",
  [ALERT_TYPES.BATERIA_BAJA]: "Batería baja",
  [ALERT_TYPES.SOS]: "SOS",
}

function typeVariant(tipo: AlertType): "default" | "secondary" | "destructive" | "outline" {
  switch (tipo) {
    case ALERT_TYPES.SOS:
      return "destructive"
    case ALERT_TYPES.SALIDA_ZONA:
      return "default"
    case ALERT_TYPES.BATERIA_BAJA:
      return "secondary"
    default:
      return "outline"
  }
}

function formatDate(value: string) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

export function AlertsTable({ rows, onAtender, attendingId }: AlertsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Niño</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Zona</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((alerta) => (
          <TableRow key={alerta.id_alerta}>
            <TableCell className="whitespace-nowrap">{formatDate(alerta.fecha_alerta)}</TableCell>
            <TableCell>{alerta.nombre_nino}</TableCell>
            <TableCell>
              <Badge variant={typeVariant(alerta.tipo)}>{TYPE_LABELS[alerta.tipo] ?? alerta.tipo}</Badge>
            </TableCell>
            <TableCell>{alerta.nombre_zona ?? "—"}</TableCell>
            <TableCell>
              {alerta.atendida ? (
                <Badge variant="outline">Atendida</Badge>
              ) : (
                <Badge variant="destructive">Pendiente</Badge>
              )}
            </TableCell>
            <TableCell className="text-right">
              {alerta.atendida ? (
                <span className="text-sm text-muted-foreground">—</span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={attendingId === alerta.id_alerta}
                  onClick={() => onAtender(alerta)}
                >
                  {attendingId === alerta.id_alerta ? "Guardando…" : "Marcar atendida"}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
