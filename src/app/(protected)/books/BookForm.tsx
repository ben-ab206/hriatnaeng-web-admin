"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AudioContentModel,
  BookContentModel,
  bookFormSchema,
  bookFormTabs,
  InformationFormModel,
  LanguageTabsData,
} from "./StaticTypes";
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
import StickyFooter from "@/components/shared/StickyFotter";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import AddContentButton from "./_components/AddContentButton";
import ImageUploader from "./_components/ImageUploader";
import {
  LanguageTabs,
  LanguageTabsList,
  LanguageTabsTrigger,
} from "./_components/LanguageTabs";
import MultiSelector from "@/components/ui/multi-selector";
import BookContentForm from "./BookContentForm";
import { useEffect, useState } from "react";
import ContentItem from "./_components/ContentItem";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import AudioContentForm from "./AudioContentForm";
import AudioContentItem from "./_components/AudioContentItem";
import { LanguageType } from "@/@types/language";
import { api } from "@/trpc/client";
import { Option } from "@/@types/option";
import CheckboxRadioGroup from "./_components/CheckboxRadioGroup";

interface BookFormProps {
  isSubmitting?: boolean;
  onDiscard?: () => void;
  onSubmit: (data: {
    id?: number;
    language: LanguageType;
    information: InformationFormModel;
    audioContentForm: AudioContentModel[];
  }) => void;
  initialDataOfBook?: InformationFormModel;
  initialAudiosData?: AudioContentModel[];
  initialBookContentsData?: BookContentModel[];
}

