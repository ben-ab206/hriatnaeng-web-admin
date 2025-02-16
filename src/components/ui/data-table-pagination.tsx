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
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange?.(pagingData!.page - 1)}
            // disabled={pagingData!.page == 1}
            disabled={pagingData!.page <= 1}
          >
            <ChevronLeft />
          </Button>
          <Button 
            variant="default" 
            className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-sm"
          >
            {pagingData!.page}
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              console.log("Next Page Clicked", pagingData!.page + 1);
              onPageChange?.(pagingData!.page + 1);
            }}
            // disabled={pagingData!.total < pagingData!.page * pagingData!.size}
            disabled={pagingData!.page >= Math.ceil(pagingData!.total / pagingData!.size)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <Select
        value={String(pagingData?.size)}
        onValueChange={(value) => {
          onSelectChange?.(Number(value));
        }}
      >
        <SelectTrigger className="h-8 w-[120px]">
          {/* <SelectValue placeholder={table.getState().pagination.pageSize} /> */}
          <SelectValue>{pagingData?.size} / page</SelectValue>
        </SelectTrigger>
        <SelectContent side="bottom">
          {[10, 25, 50, 100].map((pageSize) => (
            // <SelectItem key={pageSize} value={`${pageSize}`} className="hover:bg-blue-200">
            //   {pageSize} / page
            // </SelectItem>
            <SelectItem key={pageSize} value={String(pageSize)} className="hover:bg-blue-200">
          {pageSize} / page
        </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
