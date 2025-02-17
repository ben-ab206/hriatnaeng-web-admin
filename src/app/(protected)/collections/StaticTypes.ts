export interface FormItem {
  id: number;
  title: string;
  image_path?: string;
  type: "book" | "podcast";
}

export type FormModel = {
  id?: number;
  name: string;
  items?: FormItem[];
};

