import { Category } from "@/@types/category";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "../../../components/ui/data-table";  
import { PagingData } from "@/@types/paging-data";  
import Image from 'next/image'
import { useMemo } from "react";
import { api } from "@/trpc/client";
import { OnSortParam } from "@/@types/sort-params";

interface CategoryTableProps {
    pagingData: PagingData;
    loading?: boolean;
    data: Category[];
    onPageChange?: (value: number) => void;
    onSelectChange?: (value: number) => void;
    onEdit: (row: Category) => void;
    onDelete: (row: Category) => void;
    onSort: (v: OnSortParam) => void
}

const CategoryTable = ({
    pagingData,
    onPageChange,
    onSelectChange,
    loading = false,
    data,
    onEdit,
    onDelete,
    onSort,
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

    const { data: categoryList = [] } = api.categories.getAllCAtegories.useQuery();

    const columns: ColumnDef<Category>[] = useMemo(
        () => [
            {
                header: 'No.',
                cell: (props) => {
                    return props.row.index + 1 +  (((pagingData.page ?? 1) - 1) * (pagingData.size ?? 1 ))
                },
            },
            {
                header: 'Image',
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
                    </div>
                ),
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <div className="flex flex-row space-x-4 items-center">
                        <span>{row.original.name}</span>                    
                    </div>
                ),
                enableSorting: true
            },
            {
                header: 'Parent',
                cell: ({ row }: { row: { original: Category } }) => {
                    const parentCategory = categoryList.find((c: Category) => c.id == row.original.parent_id);
                
                    return <span>{parentCategory?.name ? parentCategory.name : "-"}</span>;
                },
                
            },
            {
                header: "Qty",
                cell: ({ row }) => {
                    const { data: categoryQty } = api.categories.getQty.useQuery(
                        { id: row.original.id },
                    );
            
                    return <span>{categoryQty}</span>; // Show 0 if undefined
                },
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
        ],
        [categoryList, pagingData, onEdit, onDelete]
    );

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                onPageChange={onPageChange}
                onSelectChange={onSelectChange}
                pagingData={pagingData}
                onSort={onSort}
            />
        </>
    );
};

export default CategoryTable;