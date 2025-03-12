"use client";

import {
  LanguageTabs,
  LanguageTabsList,
  LanguageTabsTrigger,
} from "../../_components/LanguageTabs";
import DetailsViewHeader from "./_components/DetailsViewHeader";
import { LanguageTabsData } from "../../StaticTypes";
import { usePathname, useRouter } from "next/navigation";
import { api } from "@/trpc/client";
import InformationDetail from "./InformationDetail";
import { Loading } from "@/components/shared";
import AudioDetails from "./AudioDetails";
import ContentDetails from "./ContentDetails";

const BookDetailsView = () => {
  const pathname = usePathname();
  const navigate = useRouter();

  const id = (() => {
    const pathParts = pathname.split("/").filter(Boolean);
    return parseInt(pathParts[pathParts.length - 2]);
  })();

  const {
    data: book,
    isLoading,
    isFetching,
  } = api.books.fetchBookDetails.useQuery(id);

  return (
    <div className="space-y-5">
      <DetailsViewHeader
        onBackList={() => navigate.push("/books")}
        onEdit={() => navigate.push(`/books/${id}`)}
      />
      <Loading loading={isLoading || isFetching}>
        <LanguageTabs value={book?.language} className="space-y-4">
          <LanguageTabsList className="w-full bg-gray-100">
            {LanguageTabsData.map((lang, idx) => (
              <LanguageTabsTrigger value={lang} className="w-full" key={idx}>
                {lang}
              </LanguageTabsTrigger>
            ))}
          </LanguageTabsList>
        </LanguageTabs>
        {book ? (
          <div className="space-y-7">
            <InformationDetail book={book} />
            <AudioDetails audio={book.audios} />
            <ContentDetails contents={book.book_contents} />
          </div>
        ) : (
          <span>Book is not available for now.</span>
        )}
      </Loading>
    </div>
  );
};

export default BookDetailsView;
