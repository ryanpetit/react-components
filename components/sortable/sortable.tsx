"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { CSS } from "@dnd-kit/utilities"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type SortableOrientation = "vertical" | "horizontal" | "mixed"

interface SortableProps<T extends { id: UniqueIdentifier }> {
  items: T[]
  onReorder: (items: T[]) => void
  orientation?: SortableOrientation
  children: (item: T) => React.ReactNode
  renderOverlay?: (item: T) => React.ReactNode
  className?: string
}

export function Sortable<T extends { id: UniqueIdentifier }>({
  items,
  onReorder,
  orientation = "vertical",
  children,
  renderOverlay,
  className,
}: SortableProps<T>) {
  const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Choose sorting strategy based on orientation
  const strategy = React.useMemo(() => {
    switch (orientation) {
      case "horizontal":
        return horizontalListSortingStrategy
      case "vertical":
        return verticalListSortingStrategy
      case "mixed":
        return rectSortingStrategy
      default:
        return verticalListSortingStrategy
    }
  }, [orientation])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      onReorder(arrayMove(items, oldIndex, newIndex))
    }

    setActiveId(null)
  }

  const activeItem = React.useMemo(() => items.find((item) => item.id === activeId), [activeId, items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
    >
      <SortableContext items={items} strategy={strategy}>
        <div className={className}>{items.map((item) => children(item))}</div>
      </SortableContext>
      <DragOverlay>{activeItem && (renderOverlay ? renderOverlay(activeItem) : children(activeItem))}</DragOverlay>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string | number
  children: React.ReactNode
  asChild?: boolean
  className?: string
  disabled?: boolean
}

export function SortableItem({ id, children, asChild = false, className, disabled = false }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={setNodeRef}
      style={style}
      className={cn(
        "touch-none",
        isDragging && "z-50 cursor-grabbing",
        !isDragging && !disabled && "cursor-grab",
        className,
      )}
      {...attributes}
      {...listeners}
    >
      {children}
    </Comp>
  )
}