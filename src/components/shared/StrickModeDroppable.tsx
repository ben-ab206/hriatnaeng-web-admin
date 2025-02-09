"use client";

import { useEffect, useState } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props} isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>{children}</Droppable>;
};

export default StrictModeDroppable;
