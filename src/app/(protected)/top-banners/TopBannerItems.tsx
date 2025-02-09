"use client";

import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd'
import { StrictModeDroppable } from '@/components/shared'
import TopBannerItem from './components/TopBannerItem'
import { TopBanner } from '@/@types/top-banner'

interface TopBannerItemsProps {
    topBanners: TopBanner[]
    pageType: string
    onActionClick: (idx: number) => void
    onOrderChange: (newOrder: TopBanner[]) => void
}

const TopBannerItems = ({
    topBanners,
    pageType,
    onActionClick,
    onOrderChange,
}: TopBannerItemsProps) => {
    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...topBanners]
        const [movedItem] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedItem)
        onOrderChange(newData)
    }

    const handleDragEnd = (result: DropResult) => {
        if (pageType === 'home') {
            const { source, destination } = result
            if (!destination) return
            reorderData(source.index, destination.index)
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <StrictModeDroppable droppableId="item-list">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {topBanners.map((topBanner, index) => (
                            <Draggable
                                key={topBanner?.id}
                                draggableId={index.toString()}
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
                                        <TopBannerItem
                                            item={topBanner}
                                            pageType={pageType}
                                            isAdded={true}
                                            onActionClick={() =>
                                                onActionClick(index)
                                            }
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
    )
}

export default TopBannerItems