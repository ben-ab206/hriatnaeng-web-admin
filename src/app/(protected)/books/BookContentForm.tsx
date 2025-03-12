"use client";

import { BookContentModel, audioContentSchema } from "./StaticTypes";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

interface BookContentFormProps {
  initialData?: BookContentModel;
  onSave: (values: BookContentModel) => void;
  onCancel: () => void;
}

const BookContentForm = ({
  initialData,
  onSave,
  onCancel,
}: BookContentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BookContentModel>({
    resolver: zodResolver(audioContentSchema),
    defaultValues: initialData ?? {
      id: undefined,
      title: "",
      content: "",
      label: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    try {
      setIsSubmitting(true);
      const submissionData: BookContentModel = {
        ...data,
        id: data.id || `content-${Date.now()}`,
      };

      onSave(submissionData);

      form.reset({});
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col w-full space-y-4">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Chapter 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} type="text" placeholder="Enter title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Enter your content here..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-row justify-end items-center space-x-4 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="space-x-2"
              >
                {isSubmitting && <Loader2Icon className="animate-spin" />}
                <span>Save</span>
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookContentForm;
