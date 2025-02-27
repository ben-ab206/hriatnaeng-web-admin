"use client";

import { Loading, StrictModeDroppable } from "@/components/shared";
import { useMemo, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { MdDragIndicator } from "react-icons/md";
import classNames from "classnames";
import { MediaSections } from "./StaticTypes";
import SectionDeleteConfirmation from "./_components/SectionDeleteConfirmation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Edit2Icon, Trash2Icon } from "lucide-react";

interface SectionsTableProps {
  data: MediaSections[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ActionColumn = ({
  row,
  onDelete,
  type,
}: {
  row: MediaSections;
  onDelete: () => void;
  type: string;
}) => {
  const navigate = useRouter();

  const onEdit = () => {
    navigate.push(`sections/${row.id}/${type}`);
  };

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

const SectionsTable = ({ data, isLoading, onRefresh }: SectionsTableProps) => {
  const [selectedSectionId, setSelectedSectionId] = useState<number>();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { mutate: updateOrderNumber } = api.sections.updateSection.useMutation({
    onSuccess: () => onRefresh(),
  });

  const onDelete = (section: MediaSections) => {
    setSelectedSectionId(section.id);
    setShowDeleteDialog(true);
  };

  const onCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedSectionId(undefined);
  };

  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...data];
    const [movedRow] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedRow);
    return newData;
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const newData = reorderData(source.index, destination.index);

    // Update order numbers for all affected items
    const updatePromises = newData.map((section, index) =>
      updateOrderNumber({ id: section.id, order_number: index })
    );

    await Promise.all(updatePromises);
  };

  const columns: ColumnDef<MediaSections>[] = useMemo(
    () => [
      {
        id: "dragger",
        header: "",
        accessorKey: "dragger",
        cell: (props) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <span {...(props as any).dragHandleProps}>
            <MdDragIndicator />
          </span>
        ),
      },
      {
        header: "No.",
        cell: (props) => {
          return props.row.index + 1;
        },
      },
      {
        header: "Name",
        cell: (props) => props.row.original.name,
      },
      { header: "Type", cell: ({ row }) => row.original.type },
      {
        header: "Qty",
        cell: ({ row }) => {
          const book_count =
            row.original.books.length > 0 ? row.original.books.length : 0;
          const podcast_count =
            row.original.podcasts.length > 0 ? row.original.podcasts.length : 0;
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
        header: "Actions",
        cell: (props) => (
          <ActionColumn
            row={props.row.original}
            type={props.row.original.type}
            onDelete={() => onDelete(props.row.original)}
          />
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <Loading loading={isLoading}>
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-[#447AED] text-white"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="bg-[#447AED]"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="table-body">
              {(provided) => (
                <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={row.index}
                      >
                        {(provided, snapshot) => {
                          const { style } = provided.draggableProps;
                          return (
                            <TableRow
                              ref={provided.innerRef}
                              className={classNames({
                                table: snapshot.isDragging,
                              })}
                              style={style}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {row.getVisibleCells().map((cell) => {
                                return (
                                  <TableCell key={cell.id}>
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                );
                              })}
                            </TableRow>
                          );
                        }}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </TableBody>
              )}
            </StrictModeDroppable>
          </DragDropContext>
        </Table>
      </Loading>
      <SectionDeleteConfirmation
        dialogOpen={showDeleteDialog}
        section_id={selectedSectionId!}
        onClose={onCloseDeleteDialog}
        onRefresh={onRefresh}
      />
    </div>
  );
};

export default SectionsTable;
