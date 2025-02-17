import { Book } from "./book";
import { Podcast } from "./podcast";

export type Collection = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  status: string;
  books?: Book[];
  podcasts?: Podcast[];
  type: string;
  created_by: number;
  updated_by?: number;
};

export type ContentCollectionRelation = {
  id: number;
  book_id?: number;
  podcast_id?: number;
  collection_id?: number;
};
