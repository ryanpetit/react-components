# 🎯 Multi-Select Combobox (React + TypeScript)

A powerful and flexible **multi-select dropdown** built using React + TypeScript, with full support for:
✨ Searchable command palette
🏷️ Removable tags
➕ Multiple selection
📉 Optional tag display limit (+X overflow)
🎨 Beautiful styling (TailwindCSS + shadcn/ui)

---

## 🚀 Features

* 🔍 **Searchable** dropdown powered by the shadcn `Command` component
* 🏷️ **Badges** for selected items, each with a remove button
* ✔️ **Checkmarks** for selected options inside the dropdown
* ➕ **Multi-select** via click or keyboard navigation
* 📉 Optional **limit** prop to show only N tags with `+X` overflow
* 📤 Fully controlled `value` + `onChange`
* 🎨 Styled with shadcn/ui and TailwindCSS, drop-in compatible

---

## 📦 Installation

[Shadcn UI library](%22https://ui.shadcn.com/)

---

## 🧩 Component Code

> 📌 *Click the top-right icon on GitHub to copy the full component.*

```tsx
// multi-select-combobox.tsx
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectComboboxProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  limit?: number
}

export function MultiSelectCombobox({
  options,
  value,
  onChange,
  placeholder = "Select items...",
  limit,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [showAll, setShowAll] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setShowAll(true)
    } else {
      setShowAll(false)
    }
  }, [open])

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]
    onChange(newValue)
  }

  const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(value.filter((v) => v !== optionValue))
  }

  const selectedOptions = value
    .map((v) => options.find((opt) => opt.value === v))
    .filter((opt): opt is MultiSelectOption => opt !== undefined)

  const displayedTags = limit && !showAll && !open ? selectedOptions.slice(0, limit) : selectedOptions
  const hiddenCount = limit && !showAll && !open ? selectedOptions.length - limit : 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-10 bg-transparent"
        >
          <div className="flex flex-wrap items-center gap-1 flex-1">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {displayedTags.map((option) => (
                  <Badge key={option.value} variant="secondary" className="gap-1">
                    {option.label}
                    <button
                      className="ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => handleRemoveTag(option.value, e)}
                    >
                      <X className="size-3 cursor-pointer hover:text-destructive" />
                    </button>
                  </Badge>
                ))}
              </>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            {hiddenCount > 0 && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAll(true)
                }}
              >
                +{hiddenCount}
              </Badge>
            )}
            {showAll && limit && selectedOptions.length > limit && !open && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAll(false)
                }}
              >
                Show less
              </Button>
            )}
            <ChevronsUpDown className="size-4 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => handleToggleOption(option.value)}
                  >
                    <Check className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

---

## 🛠️ Usage Example

```tsx
import { MultiSelectCombobox } from "./multi-select-combobox"

export default function Demo() {
  const [selectedLanguages, setSelectedLanguages] = React.useState<string[]>(["javascript", "typescript"])
  const [limitedLanguages, setLimitedLanguages] = React.useState<string[]>([
    "javascript",
    "typescript",
    "python",
    "java",
    "go",
    "rust",
    "cpp",
    "csharp",
  ])

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "ruby", label: "Ruby" },
    { value: "php", label: "PHP" },
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground">Multi-Select Combobox</h2>
          <p className="text-muted-foreground">Shadcn combobox-based multiselect with search and limit support</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Select Programming Languages</label>
            <MultiSelectCombobox
              options={languageOptions}
              value={selectedLanguages}
              onChange={setSelectedLanguages}
              placeholder="Select languages..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Limited Display (shows max 5, click +X to expand)
            </label>
            <MultiSelectCombobox
              options={languageOptions}
              value={limitedLanguages}
              onChange={setLimitedLanguages}
              placeholder="Select languages..."
              limit={5}
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Selected Languages:</h3>
            <p className="text-sm text-muted-foreground">
              {selectedLanguages.length > 0
                ? selectedLanguages.map((v) => languageOptions.find((o) => o.value === v)?.label).join(", ")
                : "No languages selected"}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-card-foreground mb-2">Limited Languages:</h3>
            <p className="text-sm text-muted-foreground">
              {limitedLanguages.length > 0
                ? limitedLanguages.map((v) => languageOptions.find((o) => o.value === v)?.label).join(", ")
                : "No languages selected"}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">Combobox Features:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Built with shadcn combobox pattern using Command and Popover components</li>
            <li>Click to open dropdown with searchable command palette</li>
            <li>Checkmarks indicate selected items</li>
            <li>Selected items show as badges with remove buttons</li>
            <li>Support for limit prop to show only N tags with +X indicator</li>
            <li>Click +X to expand and show all tags, or click Show less to collapse</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
```

---

## ⌨️ Keyboard & Interaction Notes

| Action                    | Interaction                |
| ------------------------- | -------------------------- |
| ✔️ Select item            | Click or use **Enter**     |
| ❌ Remove selected tag     | Click the **X** on a badge |
| 🔍 Search options         | Type in the search input   |
| 🔽 Toggle dropdown        | Click the combobox button  |
| ➕ Expand limited tags     | Click **+X**               |
| 📉 Collapse expanded list | Click **Show less**        |
