import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Column = {
  label: string
  keys: string[]
}

type AuditTableProps = {
  rows: Record<string, unknown>[]
  columns: Column[]
  detailTitle: string
}

export function AuditTable({ rows, columns, detailTitle }: AuditTableProps) {
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.label}>{column.label}</TableHead>
            ))}
            <TableHead>Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={getStableKey(row, index)}>
              {columns.map((column) => (
                <TableCell key={column.label}>{formatValue(pickValue(row, column.keys))}</TableCell>
              ))}
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => setSelectedRow(row)}>
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={Boolean(selectedRow)} onOpenChange={(open) => !open && setSelectedRow(null)}>
        {selectedRow ? (
          <DialogContent className="max-w-3xl" onClose={() => setSelectedRow(null)}>
            <DialogHeader>
              <DialogTitle>{detailTitle}</DialogTitle>
              <DialogDescription>Datos completos del registro seleccionado.</DialogDescription>
            </DialogHeader>
            <pre className="max-h-[60svh] overflow-auto rounded-lg bg-muted p-4 text-xs text-foreground">
              {JSON.stringify(selectedRow, null, 2)}
            </pre>
          </DialogContent>
        ) : null}
      </Dialog>
    </>
  )
}

function pickValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (key in row) {
      return row[key]
    }
  }

  return ""
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-"
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  return "Ver detalle"
}

function getStableKey(row: Record<string, unknown>, index: number) {
  const id = row.id ?? row.id_bitacora ?? row.id_bitacora_acceso
  return typeof id === "string" || typeof id === "number" ? id : index
}
