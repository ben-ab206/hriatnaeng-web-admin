import { User } from "@/@types/user";
import { ColumnDef } from "@tanstack/react-table";
// import { DeleteIcon, EditIcon } from "lucide-react";
import { DataTable } from "../../../components/ui/data-table";
import { PagingData } from "@/@types/paging-data";
import { formatRole } from "@/lib/utils";
import Image from "next/image";


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
  onDelete
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
          <Image src={'/icons/edit-icon.png'} width={4} height={4} alt="edit" />
        </button>
        <button onClick={onDelete}>
          <Image src={'/icons/remove-icon.png'} width={4} height={4} alt="remove" />
        </button>
      </div>
    );
  };

  console.info(loading);

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
    { header: "Joined Date", cell: ({ row }) => row.original.created_at },
    {
      header: "Email",
      cell: ({ row }) => row.original.email ?? "-",
    },
    {
      header: "Role",
      cell: ({ row }) => formatRole(row.original.roles?.name ?? ""),
    },
    {
      header: "Actions",
      cell: ({ row }) => <ActionColumn onEdit={() => onEdit(row.original)} onDelete={() => onDelete(row.original)} />,
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
