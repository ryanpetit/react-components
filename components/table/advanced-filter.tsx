"use client"

import type { Table, Column } from "@tanstack/react-table"
import { useState, useMemo, useEffect } from "react"
import { X, Filter, Plus } from "lucide-react"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export type FilterType = "text" | "number" | "range" | "date" | "dateRange" | "boolean" | "select" | "multiSelect"

export interface FilterMeta {
  filter_type?: FilterType
  options?: Array<{ label: string; value: string }>
}

interface FilterCondition {
  id: string
  columnId: string
  operator: string
  value: string | number | boolean | string[] | number[] | unknown
}

interface AdvancedFilterProps<TData> {
  table: Table<TData>
}

const OPERATORS: Record<FilterType, Array<{ value: string; label: string }>> = {
  text: [
    { value: "contains", label: "Contains" },
    { value: "notContains", label: "Does not contain" },
    { value: "is", label: "Is" },
    { value: "isNot", label: "Is not" },
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "isEmpty", label: "Is empty" },
    { value: "isNotEmpty", label: "Is not empty" },
  ],
  number: [
    { value: "=", label: "=" },
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
  ],
  range: [{ value: "between", label: "Between" }],
  date: [
    { value: "=", label: "On" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
  ],
  dateRange: [{ value: "between", label: "Between" }],
  boolean: [{ value: "is", label: "Is" }],
  select: [
    { value: "is", label: "Is" },
    { value: "isNot", label: "Is not" },
  ],
  multiSelect: [{ value: "in", label: "In any" }],
}

function matchesFilter(cellValue: unknown, operator: string, filterValue: unknown, filterType: FilterType): boolean {
  if (operator === "isEmpty" || operator === "isNotEmpty") {
    const cellStr = String(cellValue).trim()
    if (operator === "isEmpty") return cellStr === ""
    if (operator === "isNotEmpty") return cellStr !== ""
  }

  if (filterValue === "" || filterValue === null || filterValue === undefined) return true

  const cellStr = String(cellValue).toLowerCase()
  const filterStr = String(filterValue).toLowerCase()

  switch (filterType) {
    case "text": {
      if (operator === "contains") return cellStr.includes(filterStr)
      if (operator === "notContains") return !cellStr.includes(filterStr)
      if (operator === "is") return cellStr === filterStr
      if (operator === "isNot") return cellStr !== filterStr
      if (operator === "startsWith") return cellStr.startsWith(filterStr)
      if (operator === "endsWith") return cellStr.endsWith(filterStr)
      if (operator === "isEmpty") return cellStr === ""
      if (operator === "isNotEmpty") return cellStr !== ""
      return true
    }

    case "number": {
      const cellNum = Number(cellValue)
      const filterNum = Number(filterValue)
      if (operator === "=") return cellNum === filterNum
      if (operator === ">") return cellNum > filterNum
      if (operator === ">=") return cellNum >= filterNum
      if (operator === "<") return cellNum < filterNum
      if (operator === "<=") return cellNum <= filterNum
      return true
    }

    case "range": {
      if (!Array.isArray(filterValue) || filterValue.some((v) => v === "" || v === null)) return true
      const [min, max] = filterValue.map(Number)
      const cellNumRange = Number(cellValue)
      return cellNumRange >= min && cellNumRange <= max
    }

    case "date": {
      const cellDate = new Date(cellValue as string | number | Date).getTime()
      const filterDate = new Date(filterValue as string | number | Date).getTime()
      if (operator === "=") return cellDate === filterDate
      if (operator === "before") return cellDate < filterDate
      if (operator === "after") return cellDate > filterDate
      return true
    }

    case "dateRange": {
      if (!Array.isArray(filterValue) || filterValue.some((v) => v === "" || v === null)) return true
      const cellDateRange = new Date(cellValue as string | number | Date).getTime()
      const [startDate, endDate] = filterValue.map((d) => new Date(d as string | number | Date).getTime())
      return cellDateRange >= startDate && cellDateRange <= endDate
    }

    case "boolean": {
      return Boolean(cellValue) === Boolean(filterValue)
    }

    case "select": {
      if (operator === "is") return cellStr === filterStr
      if (operator === "isNot") return cellStr !== filterStr
      return true
    }

    case "multiSelect": {
      const selectedValues = String(filterValue)
        .split(",")
        .filter(Boolean)
        .map((v) => v.toLowerCase())
      return selectedValues.some((v) => cellStr.includes(v))
    }

    default:
      return true
  }
}

