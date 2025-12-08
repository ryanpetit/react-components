"use client"

import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemo } from "react"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  selected_rows: number
  PaginateList?: boolean
  initialPageSize?: number
}

export default function Pagination<TData>({
  table,
  selected_rows,
  PaginateList,
  initialPageSize = 10,
}: Readonly<DataTablePaginationProps<TData>>) {
  const currentPageSize = table.getState().pagination.pageSize
  const defaultOptions = [10, 20, 50, 100]

  const pageSizeOptions = useMemo(() => {
    const customSizes = new Set(defaultOptions)

    // Add current page size
    customSizes.add(currentPageSize)

    // Always add initial page size if it's not a default
    if (!defaultOptions.includes(initialPageSize)) {
      customSizes.add(initialPageSize)
    }

    return Array.from(customSizes).sort((a, b) => a - b)
  }, [currentPageSize, initialPageSize])

  return (
    <div className="flex justify-between items-center mt-5">
      <div className="relative flex items-center">
        <div className="flex justify-center items-center gap-2">
          {PaginateList && (
            <div className="relative">
              <Select
                value={`${currentPageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger
                  className="h-8 w-20 border-0 shadow-none cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  size="sm"
                >
                  <SelectValue placeholder={currentPageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div>Total: {table.getFilteredRowModel().rows.length}</div>
        </div>
        {selected_rows > 0 && (
          <div className="flex font-light">
            <div className="pl-5">
              {selected_rows} of {table.getState().pagination.pageSize} row(s) selected
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center pr-5 gap-2">
        {table.getState().pagination.pageIndex + 1 > 1 ? (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="p-1 hover:cursor-pointer text-primary border-0 shadow-none bg-transparent"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.setPageIndex(0)}
            >
              <ChevronsLeft className="w-6 h-6 p-0" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1 hover:cursor-pointer text-primary border-0 shadow-none bg-transparent"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              <ChevronLeft className="w-5 h-5 p-0" />
            </Button>
          </div>
        ) : (
          <div className="w-[24px] h-[24px]"></div>
        )}

        <div>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>

        {table.getState().pagination.pageIndex + 1 < table.getPageCount() ? (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              className="p-1 hover:cursor-pointer text-primary border-0 shadow-none bg-transparent"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              <ChevronRight className="w-5 h-5 p-0" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="p-1 hover:cursor-pointer text-primary border-0 shadow-none bg-transparent"
              disabled={!table.getCanNextPage()}
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              <ChevronsRight className="w-6 h-6 p-0" />
            </Button>
          </div>
        ) : (
          <div className="w-[24px] h-[24px]"></div>
        )}
      </div>
    </div>
  )
}
