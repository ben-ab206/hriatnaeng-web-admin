import { ContentType } from "@/@types/content-type";
import { PriceModel } from "@/@types/price-model";
import { z } from "zod";
import { Option } from "@/@types/option";
import { ImageFile } from "@/@types/image-file";

export interface InformationFormModel {
  id?: number;
  title: string;
  title_mizo?: string;
  published_date?: Date;
  about?: string;
  about_mizo?: string;
  read_duration?: number;
  cover_path?: string;
  translator?: Option;
  author?: Option;
  categories?: Option[];
  background_color?: string;
  release_date?: string;
  content_type?: ContentType;
  subtitle: string;
  price_model: PriceModel;
  subtitle_mizo?: string;
  audio_content_model?: AudioContentModel[];
  cover_image?: ImageFile[]
}

export interface AudioContentModel {
  id?: number;
  label: string;
  start_time: Date;
  title: string;
  content: string;
}

const audioContentSchema = z.object({
  label: z.string().min(1, { message: "label is required"}),
  title: z.string().min(1, { message: "title is required"}),
  start_time: z.date(),
  content: z.string().min(1, { message: "content is required"})
});

const bookFormSchema = z.object({
  title: z.string().min(1, { message: "Book title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  price_model: z.string().min(1, { message: "Price model is required" }),
});

export { bookFormSchema, audioContentSchema };
