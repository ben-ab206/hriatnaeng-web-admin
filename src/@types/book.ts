import { Audios } from "./audios";
import { BookContents } from "./book_content";
import { Category } from "./category";
import { ContentType } from "./content-type";
import { LanguageType } from "./language";
import { People } from "./people";
import { PriceModel } from "./price-model";
import { Status } from "./status";

export interface BookFile {
  id?: string;
  file_path: string;
}

export interface AudioFile {
  id?: string;
  file_path: string;
}

export type Book = {
  id: number;
  title: string;
  about?: string;
  published: boolean;
  read_duration?: number;
  cover_path: string;
  background_color?: string;
  status: Status;
  language?: LanguageType;
  content_type: ContentType;
  subtitle?: string;
  price_model: PriceModel;
  updated_at: string;
  created_at: string;
  created_by: number;
  updated_by?: number;
  categories?: Category[];
  translators?: People[];
  authors?: People[];
  book_contents?: BookContents[];
  audios?: Audios[];
};
