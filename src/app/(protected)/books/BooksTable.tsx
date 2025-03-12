"use client";

import { Book } from "@/@types/book";
import { PagingData } from "@/@types/paging-data";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Edit2Icon, EyeIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";

interface BooksTableProps {
  data: Book[];
  isLoading: boolean;
  pagingData: PagingData;
  onEdit?: (v: Book) => void;
  onDelete?: (v: Book) => void;
  onView?: (v: Book) => void;
  onChangePublished: (v: Book) => void;
  onPageChange: (v: number) => void;
  onSelectChange: (v: number) => void;
}

const BooksTable = ({
  data,
  isLoading,
  pagingData,
  onEdit,
  onView,
  onDelete,
  onChangePublished,
  onPageChange,
  onSelectChange,
}: BooksTableProps) => {
  const ActionColumn = ({
    onEdit,
    onDelete,
    onView,
  }: {
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
  }) => {
    return (
      <div className="flex flex-row space-x-3 items-center">
        <button onClick={onEdit} className="hover:bg-gray-200 rounded-full p-1">
          <Edit2Icon className="h-4 w-4 text-gray-800" />
        </button>
        <button
          onClick={onDelete}
          className="hover:bg-gray-200 rounded-full p-1"
        >
          <Trash2Icon className="h-4 w-4" />
        </button>
        <button onClick={onView} className="hover:bg-gray-200 rounded-full p-1">
          <EyeIcon className="h-4 w-4 text-gray-800" />
        </button>
      </div>
    );
  };

  const columns: ColumnDef<Book>[] = useMemo(
    () => [
      {
        header: "No",
        cell: (props) => {
          return props.row.index + 1 + (pagingData.page - 1) * pagingData.size;
        },
      },
      {
        header: "Title",
        cell: (info) => {
          const book = info.row.original as Book;
          return (
            <div className="flex items-center">
              {book.cover_path ? (
                <div className="w-10 h-[60px] mr-2">
                  <img
                    src={book.cover_path}
                    className="object-cover w-full h-full rounded-md h-[40px] w-[40px]"
                    alt="Movie Poster"
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center w-10 h-[60px] mr-2 border border-gray-600`}
                >
                  <span className="flex items-center justify-center text-white object-cover w-full h-full rounded-md">
                    {book.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span>{book.title}</span>
            </div>
          );
        },
      },
      {
        header: "Authors",
        cell: ({ row }) => {
          return row.original.authors
            ? row.original.authors.map((a) => a.name).join(", ")
            : "-";
        },
      },
      {
        header: "Categories",
        cell: ({ row }) => {
          return row.original.categories
            ? row.original.categories.map((c) => c.name).join(", ")
            : "-";
        },
      },
      {
        header: "Published",
        cell: ({ row }) => (
          <Switch
            checked={row.original.published}
            onCheckedChange={() => onChangePublished(row.original)}
          />
        ),
      },
      {
        header: "Added Date",
        cell: ({ row }) =>
          format(row.original.created_at, "dd-MM-yyyy hh:mm a"),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <ActionColumn
            onDelete={() => onDelete?.(row.original)}
            onEdit={() => onEdit?.(row.original)}
            onView={() => onView?.(row.original)}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        loading={isLoading}
        data={data}
        pagingData={pagingData}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
        // onSort={onSort}
      />
    </>
  );
};

export default BooksTable;
