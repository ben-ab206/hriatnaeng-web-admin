"use client";

import { useRouter } from "next/navigation";
import BooksViewHeader from "./_components/BooksViewHeader";

const BooksView = () => {
  const router = useRouter();
  return (
    <div className="space-y-5">
      <BooksViewHeader onClickAddNew={() => router.push("books/add-new")} />
    </div>
  );
};

export default BooksView;
