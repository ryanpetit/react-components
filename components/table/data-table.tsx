"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type VisibilityState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Pagination from "./data-table-pagination"
import { ArrowUpDown, RefreshCcw, Settings2 } from "lucide-react"
import { useState, useMemo } from "react"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { GlobalSearch } from "./global-search"
import { AdvancedFilter } from "./advanced-filter"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pagination?: boolean
  initial_page_size?: number
  column_visibility?: boolean
  global_search?: boolean
  advanced_filter?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initial_page_size = 10,
  pagination = true,
  column_visibility = false,
  global_search = true,
  advanced_filter = false,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const enhancedColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      filterFn:
        col.filterFn ||
        ((row, columnId, filterValue) => {
          if (!filterValue) return true
          if (typeof filterValue === "object" && filterValue.matchFn) {
            return filterValue.matchFn(row.getValue(columnId))
          }
          return true
        }),
    }))
  }, [columns])

  const table = useReactTable({
    data,
    columns: enhancedColumns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: { globalFilter, columnVisibility },
    initialState: { pagination: { pageSize: initial_page_size } },
  })

  return (
    <div className="w-full h-full flex flex-col justify p-5 rounded-md flex-1">
      {global_search && <GlobalSearch table={table} />}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          {advanced_filter && <AdvancedFilter table={table} />}
          {column_visibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-auto cursor-pointer bg-transparent">
                  <Settings2 />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="outline"
            size="sm"
            className="hover:cursor-pointer bg-transparent"
            onClick={() => {
              table.reset()
              table.resetColumnFilters()
              table.resetColumnVisibility()
            }}
          >
            <RefreshCcw />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-bold">
                    <div className="flex align-center">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <button className="ml-2" onClick={header.column.getToggleSortingHandler()}>
                          <ArrowUpDown className="w-5 h-5 hover:cursor-pointer" />
                        </button>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"} className="border-0 text-left">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {pagination && (
        <Pagination
          table={table}
          selected_rows={table.getFilteredSelectedRowModel().rows.length}
          PaginateList={pagination}
          initialPageSize={initial_page_size}
        />
      )}
    </div>
  )
}
