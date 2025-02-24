import { Book } from "@/@types/book";
import { Podcast } from "@/@types/podcast";
import { Status } from "@/@types/status";

export interface SectionFormItem {
  id: number;
  title: string;
  image_path?: string;
  type: "book" | "podcast";
}

export type FormModel = {
  id?: number;
  name: string;
  items?: SectionFormItem[];
};

export type PagingData = {
  total: number;
  pageIndex: number;
  pageSize: number;
};

export type MediaSections = {
  id: number;
  name: string;
  order_number: number;
  created_at: string;
  status: Status;
  updated_at: string;
  type: string;
  books: Book[];
  podcasts: Podcast[];
};

export type MediaSectionDetails = {
  id: number;
  name: string;
  order_number: number;
  created_at: string;
  status: Status;
  type: string;
  updated_at: string;
  books: {
    book: Book;
    order_number: number;
  }[];
  podcasts: {
    podcast: Podcast;
    order_number: number;
  };
};
