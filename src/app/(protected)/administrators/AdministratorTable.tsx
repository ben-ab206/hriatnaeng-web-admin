import { User } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
import { PagingData } from "./StaticTypes";
import { DeleteIcon, EditIcon } from "lucide-react";
import { DataTable } from "./components/data-table";

interface AdministratorTableProps {
  pagingData: PagingData;
  loading?: boolean;
  data: User[];
  onPageChange?: () => void;
  onSelectChange?: () => void;
}

const AdministratorTable = ({
  pagingData,
  loading = false,
  data,
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
        <button onClick={onEdit}>
          <EditIcon />
        </button>
        <button onClick={onDelete}>
          <DeleteIcon />
        </button>
      </div>
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      header: "No.",
      cell: ({ row }) =>
        row.index + 1 + (pagingData.pageIndex - 1) * pagingData.pageSize,
    },
    {
      header: "Name",
      cell: ({ row }) => row.original.name,
    },
    { header: "Joined Date", cell: ({ row }) => row.original.created_at },
    {
      header: "Email",
      cell: ({ row }) => row.original.email ?? "-",
    },
    {
      header: "Role",
      cell: ({ row }) => row.original.roles?.name ?? "",
    },
    {
      header: "Actions",
      cell: ({ row }) => <ActionColumn onEdit={() => {}} onDelete={() => {}} />,
    },
  ];

  return (
    <div>
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default AdministratorTable;
