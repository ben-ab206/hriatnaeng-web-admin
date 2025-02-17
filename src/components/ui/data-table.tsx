"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { PagingData } from "@/@types/paging-data";
import { Skeleton } from "@/components/ui/skeleton"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  pagingData?: PagingData;
  onPageChange?: (value: number) => void;
  onSelectChange?: (value: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  pagingData,
  onPageChange,
  onSelectChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-5">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead 
                    key={header.id}
                    className={`${
                        header.index == 0 &&
                        'rounded-l-[6px] '
                    } bg-[#447AED] text-white ${
                        header.index ==
                            headerGroup.headers.length -
                                1 && ' rounded-r-[6px]'
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {loading && table.getRowModel().rows?.length === 0 ? (
          // sleketon
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index} className="border-b">
              <TableCell className="w-[80px]">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
              <TableCell className="w-[140px]">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
              <TableCell className="w-[180px]">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
              <TableCell className="flex-1">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
              <TableCell className="w-[120px]">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
              <TableCell className="w-[100px]">
                <Skeleton className="w-full h-4 bg-[#EEF2FF]" />
              </TableCell>
            </TableRow>
          ))
        
          ) :  table.getRowModel().rows?.length === 0 ?  (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-gray-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) }
        </TableBody>
      </Table>
      <DataTablePagination
        pagingData={pagingData}
        table={table}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
      />
    </div>
  );
}
