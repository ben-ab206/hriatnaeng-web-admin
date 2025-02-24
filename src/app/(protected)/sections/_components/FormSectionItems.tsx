import React, { useState } from "react";
import { SectionFormItem } from "../StaticTypes";
import SectionMediaItems from "./SectionMediaItems";
import NewMoviesList from "./NewBooksList";
import NewMusicVideoList from "./NewPodcastsList";
import AddButtonNewBooks from "./AddButtonNewBooks";
import AddButtonPodcast from "./AddButtonPodcast";

interface FormSectionItemsProps {
  category: string;
  values: {
    items: SectionFormItem[];
    [key: string]: unknown;
  };
  push: (item: SectionFormItem) => void;
  remove: (index: number) => void;
  updateOrder: (newOrder: SectionFormItem[]) => void;
}
const FormSectionItems: React.FC<FormSectionItemsProps> = ({
  values,
  category,
  push,
  remove,
  updateOrder,
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
          onReorder={updateOrder}
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

export default FormSectionItems;
