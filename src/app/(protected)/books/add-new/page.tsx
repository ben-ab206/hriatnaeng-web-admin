"use client";

import BookForm from "../BookForm";

const BooksNew = () => {
  return (
    <div className="space-y-4 flex flex-col">
      <span className="text-xl font-medium">Add Book</span>
      <BookForm isSubmitting={false} onSubmit={() => {}} />
    </div>
  );
};

export default BooksNew;
