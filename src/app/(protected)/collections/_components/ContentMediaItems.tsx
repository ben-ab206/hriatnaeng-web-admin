import FormSectionItem from "./FormContentItem";
import { FormItem } from "../StaticTypes";

interface ContentMediaItemsProps {
  items: FormItem[];
  onActionClick: (idx: number) => void;
}

const ContentMediaItems = ({
  items,
  onActionClick,
}: ContentMediaItemsProps) => {
  return (
    <div>
      {items.map((content, index) => (
        <FormSectionItem
          key={index}
          item={content}
          isAdded={true}
          onActionClick={() => onActionClick(index)}
        />
      ))}
    </div>
  );
};

export default ContentMediaItems;
