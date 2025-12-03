import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TagsInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = "Type and press Enter...",
  className,
  ...props
}: TagsInputProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null)
  const [editingValue, setEditingValue] = React.useState("")
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
      // Remove last tag when backspace is pressed and input is empty
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

  return (
    <div
      className={cn(
        "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
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
    </div>
  )
}
