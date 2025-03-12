import { BookContents } from "./book_content";

export interface Audios {
  id: number;
  name: string;
  description?: string;
  file_path: string;
  book_contents?: BookContents[];
}
