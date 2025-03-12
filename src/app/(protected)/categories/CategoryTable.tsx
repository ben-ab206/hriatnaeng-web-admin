import { Category } from "@/@types/category";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/data-table";  
import { PagingData } from "@/@types/paging-data";  
import Image from 'next/image'
import { useMemo } from "react";

interface CategoryTableProps {
    pagingData: PagingData;
    loading?: boolean;
    data: Category[];
    onPageChange?: (value: number) => void;
    onSelectChange?: (value: number) => void;
    onEdit: (row: Category) => void;
    onDelete: (row: Category) => void;
}

const CategoryTable = ({
    pagingData,
    onPageChange,
    onSelectChange,
    loading = false,
    data,
    onEdit,
    onDelete
}: CategoryTableProps) => {
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
                    <Image
                        src={'/icons/edit-icon.png'}
                        alt="edit"
                        width={20}
                        height={20}
                        unoptimized 
                    />
                </button>
                <button onClick={onDelete}>
                    <Image
                        src={'/icons/remove-icon.png'}
                        alt="remove"
                        width={20}
                        height={20}
                        unoptimized 
                    />
                </button>
            </div>
        );
    };

    console.info(loading);

    const columns: ColumnDef<Category>[] = useMemo(
        () => [
        {
            header: "No.",
            cell: ({ row }) =>
                row.index + 1 + (pagingData.page - 1) * pagingData.size,
        },
        {
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex flex-row space-x-4 items-center">
                    {row.original.image_path ? (
                        <Image
                            src={row.original.image_path}
                            alt="Category"
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
        { header: "Description", cell: ({ row }) => row.original.description },
        {
            header: "Actions",
            cell: ({ row }) => (
                <ActionColumn
                    onEdit={() => onEdit(row.original)}
                    onDelete={() => onDelete(row.original)}
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

export default CategoryTable;   