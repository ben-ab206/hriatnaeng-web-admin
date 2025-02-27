import { ImageFile } from "@/@types/image-file";

export interface FormModel {
  id: number;
  name: string;
  phone_number?: string;
  profile_path?: string;
  profile_images?: ImageFile[];
}
