"use client";

import { Book } from "@/@types/book";
import { PagingData } from "@/@types/paging-data";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useMemo } from "react";

interface BooksTableProps {
  data: Book[];
  isLoading: boolean;
  pagingData: PagingData;
  onEdit: (v: Book) => void;
  onDelete: (v: Book) => void;
  onChangePublished: (v: Book) => void;
  onPageChange: (v: number) => void;
  onSelectChange: (v: number) => void;
}

const BooksTable = ({
  data,
  isLoading,
  pagingData,
//   onEdit,
//   onDelete,
//   onChangePublished,
  onPageChange,
  onSelectChange,
}: BooksTableProps) => {
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
                  <Image
                    src={book.cover_path}
                    className="object-cover w-full h-full rounded-md"
                    alt="Movie Poster"
                    width={20}
                    height={20}
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
