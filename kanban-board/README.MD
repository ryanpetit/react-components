# 🗂️ Kanban Board Component (React + TypeScript)

A clean, responsive, and fully-interactive **Kanban Board** component built with React + TypeScript — featuring:
📝 Create items
🚚 Drag & drop between columns
📦 Reorder items within a column
❌ Delete items
🎨 Beautiful styling (works great with TailwindCSS + shadcn/ui)

---

## 🚀 Features

* ➕ **Add** items to any column
* 🚛 **Drag & drop** items across columns
* 🔀 **Reorder** items within the same column
* ❌ **Delete** items with the X icon
* 📦 Optional `initialColumns` for full control
* 🎛️ `onColumnsChange` callback for state lifting
* 🎨 Built for Tailwind + shadcn/ui but works anywhere

---

## 📦 Installation

## [Shadcn UI library](%22https://ui.shadcn.com/)

## 🧩 Component Code

> 📌 *Click the top-right icon on GitHub to copy the full component.*

```tsx
// kanban-board.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KanbanItem {
  id: string
  title: string
  description?: string
}

export interface KanbanColumn {
  id: string
  title: string
  items: KanbanItem[]
}

interface KanbanBoardProps {
  initialColumns?: KanbanColumn[]
  onColumnsChange?: (columns: KanbanColumn[]) => void
}

export function KanbanBoard({ initialColumns, onColumnsChange }: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(
    initialColumns || [
      { id: "todo", title: "To Do", items: [] },
      { id: "in-progress", title: "In Progress", items: [] },
      { id: "done", title: "Done", items: [] },
    ],
  )
  const [draggedItem, setDraggedItem] = useState<{ columnId: string; itemId: string } | null>(null)
  const [newItemText, setNewItemText] = useState<Record<string, string>>({})
  const [showInput, setShowInput] = useState<Record<string, boolean>>({})
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleDragStart = (columnId: string, itemId: string) => {
    setDraggedItem({ columnId, itemId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumn(columnId)

    const columnElement = e.currentTarget
    const cards = Array.from(columnElement.querySelectorAll("[data-card-id]"))

    if (cards.length === 0) {
      setDragOverIndex(0)
      return
    }

    const mouseY = e.clientY
    let insertIndex = cards.length

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement
      const rect = card.getBoundingClientRect()
      const cardMiddle = rect.top + rect.height / 2

      if (mouseY < cardMiddle) {
        insertIndex = i
        break
      }
    }

    setDragOverIndex(insertIndex)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null)
      setDragOverIndex(null)
    }
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem || dragOverIndex === null) return

    const newColumns = [...columns]
    const sourceColumn = newColumns.find((col) => col.id === draggedItem.columnId)
    const targetColumn = newColumns.find((col) => col.id === targetColumnId)

    if (!sourceColumn || !targetColumn) return

    const itemIndex = sourceColumn.items.findIndex((item) => item.id === draggedItem.itemId)
    if (itemIndex === -1) return

    const [movedItem] = sourceColumn.items.splice(itemIndex, 1)

    let insertIndex = dragOverIndex
    if (draggedItem.columnId === targetColumnId && itemIndex < dragOverIndex) {
      insertIndex = dragOverIndex - 1
    }

    targetColumn.items.splice(insertIndex, 0, movedItem)

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
    setDraggedItem(null)
    setDragOverColumn(null)
    setDragOverIndex(null)
  }

  const handleAddItem = (columnId: string) => {
    const text = newItemText[columnId]?.trim()
    if (!text) return

    const newColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            items: [
              ...col.items,
              {
                id: `item-${Date.now()}-${Math.random()}`,
                title: text,
              },
            ],
          }
        : col,
    )

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
    setNewItemText((prev) => ({ ...prev, [columnId]: "" }))
    setShowInput((prev) => ({ ...prev, [columnId]: false }))
  }

  const handleDeleteItem = (columnId: string, itemId: string) => {
    const newColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            items: col.items.filter((item) => item.id !== itemId),
          }
        : col,
    )

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
  }

  const getDraggedItemData = () => {
    if (!draggedItem) return null
    const column = columns.find((col) => col.id === draggedItem.columnId)
    return column?.items.find((item) => item.id === draggedItem.itemId)
  }

  return (
    <div className="flex gap-4 p-6 overflow-x-auto min-h-screen bg-muted/30">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <Card className="bg-card">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">{column.title}</h3>
                <span className="text-sm text-muted-foreground">{column.items.length}</span>
              </div>
            </div>

            <div
              className={cn(
                "p-4 space-y-3 min-h-[500px] transition-all duration-200",
                dragOverColumn === column.id && draggedItem && "bg-primary/5 ring-2 ring-primary/20 ring-inset",
              )}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(column.id)}
            >
              {column.items.map((item, index) => {
                const draggedItemData = getDraggedItemData()
                const shouldShowGhost =
                  dragOverColumn === column.id &&
                  dragOverIndex === index &&
                  draggedItem?.itemId !== item.id &&
                  draggedItemData

                return (
                  <div key={item.id}>
                    {shouldShowGhost && (
                      <Card className="p-3 mb-3 bg-primary/10 border-2 border-dashed border-primary/40 transition-all duration-200 ease-in-out animate-in fade-in-0 slide-in-from-top-2">
                        <div className="flex items-start gap-2 opacity-60">
                          <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground break-words">{draggedItemData.title}</p>
                            {draggedItemData.description && (
                              <p className="text-xs text-muted-foreground mt-1 break-words">
                                {draggedItemData.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    )}

                    <Card
                      data-card-id={item.id}
                      draggable
                      onDragStart={() => handleDragStart(column.id, item.id)}
                      className={cn(
                        "p-3 cursor-move hover:shadow-md transition-all duration-200 bg-background group",
                        draggedItem?.itemId === item.id && "opacity-40 scale-95 ring-2 ring-primary/30",
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground break-words">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 break-words">{item.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                          onClick={() => handleDeleteItem(column.id, item.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                )
              })}

              {dragOverColumn === column.id &&
                dragOverIndex === column.items.length &&
                draggedItem &&
                (() => {
                  const draggedItemData = getDraggedItemData()
                  return draggedItemData ? (
                    <Card className="p-3 bg-primary/10 border-2 border-dashed border-primary/40 transition-all duration-200 ease-in-out animate-in fade-in-0 slide-in-from-top-2">
                      <div className="flex items-start gap-2 opacity-60">
                        <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground break-words">{draggedItemData.title}</p>
                          {draggedItemData.description && (
                            <p className="text-xs text-muted-foreground mt-1 break-words">
                              {draggedItemData.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ) : null
                })()}

              {showInput[column.id] ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter item title..."
                    value={newItemText[column.id] || ""}
                    onChange={(e) => setNewItemText((prev) => ({ ...prev, [column.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddItem(column.id)
                      } else if (e.key === "Escape") {
                        setShowInput((prev) => ({ ...prev, [column.id]: false }))
                        setNewItemText((prev) => ({ ...prev, [column.id]: "" }))
                      }
                    }}
                    autoFocus
                    className="bg-background"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAddItem(column.id)} className="flex-1">
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setShowInput((prev) => ({ ...prev, [column.id]: false }))
                        setNewItemText((prev) => ({ ...prev, [column.id]: "" }))
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => setShowInput((prev) => ({ ...prev, [column.id]: true }))}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add item
                </Button>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
```

