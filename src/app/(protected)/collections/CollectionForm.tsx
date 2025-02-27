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
import { useEffect } from "react";

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

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { control, watch, handleSubmit } = form;
  const { append, remove } = useFieldArray({
    control,
    name: "items",
  });

  console.info("-------------------------")

  console.log(initialData);

  console.log(form)

  console.info("-------------------------")

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
            <div className="flex flex-row space-x-3 items-center">
              <Button
                className="bg-gray-600"
                size={"lg"}
                type="button"
                onClick={() => onDiscard?.()}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} loading={isSubmitting}>
                <span className="text-white">Save</span>
              </Button>
            </div>
          </StickyFooter>
        </form>
      </Form>
    </div>
  );
};

export default CollectionForm;
