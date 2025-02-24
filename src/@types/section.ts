import { Book } from "./book";
import { ContentType } from "./content-type";
import { Podcast } from "./podcast";
import { Status } from "./status";

export type Sections = {
  id: number;
  name: string;
  order_number: number;
  status: Status;
  content_type: ContentType;
  created_at: string;
  updated_at: string;
  type: string;
};

export type ContentSectionsRelation = {
  id: number;
  book_id?: number;
  podcast_id?: number;
  section_id: number;
  order_number: number;
  books?: Book;
  podcasts?: Podcast;
};
