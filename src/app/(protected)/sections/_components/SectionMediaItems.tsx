import { useEffect, useState } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
// import { MdDragIndicator } from 'react-icons/md'
import { StrictModeDroppable } from "@/components/shared";
import FormSectionItem from "./FormSectionItem";
import { SectionFormItem } from "../StaticTypes";

interface SectionMediaItemsProps {
  items: SectionFormItem[];
  onActionClick: (idx: number) => void;
  onReorder: (newOrder: SectionFormItem[]) => void;
}

const SectionMediaItems = ({
  items,
  onActionClick,
  onReorder,
}: SectionMediaItemsProps) => {
  const [data, setData] = useState<SectionFormItem[]>([]);

  const reorderData = (startIndex: number, endIndex: number) => {
    const newData = [...data];
    const [movedItem] = newData.splice(startIndex, 1);
    newData.splice(endIndex, 0, movedItem);
    setData(newData);
    onReorder(newData);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    reorderData(source.index, destination.index);
  };

  useEffect(() => {
    setData(items);
  }, [items]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="item-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {data.map((content, index) => (
              <Draggable
                key={content.id}
                draggableId={content.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                    }}
                  >
                    <FormSectionItem
                      item={content}
                      isAdded={true}
                      onActionClick={() => onActionClick(index)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

export default SectionMediaItems;