export function AdvancedFilter<TData>({ table }: AdvancedFilterProps<TData>) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterCondition[]>([])

  const filterableColumns = useMemo(() => {
    return table.getAllColumns().filter((col) => col.getCanFilter() && col.id !== "actions")
  }, [table])

  useEffect(() => {
    const filtersByColumn = filters.reduce(
      (acc, filter) => {
        if (!acc[filter.columnId]) acc[filter.columnId] = []
        acc[filter.columnId].push(filter)
        return acc
      },
      {} as Record<string, FilterCondition[]>,
    )

    filterableColumns.forEach((column) => {
      const columnFilters = filtersByColumn[column.id]

      if (!columnFilters || columnFilters.length === 0) {
        column.setFilterValue(undefined)
      } else {
        const meta = column.columnDef.meta as FilterMeta | undefined
        const filterType = meta?.filter_type || "text"

        column.setFilterValue({
          filters: columnFilters,
          filterType,
          matchFn: (cellValue: unknown) => {
            return columnFilters.every((filter) => matchesFilter(cellValue, filter.operator, filter.value, filterType))
          },
        })
      }
    })
  }, [filters, filterableColumns])

  const addFilter = () => {
    if (filterableColumns.length === 0) return

    const firstColumn = filterableColumns[0]
    const meta = firstColumn.columnDef.meta as FilterMeta | undefined
    const filterType = meta?.filter_type || "text"

    setFilters([
      ...filters,
      {
        id: crypto.randomUUID(),
        columnId: firstColumn.id,
        operator: OPERATORS[filterType][0].value,
        value: "",
      },
    ])
  }

  const removeFilter = (id: string) => {
    setFilters(filters.filter((f) => f.id !== id))
  }

  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(
      filters.map((f) => {
        if (f.id !== id) return f

        if (updates.columnId && updates.columnId !== f.columnId) {
          const column = filterableColumns.find((c) => c.id === updates.columnId)
          const meta = column?.columnDef.meta as FilterMeta | undefined
          const filterType = meta?.filter_type || "text"
          return {
            ...f,
            columnId: updates.columnId,
            operator: OPERATORS[filterType][0].value,
            value: "",
          }
        }

        return { ...f, ...updates }
      }),
    )
  }

  const clearFilters = () => {
    setFilters([])
  }

  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsOpen(!isOpen)} className="gap-2 cursor-pointer">
          <Filter className="w-4 h-4" />
          Advanced Filters
          {filters.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded">
              {filters.length}
            </span>
          )}
        </Button>

        {filters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2 cursor-pointer">
            <X className="w-4 h-4" />
            Clear
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="flex flex-col items-start border rounded-lg p-4 space-y-3 mt-2 bg-muted/30">
          {filters.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active filters. Click "Add Filter" to start.</p>
          ) : (
            filters.map((filter) => (
              <FilterRow
                key={filter.id}
                filter={filter}
                columns={filterableColumns}
                onUpdate={updateFilter}
                onRemove={removeFilter}
              />
            ))
          )}

          <Button variant="outline" size="sm" onClick={addFilter} className="gap-2 bg-transparent cursor-pointer">
            <Plus className="w-4 h-4" />
            Add Filter
          </Button>
        </div>
      )}
    </div>
  )
}

interface FilterRowProps<TData> {
  filter: FilterCondition
  columns: Column<TData, unknown>[]
  onUpdate: (id: string, updates: Partial<FilterCondition>) => void
  onRemove: (id: string) => void
}

