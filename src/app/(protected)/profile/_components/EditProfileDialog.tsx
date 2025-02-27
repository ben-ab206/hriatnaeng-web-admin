"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUserProfileSchema } from "@/trpc/schema/admin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormModel } from "../StaticTypes";
import ImageUploader from "./ImageUploader";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";

interface EditProfileDialogProps {
  initialData: FormModel;
  dialogOpen?: boolean;
  onDialogClose: () => void;
}

const EditProfileDialog = ({
  dialogOpen = false,
  initialData,
  onDialogClose,
}: EditProfileDialogProps) => {
  const form = useForm<FormModel>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: initialData
      ? initialData
      : {
          name: "",
          phone_number: "",
          profile_path: "",
          profile_images: [],
        },
  });

  const onClickSave = (values: FormModel) => {
    console.info(values);
    onDialogClose();
  };

  return (
    <div>
      <Dialog open={dialogOpen}>
        <DialogContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onClickSave)}
              className="space-y-3"
            >
              <FormField
                control={form.control}
                name="profile_images"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-center space-x-3">
                      <FormControl>
                        <ImageUploader
                          images={field.value}
                          onChange={field.onChange}
                          containerClassName="h-[100px] w-[100px] rounded-full"
                        />
                      </FormControl>
                    </div>
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
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        prefix={<PhoneIcon className="size-4 text-gray-500" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-row space-x-2 justify-end">
                <Button
                  type="button"
                  className="bg-gray-600"
                  onClick={onDialogClose}
                >
                  Cancel
                </Button>
                <Button loading={false} type="submit" className="text-white">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditProfileDialog;
