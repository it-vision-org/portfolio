"use client";

import { X } from "lucide-react";
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
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Uploader from "./Uploader";

export default function MultiImageField({
  values,
  onChange,
  label,
  hint,
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  hint?: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  // ids must be unique — fall back to an index suffix if the same URL appears twice
  const seen = new Map<string, number>();
  const ids = values.map((u) => {
    const n = seen.get(u) ?? 0;
    seen.set(u, n + 1);
    return n === 0 ? u : `${u}#${n}`;
  });

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from === -1 || to === -1) return;
    onChange(arrayMove(values, from, to));
  }

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-bold text-[var(--color-text)]">{label}</p>}
      {values.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {values.map((url, i) => (
                <Tile
                  key={ids[i]}
                  id={ids[i]!}
                  url={url}
                  onRemove={() => onChange(values.filter((_, k) => k !== i))}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <Uploader
        endpoint="image"
        multiple
        buttonText="Add images"
        onComplete={(urls) => onChange([...values, ...urls])}
      />
      <p className="text-xs text-[var(--color-muted)]">
        {hint ? `${hint} · ` : ""}Drag to reorder.
      </p>
    </div>
  );
}

function Tile({ id, url, onRemove }: { id: string; url: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 20 : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative aspect-square cursor-grab touch-none overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" draggable={false} />
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
