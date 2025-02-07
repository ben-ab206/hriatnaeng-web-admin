import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PagingData } from "@/@types/paging-data";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pagingData?: PagingData;
  onPageChange?: (value: number) => void;
  onSelectChange?: (value: number) => void;
}

export function DataTablePagination<TData>({
  table,
  pagingData,
  onPageChange,
  onSelectChange,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => {
          onSelectChange?.(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[120px]">
          <SelectValue placeholder={table.getState().pagination.pageSize} />
        </SelectTrigger>
        <SelectContent side="bottom">
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-blue-200">
              {pageSize} / page
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange?.(pagingData!.page - 1)}
            disabled={pagingData!.page == 1}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange?.(pagingData!.page + 1)}
            disabled={pagingData!.total < pagingData!.page * pagingData!.size}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
