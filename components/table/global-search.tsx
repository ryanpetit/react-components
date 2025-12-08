import { type Table } from "@tanstack/react-table";

interface DataTableSearchProps<TData> {
    table: Table<TData>
}

export function GlobalSearch<TData>({ table }: Readonly<DataTableSearchProps<TData>>) {
    return (
        <div className="flex items-center py-4">
            <input
                placeholder="Search ..."
                value={table.getState().globalFilter ?? ''}
                onChange={(event) =>
                    table.setGlobalFilter(String(event.target.value))
                }
                className="bg-transparent opacity-50 focus:border-0 focus:border-transparent focus:outline-none rounded-md h-10"
            />
        </div>
    )
}