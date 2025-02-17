import React, { useState } from "react";
import { FormItem } from "../StaticTypes";
import SectionMediaItems from "./ContentMediaItems";
import NewMoviesList from "./NewBooksList";
import NewMusicVideoList from "./NewPodcastsList";
import AddButtonNewBooks from "./AddButtonNewBooks";
import AddButtonPodcast from "./AddButtonPodcast";

interface FormContentItemsProps {
  category: string;
  values: {
    items: FormItem[];
  };
  push: (item: FormItem) => void;
  remove: (index: number) => void;
}

const FormContentItems: React.FC<FormContentItemsProps> = ({
  values,
  category,
  push,
  remove,
}) => {
  const [addNewType, setAddNewType] = useState<"podcast" | "book" | undefined>(
    undefined
  );

  return (
    <div>
      <label>{category === "book" ? "Books" : "Podcasts"}</label>
      <div className="h-2" />
      <div>
        <SectionMediaItems
          items={values.items}
          onActionClick={(indx) => remove(indx)}
        />
      </div>
      <div className="h-4" />
      <div className="space-y-5">
        {category === "book" && addNewType === undefined && (
          <AddButtonNewBooks onActionNew={() => setAddNewType("book")} />
        )}

        {category === "podcast" && addNewType === undefined && (
          <AddButtonPodcast onAddNew={() => setAddNewType("podcast")} />
        )}

        {addNewType === "book" && (
          <NewMoviesList
            selectedItems={values.items}
            onActionClick={(item) => push(item)}
          />
        )}

        {addNewType === "podcast" && (
          <NewMusicVideoList
            selectedItems={values.items}
            onActionClick={(item) => push(item)}
          />
        )}
      </div>
    </div>
  );
};

export default FormContentItems;
