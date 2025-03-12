import { ContentType } from "@/@types/content-type";
import { PriceModel } from "@/@types/price-model";
import { z } from "zod";
import { ImageFile } from "@/@types/image-file";
import { Option } from "@/@types/option";
import { LanguageType } from "@/@types/language";

export interface InformationFormModel {
  id?: number;
  title: string;
  published: boolean;
  language?: LanguageType;
  about?: string;
  read_duration?: number;
  cover_path?: string;
  translator?: Option[];
  author?: Option[];
  categories?: Option[];
  background_color?: string;
  content_type?: ContentType;
  subtitle: string;
  price_model: PriceModel;
  cover_image?: ImageFile[];
}

export interface BookContentModel {
  id?: number | string;
  label: string;
  title: string;
  content: string;
  start_time: string;
}

export interface AudioContentModel {
  id?: number | string;
  name: string;
  file_path?: string;
  audio_file?: File;
  content_data: BookContentModel[];
}

const audioContentSchema = z.object({
  id: z.number().optional(),
  label: z.string().min(1, { message: "label is required" }),
  title: z.string().min(1, { message: "title is required" }),
  content: z.string().min(1, { message: "content is required" }),
});

const bookFormSchema = z.object({
  title: z.string().min(1, { message: "Book title is required" }),
  subtitle: z.string().min(1, { message: "Subtitle is required" }),
  price_model: z.string().min(1, { message: "Price model is required" }),
});

const audioFileContentSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  label: z.string().min(1, { message: "label is required" }),
  title: z.string().min(1, { message: "title is required" }),
  content: z.string().min(1, { message: "content is required" }),
  start_time: z.string().min(1, "start_time is required"),
});

const audioFileSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string().min(1, "Narrator is required."),
    file_path: z.string().optional(),
    audio_file: z
      .instanceof(File, { message: "Audio file is required" })
      .refine(
        (file) => file.type === "audio/mpeg" || file.type === "audio/mp3",
        {
          message: "File must be an MP3 audio file",
        }
      )
      .optional()
      .nullable(),
    content_data: z
      .array(audioFileContentSchema)
      .min(1, { message: "At least one content item is required" }),
  })
  .refine(
    (data) => {
      // Either file_path or audio_file must be present
      return !!data.file_path || !!data.audio_file;
    },
    {
      message: "Either an audio file or file path must be provided",
      path: ["audio_file"], // This will show the error on the audio_file field
    }
  );

export const LanguageTabsData = ["Mizo", "English", "Burmese"];

export const bookFormTabs = ["Information", "Content", "Audio"];

export { bookFormSchema, audioContentSchema, audioFileSchema };
