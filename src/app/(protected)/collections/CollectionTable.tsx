import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { Collection } from "@/@types/collection";
import { PagingData } from "@/@types/paging-data";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2Icon, Trash2Icon } from "lucide-react";

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
    <div className="flex flex-row space-x-3 items-center">
      <button onClick={onEdit} className="hover:bg-gray-200 rounded-full p-1">
        <Edit2Icon className="h-4 w-4 text-gray-800" />
      </button>
      <button onClick={onDelete} className="hover:bg-gray-200 rounded-full p-1">
        <Trash2Icon className="h-4 w-4 text-red-500" />
      </button>
    </div>
  );
};

const CollectionTable = ({
  data,
  isLoading = false,
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
          return props.row.index + 1 + (pagingData.page - 1) * pagingData.size;
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
              onCheckedChange={() => onChangePublished(row.original)}
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
        loading={isLoading}
        pagingData={pagingData}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
        // onSort={onSort}
      />
    </>
  );
};

export default CollectionTable;