function FilterRow<TData>({ filter, columns, onUpdate, onRemove }: FilterRowProps<TData>) {
  const column = columns.find((c) => c.id === filter.columnId)
  const meta = column?.columnDef.meta as FilterMeta | undefined
  const filterType = meta?.filter_type || "text"
  const operators = OPERATORS[filterType]

  const isInputDisabled = filter.operator === "isEmpty" || filter.operator === "isNotEmpty"

  return (
    <div className="flex items-start gap-2 flex-wrap">
      <Select value={filter.columnId} onValueChange={(value) => onUpdate(filter.id, { columnId: value })}>
        <SelectTrigger className="w-[160px] cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {columns.map((col) => (
            <SelectItem key={col.id} value={col.id}>
              {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filter.operator} onValueChange={(value) => onUpdate(filter.id, { operator: value })}>
        <SelectTrigger className="w-[140px] cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <FilterValueInput
        filterType={filterType}
        value={filter.value}
        options={meta?.options}
        onChange={(value) => onUpdate(filter.id, { value })}
        isDisabled={isInputDisabled}
      />

      <Button variant="ghost" size="sm" onClick={() => onRemove(filter.id)} className="h-9 px-2">
        <X className="w-4 h-4" />
      </Button>
    </div>
  )
}

interface FilterValueInputProps {
  filterType: FilterType
  value: string | number | boolean | string[] | unknown
  options?: Array<{ label: string; value: string }>
  onChange: (value: string | number | boolean | string[] | unknown) => void
  isDisabled?: boolean
}

function FilterValueInput({ filterType, value, options, onChange, isDisabled }: FilterValueInputProps) {
  switch (filterType) {
    case "text": {
      return (
        <Input
          type="text"
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter text..."
          className="w-[200px]"
          disabled={isDisabled}
        />
      )
    }

    case "number": {
      return (
        <Input
          type="number"
          value={typeof value === "number" ? value : (value as string) || ""}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
          placeholder="Enter number..."
          className="w-[150px]"
          disabled={isDisabled}
        />
      )
    }

    case "range": {
      const [min = "", max = ""] = Array.isArray(value) ? value : []
      return (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={min}
            onChange={(e) => onChange([e.target.value ? Number(e.target.value) : "", max])}
            placeholder="Min"
            className="w-[90px]"
            disabled={isDisabled}
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="number"
            value={max}
            onChange={(e) => onChange([min, e.target.value ? Number(e.target.value) : ""])}
            placeholder="Max"
            className="w-[90px]"
            disabled={isDisabled}
          />
        </div>
      )
    }

    case "date": {
      return (
        <Input
          type="date"
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          className="w-[160px]"
          disabled={isDisabled}
        />
      )
    }

    case "dateRange": {
      const [start = "", end = ""] = Array.isArray(value) ? value : []
      return (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={String(start)}
            onChange={(e) => onChange([e.target.value, end])}
            className="w-[140px]"
            disabled={isDisabled}
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            value={String(end)}
            onChange={(e) => onChange([start, e.target.value])}
            className="w-[140px]"
            disabled={isDisabled}
          />
        </div>
      )
    }

    case "boolean": {
      return (
        <Select
          value={value === true ? "true" : value === false ? "false" : ""}
          onValueChange={(v) => onChange(v === "true")}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    case "select": {
      return (
        <Select value={String(value || "")} onValueChange={onChange} disabled={isDisabled}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {options?.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    case "multiSelect": {
      const selected = value ? String(value).split(",").filter(Boolean) : []
      return (
        <div className="flex flex-wrap gap-1.5 p-2 border rounded-md bg-background w-[280px] min-h-[36px]">
          {options?.map((opt) => {
            const isSelected = selected.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const newSelected = isSelected ? selected.filter((v) => v !== opt.value) : [...selected, opt.value]
                  onChange(newSelected.join(","))
                }}
                className={cn(
                  "px-2 py-0.5 text-xs rounded transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80",
                )}
                disabled={isDisabled}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )
    }

    default:
      return null
  }
}
