"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StickyFooter } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { FormModel } from "./StaticTypes";
import FormContentItems from "./_components/FormContentItems";

type CollectionFormProps = {
  category: string;
  isSubmitting?: boolean;
  initialData?: FormModel;
  onDiscard?: () => void;
  onDelete?: () => void;
  onFormSubmit: (formData: FormModel) => void;
};

const CollectionForm = ({
  category,
  onDiscard,
  isSubmitting = false,
  // onDelete,
  onFormSubmit,
  initialData,
}: CollectionFormProps) => {
  const form = useForm<FormModel>({
    resolver: zodResolver(
      z.object({
        id: z.number().optional(),
        name: z.string().min(1, { message: "name is required." }),
        items: z.array(z.any()).default([]),
      })
    ),
    defaultValues: initialData ?? {
      id: undefined,
      name: "",
      items: [],
    },
  });

  const { control, watch, handleSubmit } = form;
  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-3">
          <FormField
            control={control}
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

          <FormContentItems
            category={category}
            values={{ items: watch("items") ?? [] }}
            push={append}
            remove={remove}
          />

          <StickyFooter
            className="px-8 flex items-center justify-end py-4"
            stickyClass="border-t border-gray-800"
          >
            <div className="md:flex items-center">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                onClick={() => onDiscard?.()}
              >
                Cancel
              </Button>
              <Button color="gray-200" type="submit" loading={isSubmitting}>
                <span className="text-black">Save</span>
              </Button>
            </div>
          </StickyFooter>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
