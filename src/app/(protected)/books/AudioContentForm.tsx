"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AudioContentModel, audioFileSchema } from "./StaticTypes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { BookContentModel } from "./StaticTypes";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import AudioPlayer from "./_components/AudioPlayer";

interface AudioContentFormProps {
  initialData?: AudioContentModel;
  onSave: (values: AudioContentModel) => void;
  onCancel: () => void;
  dialogOpen: boolean;
  content_data?: BookContentModel[];
}

const AudioContentForm = ({
  initialData,
  onSave,
  onCancel,
  content_data = [],
  dialogOpen,
}: AudioContentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-process content_data to ensure it has all required fields
  const processedContentData = content_data.map((item) => ({
    ...item,
    // Ensure these fields exist for validation
    title: item.title || item.label || "",
    content: item.content || "",
    start_time: item.start_time || "00:00",
  }));

  const form = useForm<AudioContentModel>({
    resolver: zodResolver(audioFileSchema),
    defaultValues: initialData ?? {
      id: undefined,
      name: "",
      file_path: undefined,
      audio_file: undefined,
      content_data: processedContentData,
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    try {
      setIsSubmitting(true);
      const submissionData: AudioContentModel = {
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

  const { fields } = useFieldArray({
    control: form.control,
    name: "content_data",
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
      });
    }
    if (content_data.length > 0) {
      const processedData = content_data.map((item) => ({
        ...item,
        title: item.title,
        content: item.content,
        start_time: item.start_time,
      }));

      form.reset({
        ...form.getValues(),
        content_data: processedData,
      });
    }
  }, [content_data, form, initialData]);

  return (
    <Dialog open={dialogOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Audio Content Form" : "Add New Audio Content"}
          </DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col w-full space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Narrator</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audio_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio File (MP3)</FormLabel>
                      <FormControl>
                        {field.value || form.watch("file_path") ? (
                          <div className="flex flex-row w-full space-x-2 items-center">
                            <div className="flex-grow">
                              <AudioPlayer
                                audio_file={
                                  field.value
                                    ? field.value
                                    : form.watch("file_path")
                                }
                              />
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  field.onChange(undefined);
                                  form.setValue("audio_file", null as never);
                                }}
                                className="hover:bg-gray-200 rounded-full p-1"
                              >
                                <Trash2Icon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <Input
                            type="file"
                            accept="audio/mpeg,audio/mp3"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                field.onChange(e.target.files[0]);
                              }
                            }}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-4 w-full gap-3">
                  <div className="col-span-3">Chapters</div>
                  <div className="col-span-1">Start Times</div>
                </div>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-col space-y-2">
                    <div className="grid grid-cols-4 w-full gap-3">
                      <div className="rounded-md border p-2 pl-4 col-span-3">
                        {item.label}
                      </div>
                      <div className="col-span-1">
                        <FormField
                          control={form.control}
                          name={`content_data.${index}.start_time`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="00:00"
                                  {...field}
                                  value={
                                    field.value
                                      ? field.value
                                          .split(":")
                                          .slice(0, 2)
                                          .join(":")
                                      : field.value
                                  }
                                  onChange={(e) => {
                                    let value = e.target.value;

                                    // Allow user to type the colon directly
                                    if (
                                      value.length === 2 &&
                                      value.indexOf(":") === -1
                                    ) {
                                      value = value + ":";
                                      e.target.value = value;
                                    }

                                    // Process the input
                                    const digitsOnly = value.replace(/\D/g, "");

                                    let formattedValue = "";
                                    if (digitsOnly.length === 0) {
                                      formattedValue = "";
                                    } else if (digitsOnly.length <= 2) {
                                      // Just hours - no need to format yet
                                      formattedValue = value;
                                    } else {
                                      // Format as HH:MM
                                      const hours = digitsOnly.substring(0, 2);
                                      const minutes = digitsOnly.substring(
                                        2,
                                        4
                                      );
                                      formattedValue = `${hours}:${minutes}`;
                                    }

                                    // Update the input field
                                    e.target.value = formattedValue;
                                    field.onChange(e);
                                  }}
                                  onKeyDown={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (
                                      !/^\d$/.test(e.key) &&
                                      e.key !== ":" &&
                                      e.key !== "Backspace" &&
                                      e.key !== "Delete" &&
                                      e.key !== "ArrowLeft" &&
                                      e.key !== "ArrowRight" &&
                                      e.key !== "Tab"
                                    ) {
                                      e.preventDefault();
                                    }

                                    if (
                                      e.key === ":" &&
                                      target.value.includes(":")
                                    ) {
                                      e.preventDefault();
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const value = e.target.value;
                                    const digitsOnly = value.replace(/\D/g, "");

                                    let formattedValue = "";
                                    if (digitsOnly.length > 0) {
                                      const paddedDigits = digitsOnly
                                        .padEnd(4, "0")
                                        .substring(0, 4);
                                      const hours = paddedDigits.substring(
                                        0,
                                        2
                                      );
                                      const minutes = paddedDigits.substring(
                                        2,
                                        4
                                      );

                                      const hoursInt = parseInt(hours, 10);
                                      const minutesInt = parseInt(minutes, 10);

                                      const validHours = Math.min(
                                        Math.max(hoursInt, 0),
                                        23
                                      )
                                        .toString()
                                        .padStart(2, "0");
                                      const validMinutes = Math.min(
                                        Math.max(minutesInt, 0),
                                        59
                                      )
                                        .toString()
                                        .padStart(2, "0");

                                      formattedValue = `${validHours}:${validMinutes}`;
                                    }

                                    e.target.value = formattedValue;
                                    field.onChange(e);
                                  }}
                                  maxLength={5}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name={`content_data.${index}.title`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} type="hidden" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`content_data.${index}.content`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} type="hidden" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`content_data.${index}.label`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormControl>
                            <Input {...field} type="hidden" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                ))}

                <div className="w-full flex flex-row justify-end items-center space-x-4 pt-4">
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
      </DialogContent>
    </Dialog>
  );
};

export default AudioContentForm;
