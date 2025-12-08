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

![Tags Input](./tags-input.png)

---

## 📦 Installation

Uses components from: [Shadcn UI library](https://ui.shadcn.com)

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
