#!/bin/bash

# Automated shadcn/ui + Vite setup script
# Usage: ./setup-shadcn-project.sh <project-name>

# Function to prompt the user if no input is given
prompt_for_project_name() {
  read -rp "Enter project name (or Ctrl+C to cancel): " input
  if [ -z "$input" ]; then
    echo "❌ No project name provided. Exiting."
    exit 1
  fi
  echo "$input"
}

# Handle input
if [ $# -eq 0 ]; then
  # No arguments, prompt user
  PROJECT_NAME=$(prompt_for_project_name)
else
  # Join all arguments into a single string
  PROJECT_NAME="$*"
fi

# Normalize: lowercase, replace spaces with single dash, remove extra spaces
PROJECT_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[[:space:]]\+/-/g')


echo "🚀 Creating new shadcn/ui react typescript project: $PROJECT_NAME"

# Create Vite project with React + TypeScript
npm create vite@latest $PROJECT_NAME --- --template react-swc-ts --no-interactive
cd $PROJECT_NAME

echo "📦 Installing dependencies..."
npm install

echo "🎨 Setting up Tailwind CSS..."
npm install tailwindcss @tailwindcss/vite

echo "📝 Configuring files..."

# Replace src/index.css
cat > src/index.css << 'EOF'
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF

# Update tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
EOF

# Update tsconfig.app.json
sed -i '/"compilerOptions"[[:space:]]*:[[:space:]]*{/a\
    /* Path aliases */\
    "baseUrl": ".",\
    "paths": {\
      "@/*": ["./src/*"]\
    },\
' tsconfig.app.json

# Updating types
echo "🔧 Updating types..."
npm install -D @types/node

# Update vite.config.ts
cat > vite.config.ts << 'EOF'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
EOF

# npx shadcn@latest init --base-color neutral --yes
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install -D tw-animate-css

# Create utility file for class names
mkdir -p src/lib && cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

echo "🎯 Initializing shadcn/ui..."

# Creating components.json
cat > components.json << 'EOF'
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {}
}
EOF

# Updateing App.tsx
cat > src/App.tsx << 'EOF'
export default function App() {
  return (
    <main className="min-h-screen bg-primary text-secondary p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to Your Project 🚀
        </h1>
        <p className="text-muted-foreground mt-2">
          This starter template is fully configured with React, Typescript, tailwindcss,
          and shadcn/ui.
        </p>
        <p>
          To add shadcn components: npx shadcn@latest add [component-name]
        </p>
        <div className="flex gap-2 justify-around">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="border border-purple-400 text text-purple-400 px-4 py-2 rounded-md shadow-md hover:bg-purple-700 hover:text-white transition w-fit">
            Vite
          </a>
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" className="border border-purple-400 text text-purple-400 px-4 py-2 rounded-md shadow-md hover:bg-purple-700 hover:text-white transition w-fit">
            Shadcn/ui
          </a>
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer" className="border border-purple-400 text text-purple-400 px-4 py-2 rounded-md shadow-md hover:bg-purple-700 hover:text-white transition w-fit">
            TailwindCSS
          </a>
        </div>
      </div>
    </main>
  )
}
EOF

echo "✅ Setup complete! 🎉"
echo ""
echo "To get started:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
echo ""
echo "Your shadcn/ui project is ready with:"
echo "  ✓ Vite + React + TypeScript"
echo "  ✓ Tailwind CSS configured"
echo "  ✓ shadcn/ui initialized"