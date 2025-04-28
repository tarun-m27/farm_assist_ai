"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconCircleCheckFilled,
  IconGripVertical,
  IconLoader,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
})

function DragHandle({ id }: { id: number }) {
  const { attributes } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
  },
  {
    id: "select",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "header",
    header: "Users",
    cell: ({ row }) => (
      <div className="text-base">
        {row.original.header}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "type",
    header: "User Type",
    cell: ({ row }) => (
      <div className="text-base">
        {row.original.type}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Total API Calls",
    cell: ({ row }) => (
      <div className="text-base flex items-center gap-1">
        {row.original.status === "Done" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-4" />
        ) : (
          <IconLoader className="size-4" />
        )}
        {row.original.status}
      </div>
    ),
  },
  {
    accessorKey: "target",
    header: () => <div>Remaining API</div>,
    cell: ({ row }) => (
      <form>
        <Label htmlFor={`${row.original.id}-target`} className="sr-only">
          Remaining API
        </Label>
        <Input
          className="text-base h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.target}
          id={`${row.original.id}-target`}
        />
      </form>
    ),
  },
  {
    accessorKey: "limit",
    header: () => <div>Last Request</div>,
    cell: ({ row }) => (
      <form>
        <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
          Last Request
        </Label>
        <Input
          className="text-base h-8 w-28 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.limit}
          id={`${row.original.id}-limit`}
        />
      </form>
    ),
  },
]

function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable() {
  const [data, setData] = React.useState<z.infer<typeof schema>[]>([])
  const [rowSelection] = React.useState({})
  const [columnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting] = React.useState<SortingState>([])
  const [pagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8000/api/admin/userDetails", {
          method: "GET", // Assuming GET method; adjust if different
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken") || ""}`, // Send jwtToken as Bearer Token
          },
        });
        const result = await response.json()
        if (result.status === "success") {
          const mappedData = result.userData.map((item: any, index: number) => ({
            id: index,
            header: item["User"],
            type: item["User Type"],
            status: item["Total API Calls"].toString(),
            target: item["Remaining API Calls"].toString(),
            limit: item["Last Request"],
          }))
          setData(mappedData)
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error)
      }
    }
    fetchData()
  }, [])

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="px-4 lg:px-6">
      <h1 className="text-3xl font-bold mb-6">User Management Table</h1>
      <div className="w-full flex-col justify-start gap-6">
        <div className="relative flex flex-col gap-4 overflow-auto">
          <div className="overflow-hidden rounded-lg border">
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex w-full items-center gap-8 lg:w-fit">
              <div className="hidden items-center gap-2 lg:flex">
                <Label htmlFor="rows-per-page" className="text-sm font-medium">
                  Rows per page
                </Label>
                <Select>
                  <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top"></SelectContent>
                </Select>
              </div>
              <div className="flex w-fit items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="ml-auto flex items-center gap-2 lg:ml-0"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}