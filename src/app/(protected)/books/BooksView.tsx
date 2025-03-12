"use client";

import { useRouter } from "next/navigation";
import BooksViewHeader from "./_components/BooksViewHeader";
import BooksTable from "./BooksTable";
import { api } from "@/trpc/client";
import { PagingData } from "@/@types/paging-data";
import { useEffect, useState } from "react";
import { Book } from "@/@types/book";

const BooksView = () => {
  const navigator = useRouter();

  const {
    data: books,
    isLoading,
    refetch,
  } = api.books.fetchAllBooks.useQuery({});
  const [pagingData, setPagingData] = useState<PagingData>({
    total: 0,
    page: 1,
    size: 10,
  });

  const { mutateAsync: changePublished } =
    api.books.updatePublished.useMutation();

  const onPageChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      pageIndex: v,
    }));
  };

  const onSelectChange = (v: number) => {
    setPagingData((prev) => ({
      ...prev,
      pageSize: v,
      pageIndex: 1,
    }));
  };

  const onRefresh = () => {
    refetch();
  };

  const onEdit = (v: Book) => {
    navigator.push(`books/${v.id}`);
  };

  const onDelete = (v: Book) => {
    console.info(v);
  };

  const onView = (v: Book) => {
    navigator.push(`books/${v.id}/view`);
  };

  const onChangePublished = async (v: Book) => {
    await changePublished({
      id: v.id,
      published: !v.published,
    });
    onRefresh();
  };

  useEffect(() => {
    if (books) {
      setPagingData((prev) => ({
        ...prev,
        total: books.total ?? 0,
      }));
    }
  }, [books]);

  const router = useRouter();
  return (
    <div className="space-y-5">
      <BooksViewHeader onClickAddNew={() => router.push("books/add-new")} />
      <BooksTable
        isLoading={isLoading}
        pagingData={pagingData}
        data={books?.data ?? []}
        onChangePublished={onChangePublished}
        onPageChange={onPageChange}
        onSelectChange={onSelectChange}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </div>
  );
};

export default BooksView;
