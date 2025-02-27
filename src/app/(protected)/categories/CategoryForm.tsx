"use client";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newCategorySchema } from "@/trpc/schema/category.schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/client";
import { NewCategoryType } from "./StaticTypes";
import ImageUploader from "./_components/ImageUploader";
import { generateTimestamp } from "@/serives/common";

interface CategoryFormProps {
  isSubmitting?: boolean;
  initialData?: NewCategoryType;
  onClickSave: (values: NewCategoryType) => void;
  onClose: () => void;
}

const CategoryForm = ({
  isSubmitting = false,
  initialData,
  onClickSave,
  onClose,
}: CategoryFormProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);

  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: initialData
      ?{
        ...initialData,
        image: imageFile || undefined,
      }
      : {
          name: "",
          description: "",
          parent_id: undefined,
          created_by: undefined,
          image: undefined,
        },
  });

  const { data: categoryList = [] } = api.categories.getAllCAtegories.useQuery();

  useEffect(() => {
    if (initialData?.image) {
      setImage(initialData.image); 
    }
  }, [initialData]);

  useEffect(() => {
    if (image && image.startsWith("data:image")) {
      fetch(image)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result as string;
            setImageFile(base64data);
            form.setValue("image", base64data);
          };
        });
    } else {
      setImageFile(null);
      form.setValue("image", undefined);
    }
  }, [image, fileName, form]);
  
  
  const handleSubmit = async (values: z.infer<typeof newCategorySchema>) => {
    try {
      let imageUrl: string | undefined = undefined;

      let  filePath = ""
      if (imageFile) {
        const fileExt = fileName.split(".").pop();
        filePath = `${generateTimestamp()}.${fileExt}`;
      }

      if (!imageFile) {
        imageUrl = image ?? undefined;
      } else imageUrl = imageFile
  
      const submissionValues = {
        ...values,
        image: imageUrl, 
        filePath: filePath,
      };
  
      await onClickSave(submissionValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          {/* Image upload component */}
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormControl>
                  <ImageUploader 
                    image={image} 
                    setImage={setImage} 
                    fileName={fileName} 
                    setFileName={setFileName} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parent_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent Category</FormLabel>
                <Select
                  defaultValue={field.value ? field.value.toString() : undefined}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white">
                    {categoryList
                      .filter((c) => c.id !== initialData?.id)
                      .map((c, idx) => (
                        <SelectItem
                          value={c.id.toString()}
                          key={idx}
                          className="hover:bg-gray-100"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right mt-6">
            <Button
              type="button"
              className="mr-2 !bg-[#7C94B4] !text-[#F5F7FA] font-semibold rounded-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="!bg-[#447AED] !text-[#F5F5F5] font-semibold rounded-sm cursor-pointer"
              type="submit"
              loading={isSubmitting}
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
