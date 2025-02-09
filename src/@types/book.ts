import { ContentType } from "./content-type";
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
  title_mizo?: string;
  published_date?: string;
  about?: string;
  about_mizo?: string;
  read_duration?: number;
  cover_path: string;
  background_color?: string;
  release_date?: string;
  status: Status;
  content_type: ContentType;
  book_file?: BookFile;
  audio_file?: AudioFile;
  subtitle?: string;
  price_model: PriceModel;
  subtitle_mizo?: string;
  updated_at: string;
  created_at: string;
  created_by: number;
  updated_by?: number;
};
