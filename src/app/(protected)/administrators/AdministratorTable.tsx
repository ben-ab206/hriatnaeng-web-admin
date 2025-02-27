import { User } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/data-table";
import { PagingData } from "@/@types/paging-data";
import { formatRole } from "@/lib/utils";
import { format } from "date-fns";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import classNames from "classnames";

interface AdministratorTableProps {
  pagingData: PagingData;
  loading?: boolean;
  data: User[];
  onPageChange?: (value: number) => void;
  onSelectChange?: (value: number) => void;
  onEdit: (row: User) => void;
  onDelete: (row: User) => void;
}

const AdministratorTable = ({
  pagingData,
  onPageChange,
  onSelectChange,
  loading = false,
  data,
  onEdit,
  onDelete,
}: AdministratorTableProps) => {
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
        <button
          onClick={onDelete}
          className="hover:bg-gray-200 rounded-full p-1"
        >
          <Trash2Icon className="h-4 w-4 text-red-500" />
        </button>
      </div>
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "No.",
      cell: ({ row }) =>
        row.index + 1 + (pagingData.page - 1) * pagingData.size,
    },
    {
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    {
      header: "Joined Date",
      cell: ({ row }) => format(row.original.created_at, "dd-MM-yyyy hh:mm a"),
    },
    {
      header: "Email",
      cell: ({ row }) => row.original.email ?? "-",
    },
    {
      header: "Role",
      cell: ({ row }) => formatRole(row.original.roles?.name ?? ""),
    },
    {
      header: "Status",
      cell: ({ row }) => (
        <span
          className={classNames({
            "text-red-500": !row.original.is_active,
            "text-green-500": row.original.is_active,
          })}
        >
          {row.original.is_active ? "Active" : "Deactivated"}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <ActionColumn
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ];

  return (
    <div>
      <DataTable
        data={data}
        loading={loading}
        columns={columns}
        pagingData={pagingData}
        onPageChange={onPageChange!}
        onSelectChange={onSelectChange!}
      />
    </div>
  );
};

export default AdministratorTable;
