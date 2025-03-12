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
import { newPeopleSchema } from "@/trpc/schema/people.schema";
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
import { NewPeopleType } from "./StaticTypes";
import ImageUploader from "./_components/ImageUploader";
import CustomDatePicker from "@/components/ui/datePicker";
import { generateTimestamp } from "@/lib/utils";

interface PeopleFormProps {
  isSubmitting?: boolean;
  initialData?: NewPeopleType;
  onClickSave: (values: NewPeopleType) => void;
  onClose: () => void;
}

const PeopleForm = ({
  isSubmitting = false,
  initialData,
  onClickSave,
  onClose,
}: PeopleFormProps) => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState<string | null>(null);

  // Process initial data to convert date strings to Date objects
  const processedInitialData = initialData
    ? {
        ...initialData,
        // Convert date strings to Date objects if they exist
        date_of_birth: initialData.date_of_birth ? new Date(initialData.date_of_birth) : undefined,
        date_of_death: initialData.date_of_death ? new Date(initialData.date_of_death) : undefined,
        image_path: imageFile || undefined,
      }
    : {
        name: "",
        people_role_id: undefined,
        date_of_birth: undefined,
        date_of_death: undefined,
        nationality: "",
        biography: "",
        website: "",
        email: "",
        created_by: undefined,
        image_path: undefined,
      };

  const form = useForm<z.infer<typeof newPeopleSchema>>({
    resolver: zodResolver(newPeopleSchema),
    defaultValues: processedInitialData,
  });

  const { data: people_role = [] } = api.people.getPeopleRole.useQuery();

  useEffect(() => {
    if (initialData?.image_path) {
      setImage(initialData.image_path); 
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
            form.setValue("image_path", base64data);
          };
        });
    } else {
      setImageFile(null);
      form.setValue("image_path", undefined);
    }
  }, [image, fileName, form]);
  const handleSubmit = async (values: z.infer<typeof newPeopleSchema>) => {
    try {
      let imageUrl: string | undefined = undefined;

      let filePath = "";
      if (imageFile) {
        const fileExt = fileName.split(".").pop();
        filePath = `${generateTimestamp()}.${fileExt}`;
      }

      if (!imageFile) {
        imageUrl = image ?? undefined;
      } else imageUrl = imageFile;

      const formattedDates = {
        date_of_birth: values.date_of_birth ? new Date(values.date_of_birth) : undefined,
        date_of_death: values.date_of_death ? new Date(values.date_of_death) : undefined,
      };
  
      const submissionValues = {
        ...values,
        ...formattedDates,
        image_path: imageUrl, 
        filePath: filePath,
      };
  
      await onClickSave(submissionValues);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <div >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          {/* Image upload component */}
          <FormField
            control={form.control}
            name="image_path"
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
            name="people_role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>People Role</FormLabel>
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
                    {people_role
                      // .filter((p) => p.id !== initialData?.id)
                      .map((p, idx) => (
                        <SelectItem
                          value={p.id.toString()}
                          key={idx}
                          className="hover:bg-gray-100"
                        >
                          {p.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <CustomDatePicker form={form} name="date_of_birth" label="Birthday" />
          <CustomDatePicker form={form} name="date_of_death" label="Deathday" />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="biography"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
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

export default PeopleForm;