const BookForm = ({
  isSubmitting = false,
  onSubmit,
  onDiscard,
  initialDataOfBook,
  initialAudiosData = [],
  initialBookContentsData = [],
}: BookFormProps) => {
  const [contentFormDialog, setContentFormDialog] = useState(false);
  const [languageTab, setLanguageTab] = useState<LanguageType>("Mizo");
  const [bookFormStep, setBookFormSteps] = useState<string>("Information");
  const [audioContentFormDialog, setAudioContentFormDialog] = useState(false);
  const [bookContents, setBookContents] = useState<BookContentModel[]>([]);
  const [informationFormData, setInformationFormData] = useState<
    InformationFormModel | undefined
  >(undefined);
  const [editContentItem, setEditContentItem] = useState<
    BookContentModel | undefined
  >();
  const [audioContents, setAudioContents] = useState<AudioContentModel[]>([]);
  const [editAudioContentItem, setAudioContentItem] = useState<
    AudioContentModel | undefined
  >(undefined);
  const [initialized, setInitialized] = useState(false);

  const informationForm = useForm<InformationFormModel>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: initialDataOfBook ?? {
      id: undefined,
      title: "",
      subtitle: "",
      about: "",
      background_color: "",
      translator: [],
      author: [],
      categories: [],
      content_type: "Books",
      cover_path: "",
      price_model: PriceModel.FREE,
      read_duration: undefined,
      cover_image: [],
    },
  });

  const handleSubmit = informationForm.handleSubmit(() => {
    setInformationFormData(informationForm.getValues());
    setBookFormSteps("Content");
  });

  const { data: authors = [] } =
    api.people.getPeopleByRoleName.useQuery("Author");
  const { data: translators = [] } =
    api.people.getPeopleByRoleName.useQuery("Translator");
  const { data: categories = [] } = api.categories.getAllCAtegories.useQuery();

  const authorsOptions: Option[] = authors.map(
    (au) =>
      ({ value: String(au.id), label: au.name, image: au.image_path } as Option)
  );

  const translatorOptions: Option[] = translators.map(
    (t) =>
      ({ value: String(t.id), label: t.name, image: t.image_path } as Option)
  );

  const categoryOptions: Option[] = categories.map((c) => ({
    value: String(c.id),
    label: c.name ?? "",
    image: c.image_path ?? "",
  }));

  const onDialogClose = () => {
    setContentFormDialog(false);
    setEditContentItem(undefined);
    setAudioContentItem(undefined);
    setAudioContentFormDialog(false);
  };

  const onSaveContentForm = (v: BookContentModel) => {
    if (editContentItem) {
      const updatedContents = bookContents.map((item) =>
        item.id === editContentItem.id ? v : item
      );
      setBookContents(updatedContents);
    } else {
      setBookContents((prev) => [...prev, v]);
    }

    setEditContentItem(undefined);
    setContentFormDialog(false);
  };

  const onSaveAudioContentForm = (v: AudioContentModel) => {
    if (editAudioContentItem) {
      const updatedContents = audioContents.map((item) =>
        item.id === editAudioContentItem.id ? v : item
      );
      setAudioContents(updatedContents);
    } else {
      setAudioContents((prev) => [...prev, v]);
    }

    onDialogClose();
  };

  const onDeleteContentItem = (idx: number) => {
    setBookContents((prev) => {
      const newArray = [...prev];
      newArray.splice(idx, 1);
      return newArray;
    });
  };

  const onDeleteAudioContentItem = (idx: number) => {
    setAudioContents((prev) => {
      const newArray = [...prev];
      newArray.splice(idx, 1);
      return newArray;
    });
  };

  const onEditContentItem = (v: BookContentModel) => {
    setEditContentItem(v);
    setContentFormDialog(true);
  };

  const onEditAudioContentItem = (v: AudioContentModel) => {
    setAudioContentItem(v);
    setAudioContentFormDialog(true);
  };

  const onTabChange = (v: string) => {
    setLanguageTab(v as LanguageType);
  };

  const handleSaveBookForm = () => {
    if (informationFormData)
      onSubmit({
        id: informationFormData.id,
        language: languageTab,
        audioContentForm: audioContents,
        information: informationFormData,
      });
  };

  // Initialize form data only once
  useEffect(() => {
    if (!initialized && initialDataOfBook) {
      informationForm.reset(initialDataOfBook);
      if (initialDataOfBook.language) {
        setLanguageTab(initialDataOfBook.language);
      }
      setInitialized(true);
    }
  }, [initialized, initialDataOfBook, informationForm]);

  // Set initial audio and book contents only once
  useEffect(() => {
    if (
      !initialized &&
      (initialAudiosData.length > 0 || initialBookContentsData.length > 0)
    ) {
      setAudioContents(initialAudiosData);
      setBookContents(initialBookContentsData);
      setInitialized(true);
    }
  }, [initialized, initialAudiosData, initialBookContentsData]);

  return (
    <div>
      <div className="flex flex-col justify-between">
        <LanguageTabs
          value={languageTab}
          className="space-y-4"
          onValueChange={onTabChange}
        >
          <LanguageTabsList className="w-full bg-gray-100">
            {LanguageTabsData.map((lang, idx) => (
              <LanguageTabsTrigger value={lang} className="w-full" key={idx}>
                {lang}
              </LanguageTabsTrigger>
            ))}
          </LanguageTabsList>

          <Tabs
            value={bookFormStep}
            onValueChange={(v) => setBookFormSteps(v)}
            className="space-y-5"
          >
            <TabsList>
              {bookFormTabs.map((bf) => (
                <TabsTrigger
                  key={bf}
                  value={bf}
                  disabled={
                    bf === "Content"
                      ? informationFormData === undefined
                      : bf === "Audio"
                      ? bookContents.length <= 0
                      : false
                  }
                >
                  {bf}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="Information" className="w-full">
              <Form {...informationForm}>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-row w-full space-x-5">
                    <div className="space-y-3 flex-1">
                      <FormField
                        control={informationForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
                        name="translator"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Translator</FormLabel>
                            <MultiSelector
                              value={field.value}
                              onChange={field.onChange}
                              options={translatorOptions}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <MultiSelector
                              value={field.value}
                              onChange={field.onChange}
                              options={authorsOptions}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
                        name="categories"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categories</FormLabel>
                            <MultiSelector
                              value={field.value}
                              onChange={field.onChange}
                              options={categoryOptions}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={informationForm.control}
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

                      <FormField
                        control={informationForm.control}
                        name="price_model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price Model</FormLabel>
                            <FormControl>
                              <CheckboxRadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                options={[
                                  {
                                    id: PriceModel.FREE,
                                    label: PriceModel.FREE,
                                  },
                                  {
                                    id: PriceModel.PREMIUM,
                                    label: PriceModel.PREMIUM,
                                  },
                                ]}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex-1 space-y-3">
                      <FormField
                        control={informationForm.control}
                        name="cover_image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cover Image</FormLabel>
                            <div className="flex flex-row items-center space-x-3">
                              <FormControl>
                                <ImageUploader
                                  images={field.value}
                                  onChange={field.onChange}
                                  containerClassName="h-[250px] w-[180px]"
                                  ratio="2:3"
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
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
                                    onChange={(color) =>
                                      field.onChange(color.hex)
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={informationForm.control}
                        name="about"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={10} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <StickyFooter
                    className="px-8 flex items-center justify-end py-4"
                    stickyClass="border-t border-gray-800"
                  >
                    <div className="flex flex-row space-x-3 items-center">
                      <Button
                        className="bg-gray-600"
                        size={"lg"}
                        type="button"
                        onClick={onDiscard}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size={"lg"} loading={isSubmitting}>
                        <span className="text-white">Next</span>
                      </Button>
                    </div>
                  </StickyFooter>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="Content" className="space-y-3">
              <div className="space-y-3">
                {bookContents.map((bc, idx) => (
                  <ContentItem
                    key={idx}
                    data={bc}
                    onDelete={() => onDeleteContentItem(idx)}
                    onEdit={() => onEditContentItem(bc)}
                  />
                ))}
              </div>
              <AddContentButton
                text="Add New Content"
                onActionNewContent={() => setContentFormDialog(true)}
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
                    onClick={onDiscard}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size={"lg"}
                    loading={isSubmitting}
                    onClick={() => setBookFormSteps("Audio")}
                  >
                    <span className="text-white">Next</span>
                  </Button>
                </div>
              </StickyFooter>
            </TabsContent>
            <TabsContent value="Audio">
              <div className="space-y-5">
                <div className="space-y-3">
                  {audioContents.map((ac, idx) => (
                    <AudioContentItem
                      key={idx}
                      data={ac}
                      onDelete={() => onDeleteAudioContentItem(idx)}
                      onEdit={() => onEditAudioContentItem(ac)}
                    />
                  ))}
                </div>
                <AddContentButton
                  text="Add New Audio"
                  onActionNewContent={() => setAudioContentFormDialog(true)}
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
                      onClick={onDiscard}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size={"lg"}
                      loading={isSubmitting}
                      onClick={handleSaveBookForm}
                    >
                      <span className="text-white">Save</span>
                    </Button>
                  </div>
                </StickyFooter>
              </div>
            </TabsContent>
          </Tabs>
        </LanguageTabs>
      </div>

      <Dialog open={contentFormDialog} onOpenChange={onDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editContentItem ? "Edit Content Form" : "Add New Content"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <BookContentForm
              onCancel={onDialogClose}
              initialData={editContentItem}
              onSave={onSaveContentForm}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AudioContentForm
        dialogOpen={audioContentFormDialog}
        initialData={editAudioContentItem}
        content_data={[
          ...audioContents.flatMap((ac) => ac.content_data),

          ...bookContents.filter((bookItem) => {
            return !audioContents.some((ac) =>
              ac.content_data.some((item) => item.id === bookItem.id)
            );
          }),
        ]}
        onCancel={onDialogClose}
        onSave={onSaveAudioContentForm}
      />
    </div>
  );
};

export default BookForm;
