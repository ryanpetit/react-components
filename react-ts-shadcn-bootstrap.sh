#!/bin/bash

# Automated shadcn/ui + Vite setup script
# Usage: ./setup-shadcn-project.sh <project-name>

# Check if a project name was provided
if [ -z "$1" ]; then
  echo "❌ Error: No project name provided."
  echo "Usage: $0 <project-name>"
  exit 1
fi

PROJECT_NAME="$1"

echo "🚀 Creating new shadcn/ui react typescript project: $PROJECT_NAME"

# Create Vite project with React + TypeScript
npm create vite@latest $PROJECT_NAME -- --template react-swc-ts --no-interactive
cd $PROJECT_NAME

echo "📦 Installing dependencies..."
npm install

echo "🎨 Setting up Tailwind CSS..."
npm install tailwindcss @tailwindcss/vite

echo "📝 Configuring files..."

# Replace src/index.css
cat > src/index.css << 'EOF'
@import "tailwindcss";
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

echo "🎯 Initializing shadcn/ui..."
# Initialize shadcn with defaults
npx shadcn@latest init -b neutral -y

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
