import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { Collection } from "@/@types/collection";
import { PagingData } from "@/@types/paging-data";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

interface CollectionTableProps {
  data: Collection[];
  isLoading: boolean;
  pagingData: PagingData;
  onEdit: (v: Collection) => void;
  onDelete: (v: Collection) => void;
  onChangePublished: (v: Collection) => void;
  onPageChange: (v: number) => void;
  onSelectChange: (v: number) => void;
  // onSort?: (v: OnSortParam) => void
}

const ActionColumn = ({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="flex justify-start space-x-4">
      <button onClick={onEdit}>
        <Image alt="edit" src={"/icons/edit-icon.png"} className="h-4 w-4" />
      </button>
      <span
        className="cursor-pointer px-2 hover:text-red-500"
        onClick={onDelete}
      >
        <Image alt="delete" src={"/icons/delete-icon.png"} className="h-4 w-4" />
      </span>
    </div>
  );
};

const CollectionTable = ({
  data,
//   isLoading,
  pagingData,
  onChangePublished,
  onEdit,
  onDelete,
  onPageChange,
  onSelectChange,
}: // onSort,
CollectionTableProps) => {

  const columns: ColumnDef<Collection>[] = useMemo(
    () => [
      {
        header: "No",
        cell: (props) => {
          return (
            props.row.index +
            1 +
            (pagingData.page - 1) * pagingData.size
          );
        },
      },
      {
        header: "Name",
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        header: "Type",
        cell: ({ row }) => <span>{row.original.type}</span>,
      },
      {
        header: "Qty",
        cell: ({ row }) => {
          const book_count =
            row.original.books!.length > 0 ? row.original.books!.length : 0;
          const podcast_count =
            row.original.podcasts!.length > 0
              ? row.original.podcasts!.length
              : 0;
          return <span>{podcast_count + book_count}</span>;
        },
      },
      {
        header: "Items",
        cell: ({ row }) => {
          if (row.original.type === "book") {
            const titleList = Array.isArray(row.original.books)
              ? row.original.books
                  .filter((m) => m && m.title)
                  .map((m) => m.title)
              : [];
            return (
              <span>{titleList.length > 0 ? titleList.join(", ") : "-"}</span>
            );
          } else {
            const titleList = Array.isArray(row.original.podcasts)
              ? row.original.podcasts
                  .filter((m) => m && m.title)
                  .map((m) => m.title)
              : [];
            return (
              <span>{titleList.length > 0 ? titleList.join(", ") : "-"}</span>
            );
          }
        },
      },
      {
        header: "Published",
        cell: ({ row }) => {
          return (
            <Switch
              checked={row.original.status === "Published"}
              color="green-500"
              onChange={() => onChangePublished(row.original)}
            />
          );
        },
      },

      {
        header: "Action",
        cell: (props) => (
          <ActionColumn
            onEdit={() => onEdit(props.row.original)}
            onDelete={() => onDelete(props.row.original)}
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
        data={data}
        pagingData={pagingData}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
        // onSort={onSort}
      />
    </>
  );
};

export default CollectionTable;
