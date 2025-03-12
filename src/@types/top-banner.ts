import { Book } from "./book";
import { Podcast } from "./podcast";

export interface Image  {
    fileName: string | null,
    filePath: string | null,
}


export type TopBanner = {
  id?: number;
  page: string;
  order_number?: number;
  book_id?: number;
  podcast_id?: number;
  books?: Book;
  podcasts?: Podcast;
  image: Image;
  image_path: string;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
};