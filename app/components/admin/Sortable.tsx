"use client";

import React from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

type HandleProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };

/** Stable client-side row id for sortable editor lists. */
export const uid = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className = "space-y-3",
}: {
  items: T[];
  getId: (item: T, index: number) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, opts: { index: number; dragging: boolean }) => React.ReactNode;
  className?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const ids = items.map((it, i) => getId(it, i));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onReorder(arrayMove(items, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((it, i) => (
            <SortableRow key={ids[i]} id={ids[i]!}>
              {(dragging) => renderItem(it, { index: i, dragging })}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({
  id,
  children,
}: {
  id: string;
  children: (dragging: boolean) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 20 : undefined,
    position: "relative",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-start gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef as React.Ref<HTMLButtonElement>}
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
          className="mt-1 shrink-0 cursor-grab touch-none rounded-md p-1 text-[var(--color-muted)] hover:bg-[var(--color-surface)]/60 hover:text-[var(--color-text)] active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>
        <div className="min-w-0 flex-1">{children(isDragging)}</div>
      </div>
    </div>
  );
}

export type { HandleProps };
