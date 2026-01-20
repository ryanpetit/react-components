"use client"

import type { Table, Column } from "@tanstack/react-table"
import { useState, useMemo } from "react"
import { X, ArrowUpDown, Plus, ArrowUpAZ, ArrowDownAZ } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export type SortDirection = "asc" | "desc"

interface SortCondition {
  id: string
  columnId: string
  direction: SortDirection
}

interface AdvancedSortProps<TData> {
  table: Table<TData>
}

export function AdvancedSort<TData>({ table }: AdvancedSortProps<TData>) {
  const [sorts, setSorts] = useState<SortCondition[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const sortableColumns = useMemo(() => {
    return table.getAllColumns().filter((col) => col.getCanSort() && col.id !== "select" && col.id !== "actions")
  }, [table])

  const applySorting = (newSorts: SortCondition[]) => {
    if (newSorts.length === 0) {
      table.resetSorting()
      return
    }

    const sortingState = newSorts.map((sort) => ({
      id: sort.columnId,
      desc: sort.direction === "desc",
    }))

    table.setSorting(sortingState)
  }

  const addSort = () => {
    if (sortableColumns.length === 0) return

    const usedColumnIds = sorts.map((s) => s.columnId)
    const availableColumn = sortableColumns.find((col) => !usedColumnIds.includes(col.id)) || sortableColumns[0]

    const newSorts = [
      ...sorts,
      {
        id: crypto.randomUUID(),
        columnId: availableColumn.id,
        direction: "asc" as SortDirection,
      },
    ]
    setSorts(newSorts)
    applySorting(newSorts)
  }

  const removeSort = (id: string) => {
    const newSorts = sorts.filter((s) => s.id !== id)
    setSorts(newSorts)
    applySorting(newSorts)
  }

  const updateSort = (id: string, updates: Partial<SortCondition>) => {
    const newSorts = sorts.map((s) => {
      if (s.id !== id) return s
      return { ...s, ...updates }
    })
    setSorts(newSorts)
    applySorting(newSorts)
  }

  const clearSorts = () => {
    setSorts([])
    table.resetSorting()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto cursor-pointer bg-transparent relative">
          <ArrowUpDown className="h-4 w-4" />
          {sorts.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center bg-primary text-primary-foreground rounded-full">
              {sorts.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="start">
        <div className="flex flex-col items-start space-y-3">
          <div className="flex items-center justify-between w-full gap-4">
            <h4 className="font-medium text-sm">Sort</h4>
            {sorts.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearSorts} className="h-7 px-2 text-xs cursor-pointer">
                <X className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {sorts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active sorting.</p>
          ) : (
            sorts.map((sort, index) => (
              <SortRow
                key={sort.id}
                sort={sort}
                columns={sortableColumns}
                usedColumnIds={sorts.filter((s) => s.id !== sort.id).map((s) => s.columnId)}
                onUpdate={updateSort}
                onRemove={removeSort}
                isFirst={index === 0}
              />
            ))
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={addSort}
            disabled={sorts.length >= sortableColumns.length}
            className="gap-2 bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Sort
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface SortRowProps<TData> {
  sort: SortCondition
  columns: Column<TData, unknown>[]
  usedColumnIds: string[]
  onUpdate: (id: string, updates: Partial<SortCondition>) => void
  onRemove: (id: string) => void
  isFirst: boolean
}

function SortRow<TData>({ sort, columns, usedColumnIds, onUpdate, onRemove, isFirst }: SortRowProps<TData>) {
  const availableColumns = columns.filter((col) => !usedColumnIds.includes(col.id))

  return (
    <div className="flex items-center gap-2">
      {!isFirst && (
        <span className="text-xs text-muted-foreground w-10">then</span>
      )}
      <Select value={sort.columnId} onValueChange={(value) => onUpdate(sort.id, { columnId: value })}>
        <SelectTrigger className="w-[160px] cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableColumns.map((col) => (
            <SelectItem key={col.id} value={col.id}>
              {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort.direction}
        onValueChange={(value: SortDirection) => onUpdate(sort.id, { direction: value })}
      >
        <SelectTrigger className="w-[140px] cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">
            <span className="flex items-center gap-2">
              <ArrowUpAZ className="h-4 w-4" />
              A-Z
            </span>
          </SelectItem>
          <SelectItem value="desc">
            <span className="flex items-center gap-2">
              <ArrowDownAZ className="h-4 w-4" />
              Z-A
            </span>
          </SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" size="sm" onClick={() => onRemove(sort.id)} className="h-9 px-2 cursor-pointer">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}
