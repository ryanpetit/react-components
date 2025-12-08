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

![Kanban-Board](./kanban-board.png)

---

## 📦 Installation

Uses components from: [Shadcn UI library]("https://ui.shadcn.com")

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
          <h1 className="text-4xl font-bold text-foreground mb-2">Kanban Board</h1>
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
