# 📂 Code Viewer Component (React + TypeScript)

A powerful, file-tree-based **Code Viewer** component built with React + TypeScript — featuring:
📁 Folder + file navigation
🔍 File search
📄 Syntax-ready viewer
📎 Copy-to-clipboard
🖥️ Collapsible sidebar
🎨 Beautiful developer-friendly UI (TailwindCSS + shadcn/ui)

---

## 🚀 Features

* 📁 **Expandable folder tree** with file icons
* 🔍 **Search files** instantly
* 📄 **View file contents** with line numbers
* 📎 **Copy file content** with one click
* 🚪 **Collapse / expand** file sidebar
* 🎛️ Fully controlled via `FileNode[]` structure
* 🎨 Designed for Tailwind + shadcn/ui

---

![Code Viewer](./code-viewer.png)

---

## 📦 Installation

Uses components from the
[Shadcn UI Library](%22https://ui.shadcn.com/)

---

## 🧩 Component Code

> 📌 *Click the GitHub copy icon to get the full code.*

```tsx
// code-viewer.tsx
// (your full component code exactly as provided)
```

---

## 🛠️ Usage Example

```tsx
import { CodeViewer, FileNode } from "./code-viewer"

const exampleFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    children: [
      {
        name: "app.tsx",
        type: "file",
        content: `export default function App() {\n  return <h1>Hello World</h1>\n}`,
        language: "tsx",
      },
      {
        name: "utils",
        type: "folder",
        children: [
          {
            name: "math.ts",
            type: "file",
            content: `export const add = (a: number, b: number) => a + b`,
            language: "ts",
          },
        ],
      },
    ],
  },
  {
    name: "package.json",
    type: "file",
    content: `{\n  "name": "demo-project",\n  "version": "1.0.0"\n}`,
    language: "json",
  },
]

export default function Demo() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-background">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4">Code Viewer Component</h1>

        <CodeViewer files={exampleFiles} className="mt-6" />
      </div>
    </main>
  )
}
```

---

## 📁 File Structure Format (`FileNode`)

Your file tree is fully typed using a simple recursive structure:

```ts
export interface FileNode {
  name: string
  type: "file" | "folder"
  content?: string        // for files
  children?: FileNode[]   // for folders
  language?: string       // optional syntax hint
}
```

---

## 💡 Tips & Behaviors

### 🔍 File Search

Type in the search bar to instantly filter files & folders.
Matching folder parents automatically **expand**.

---

### 📎 Copy Code

Click the **copy icon** to copy the entire file content to your clipboard.
A ✓ checkmark briefly appears when successful.

---

### 📂 Sidebar Control

* Click the **collapse icon** to hide the sidebar
* Sidebar auto-reappears when selecting “Show Files”

---

### 📄 Code Viewer

* Line numbers
* Monospace font
* Smooth highlighting on hover
* Handles empty lines gracefully

---

## ⌨️ Keyboard Shortcuts

| Action               | Shortcut             |
| -------------------- | -------------------- |
| 📎 Copy file content | *(button click)*     |
| 🔍 Clear search      | **Esc** inside input |
| 📂 Toggle sidebar    | *(button click)*     |