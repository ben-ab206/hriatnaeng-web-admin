import { People } from "@/@types/people";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/data-table";  
import { PagingData } from "@/@types/paging-data";  
import Image from 'next/image'
import { useMemo } from "react";
import { Edit2Icon, Trash2Icon } from "lucide-react";
interface Role {
    id: number;
    name: string;
}

interface PeopleTableProps {
    pagingData: PagingData;
    loading?: boolean;
    data: People[];
    roles: Role[],
    onPageChange?: (value: number) => void;
    onSelectChange?: (value: number) => void;
    onEdit: (row: People) => void;
    onDelete: (row: People) => void;
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
const PeopleTable = ({
    pagingData,
    onPageChange,
    onSelectChange,
    roles,
    loading = false,
    data,
    onEdit,
    onDelete
}: PeopleTableProps) => {
 

    console.info(loading);

    const columns: ColumnDef<People>[] = useMemo(
        () => [
            {
                header: "No",
                cell: (props) => {
                return props.row.index + 1 + (pagingData.page - 1) * pagingData.size;
                },
            },
            {
                header: 'Name',
                cell: ({ row }) => (
                    <div className="flex flex-row space-x-4 items-center">
                        {row.original.image_path ? (
                            <Image
                                src={row.original.image_path}
                                alt="People"
                                width={30}
                                height={30}
                                className="h-10 w-10 rounded-full"
                                unoptimized 
                            />
                        ) : (
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full border border-gray-600`}
                            >
                                <span className="text-center text-black">
                                    {row.original.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span>{row.original.name}</span>                    
                    </div>
                ),
            },
            { 
                header: "Bio",
                cell: ({ row }) => row.original.biography ? row.original.biography : "-" 
            },
            { 
                header: "Nationality",
                cell: ({ row }) => row.original.nationality ? row.original.nationality : "-" 
            },
            { 
                header: "Email",
                cell: ({ row }) => row.original.email ? row.original.email : "-"
            },
            {
                header: "Roles",
                cell: ({ row }) => {
                    const role = roles.find((r) => r.id === row.original.people_role_id);
                    return role ? role.name : "-";
                }
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
    )

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                onPageChange={onPageChange}
                onSelectChange={onSelectChange}
                pagingData={pagingData}
            />
        </>
    );
};

export default PeopleTable;   