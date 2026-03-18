#!/bin/bash

# Automated shadcn/ui + Vite setup script
# Usage: ./react-ts-shadcn-bootstrap.sh <project-name>

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
npx shadcn@latest init -d -n $PROJECT_NAME -t vite -b radix -p nova -y
cd $PROJECT_NAME

echo "📝 Configuring files..."

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
        <p>
          Press [d] to toggle dark/light mode. ThemeProvider was installed by default and used in src/main.tsx. You can customize it by editing src/components/theme-provider.tsx.
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