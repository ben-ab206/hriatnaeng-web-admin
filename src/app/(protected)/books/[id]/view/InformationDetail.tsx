import { Book } from "@/@types/book";

interface InformationDetailProps {
  book: Book;
}

const InformationDetail = ({ book }: InformationDetailProps) => {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-xl font-bold">Information</span>
      </div>
      <div className="grid grid-cols-2 w-full gap-5">
        <div className="space-y-4">
          <div className="flex flex-row w-full space-x-5">
            <img
              src={book.cover_path}
              className="w-[200px] h-[250px] object-cover rounded-[20px]"
              alt="cover_image"
            />
            <div className="flex flex-col space-y-3">
              <span>{book.title}</span>
              <span>{book.subtitle ?? "-"}</span>
              <span>{book.authors?.map((au) => au.name).join(", ")}</span>
              <div className="flex flex-row space-x-3">
                <div className="bg-gray-200 rounded-[10px] py-1 px-2">
                  <span>{`${
                    book.read_duration ? book.read_duration : 0
                  } mins`}</span>
                </div>
                <div className="bg-gray-200 rounded-[10px] py-1 px-2">
                  <span>{`${
                    book.book_contents ? book.book_contents.length : 0
                  } Chapters`}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-3">
            {book.categories?.map((c, idx) => (
              <div key={idx} className="bg-gray-200 rounded-[10px] py-1 px-2">
                {c.name}
              </div>
            ))}
          </div>
          <div className="flex">
            <div
              style={{ backgroundColor: book.background_color }}
              className="py-1 px-2 rounded-[10px]"
            >
              {book.background_color}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <span>About</span>
          <p>{book.about}</p>
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;
