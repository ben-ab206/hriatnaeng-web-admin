import { Book } from "./book";
import { Podcast } from "./podcast";

export type TopBanner = {
  id?: number;
  page: string;
  order_number?: number;
  book_id?: number;
  podcast_id?: number;
  books?: Book;
  podcasts?: Podcast;
  created_at?: string;
  updated_at?: string;
  created_by?: number;
  updated_by?: number;
};