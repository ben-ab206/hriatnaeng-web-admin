"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookFormSchema, InformationFormModel } from "./StaticTypes";
import { PriceModel } from "@/@types/price-model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ColorPicker from "react-pick-color";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StickyFooter from "@/components/shared/StickyFotter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddContentButton from "./_components/AddContentButton";
// import AudioPlayer from "./_components/AudioPlayer";

interface BookFormProps {
  isSubmitting?: boolean;
  onSubmit: () => void;
  informationData?: InformationFormModel;
}

const BookForm = ({
  isSubmitting = false,
  onSubmit,
  informationData,
}: BookFormProps) => {
  const infromationForm = useForm<InformationFormModel>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: informationData ?? {
      id: undefined,
      title: "",
      subtitle: "",
      about: "",
      about_mizo: "",
      background_color: "",
      translator: undefined,
      author: undefined,
      categories: undefined,
      content_type: "Books",
      cover_path: "",
      price_model: PriceModel.FREE,
      published_date: undefined,
      read_duration: undefined,
      release_date: undefined,
      subtitle_mizo: "",
      title_mizo: "",
    },
  });

  const handleSubmit = infromationForm.handleSubmit((data) => {
    console.log(data);
    onSubmit();
  });

  return (
    <div>
      <Tabs defaultValue="information" className="">
        <TabsList>
          <TabsTrigger value="information">Information</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        <TabsContent value="information" className="w-full">
          <Form {...infromationForm}>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-row items-center w-full space-x-5">
                <div className="space-y-3 flex-1">
                  <FormField
                    control={infromationForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title ( Eng )</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="title_mizo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title ( Mizo )</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle ( Eng )</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="subtitle_mizo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle ( Mizo )</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="translator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Translator</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infromationForm.control}
                    name="read_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration ( in minutes )</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            onKeyDown={(e) => {
                              if (
                                !/^[0-9]+$/.test(e.key) &&
                                e.key !== "Backspace" &&
                                e.key !== "Delete" &&
                                e.key !== "ArrowLeft" &&
                                e.key !== "ArrowRight" &&
                                e.key !== "Tab"
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <AudioPlayer /> */}
                </div>
                <div className="flex-1">
                  <FormField
                    control={infromationForm.control}
                    name="background_color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <div className="flex flex-row items-center space-x-3">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="#FFFFFF"
                              className="font-mono"
                            />
                          </FormControl>
                          <Popover>
                            <PopoverTrigger>
                              <div>
                                <Image
                                  src="/icons/color-picker-icon.png"
                                  width={30}
                                  height={30}
                                  alt="color-picker-icon"
                                />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <ColorPicker
                                color={field.value || "#FFFFFF"}
                                onChange={(color) => field.onChange(color.hex)}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={infromationForm.control}
                    name="about"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About ( English )</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infromationForm.control}
                    name="about_mizo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>About ( Mizo )</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={10} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="content">
          <AddContentButton onActionNewContent={()=>{}} />
        </TabsContent>
      </Tabs>
      <StickyFooter
        className="px-8 flex items-center justify-end py-4"
        stickyClass="border-t border-gray-800"
      >
        <div className="flex flex-row space-x-3 items-center">
          <Button
            className="bg-gray-600"
            size={"lg"}
            type="button"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button type="submit" size={"lg"} loading={isSubmitting}>
            <span className="text-white">Save</span>
          </Button>
        </div>
      </StickyFooter>
      
    </div>
  );
};

export default BookForm;
