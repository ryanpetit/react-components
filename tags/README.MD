# 🎯 Tags Input Component (React + TypeScript)

A lightweight, flexible, and editable **Tags Input** component built with React + TypeScript — featuring:  
✨ Add tags  
🖊️ Edit tags (double-click)  
❌ Remove tags  
⌨️ Keyboard shortcuts  
🎨 Beautiful styling (works great with TailwindCSS + shadcn/ui)

---

## 🚀 Features

* ⌨️ **Add** tags by pressing **Enter**
* ✏️ **Edit** tags with a *double-click*
* ❌ **Remove** tags with the X icon
* ⏪ **Backspace** removes the last tag when input is empty
* 🎛️ Fully controlled `value` + `onChange`
* 🎨 Built for Tailwind + shadcn/ui but works anywhere

---

## 📦 Installation
[Shadcn UI library]("https://ui.shadcn.com/)
---

## 🧩 Component Code

> 📌 *Click the top-right icon on GitHub to copy the full component.*

```tsx
// tags-input.tsx
"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  limit?: number
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  className,
  limit,
  ...props
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleAddTag = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange?.([...value, trimmedValue])
      setInputValue("")
    }
  }

  const handleRemoveTag = (indexToRemove: number) => {
    onChange?.(value.filter((_, index) => index !== indexToRemove))
    setEditingIndex(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange?.(value.slice(0, -1))
    }
  }

  const handleEditTag = (index: number) => {
    setEditingIndex(index)
    setEditingValue(value[index])
  }

  const handleSaveEdit = (index: number) => {
    const trimmedValue = editingValue.trim()
    if (trimmedValue && !value.some((tag, i) => i !== index && tag === trimmedValue)) {
      const newTags = [...value]
      newTags[index] = trimmedValue
      onChange?.(newTags)
    }
    setEditingIndex(null)
    setEditingValue("")
  }

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSaveEdit(index)
    } else if (e.key === "Escape") {
      setEditingIndex(null)
      setEditingValue("")
    }
  }

  const shouldLimitTags = limit !== undefined && limit > 0 && value.length > limit
  const visibleTags = shouldLimitTags && !isExpanded ? value.slice(0, limit) : value
  const remainingCount = shouldLimitTags ? value.length - limit : 0

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {visibleTags.map((tag, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm text-secondary-foreground"
        >
          {editingIndex === index ? (
            <input
              type="text"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => handleEditKeyDown(e, index)}
              onBlur={() => handleSaveEdit(index)}
              className="w-20 bg-transparent outline-none"
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => handleEditTag(index)} className="cursor-text">
              {tag}
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRemoveTag(index)}
            className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label={`Remove ${tag}`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-[120px]"
        {...props}
      />
      {shouldLimitTags && !isExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(true)
          }}
          className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
          aria-label={`Show ${remainingCount} more tags`}
        >
          +{remainingCount}
        </button>
      )}
      {shouldLimitTags && isExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(false)
          }}
          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
          aria-label="Show less"
        >
          Show less
        </button>
      )}
    </div>
  )
}
```

---

## 🛠️ Usage Example

```tsx
import { TagsInput } from "./tags-input"

export default function Demo() {
  const [tags, setTags] = React.useState<string[]>(["React", "Next.js", "TypeScript"])
  const [limitedTags, setLimitedTags] = React.useState<string[]>([
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
    "Shadcn",
    "Node.js",
    "Express",
    "MongoDB",
  ])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Tags Input Component</h1>
          <p className="text-muted-foreground">
            Type to add tags, double-click to edit, and click the X to remove them
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Your Tags</label>
            <TagsInput value={tags} onChange={setTags} placeholder="Add a tag and press Enter..." />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Limited Tags (shows max 5, click +X to expand)
            </label>
            <TagsInput
              value={limitedTags}
              onChange={setLimitedTags}
              placeholder="Add a tag and press Enter..."
              limit={5}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Current Tags:</h3>
            <p className="text-sm text-muted-foreground">{tags.length > 0 ? tags.join(", ") : "No tags yet"}</p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Limited Tags:</h3>
            <p className="text-sm text-muted-foreground">
              {limitedTags.length > 0 ? limitedTags.join(", ") : "No tags yet"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">How to use:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>
              Type a tag and press{" "}
              <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">Enter</kbd> to add it
            </li>
            <li>Double-click on a tag to edit it</li>
            <li>Click the X icon to remove a tag</li>
            <li>
              Press <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">Backspace</kbd>{" "}
              with empty input to remove the last tag
            </li>
            <li>Use the limit prop to show only a specific number of tags with a +X indicator for more</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
```

---

## ⌨️ Keyboard Shortcuts

| Action            | Shortcut                       |
| ----------------- | ------------------------------ |
| ➕ Add tag         | **Enter**                      |
| ⏪ Remove last tag | **Backspace** (on empty input) |
| ✏️ Edit tag       | **Double-click** a tag         |
| 💾 Save edit      | **Enter**                      |
| ❌ Cancel edit     | **Esc**                        |
