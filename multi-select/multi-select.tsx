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