---

## 🛠️ Usage Example

```tsx
import { KanbanBoard } from "./kanban-board"

export default function Demo() {
  const initialColumns = [
    {
      id: "todo",
      title: "To Do",
      items: [
        { id: "1", title: "Design new landing page", description: "Create mockups in Figma" },
        { id: "2", title: "Write documentation", description: "API reference docs" },
        { id: "3", title: "Review pull requests" },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      items: [
        { id: "4", title: "Implement authentication", description: "OAuth integration" },
        { id: "5", title: "Refactor database schema" },
      ],
    },
    {
      id: "done",
      title: "Done",
      items: [
        { id: "6", title: "Setup CI/CD pipeline", description: "GitHub Actions" },
        { id: "7", title: "Deploy to production" },
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2">Project Board</h1>
          <p className="text-muted-foreground">Drag and drop items between columns to organize your tasks</p>
        </div>
        <KanbanBoard initialColumns={initialColumns} />
      </div>
    </main>
  )
}
```

---

## ⌨️ Interactions & Flow

| Action                   | Interaction                       |
| ------------------------ | --------------------------------- |
| ➕ Add item               | **Click “Add item”** or **Enter** |
| 🚚 Move item             | **Drag & Drop**                   |
| 🔀 Reorder within column | **Drag item up/down**             |
| ❌ Delete item            | **Click X icon**                  |
| ↩️ Cancel new item input | **Esc**                           |
