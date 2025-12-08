"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Copy, PanelLeftClose, PanelLeft, Check, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileJson, FileCode, FileText, Folder, Database, File, FileType } from "lucide-react"

export interface FileNode {
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  language?: string
}

interface CodeViewerProps {
  files: FileNode[]
  className?: string
}

interface FileTreeItemProps {
  node: FileNode
  depth: number
  onSelect: (node: FileNode) => void
  selectedFile: string | null
  path: string
  searchQuery: string
  expandedFolders: Set<string>
}

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase()

  const iconClass = "h-4 w-4 text-muted-foreground"

  if (ext === "json") return <FileJson className={iconClass} />
  if (["tsx", "ts", "jsx", "js"].includes(ext || "")) return <FileCode className={iconClass} />
  if (["sql", "db"].includes(ext || "")) return <Database className={iconClass} />
  if (["py", "pyc", "pyw", "pyx"].includes(ext || "")) return <FileType className={cn(iconClass, "text-blue-500")} />
  if (["go", "mod", "sum"].includes(ext || "")) return <FileType className={cn(iconClass, "text-cyan-500")} />
  if (["rs", "toml"].includes(ext || "")) return <FileType className={cn(iconClass, "text-orange-600")} />
  if (["java", "class", "jar"].includes(ext || "")) return <FileType className={cn(iconClass, "text-red-600")} />
  if (["cpp", "cc", "cxx", "c", "h", "hpp"].includes(ext || ""))
    return <FileType className={cn(iconClass, "text-blue-600")} />
  if (["cs", "csx"].includes(ext || "")) return <FileType className={cn(iconClass, "text-purple-600")} />
  if (["rb", "erb", "rake"].includes(ext || "")) return <FileType className={cn(iconClass, "text-red-500")} />
  if (["php", "phtml"].includes(ext || "")) return <FileType className={cn(iconClass, "text-indigo-500")} />
  if (["swift"].includes(ext || "")) return <FileType className={cn(iconClass, "text-orange-500")} />
  if (["kt", "kts"].includes(ext || "")) return <FileType className={cn(iconClass, "text-purple-500")} />
  if (["sh", "bash", "zsh", "fish"].includes(ext || "")) return <File className={cn(iconClass, "text-green-600")} />
  if (["yml", "yaml"].includes(ext || "")) return <FileText className={cn(iconClass, "text-pink-500")} />
  if (["dockerfile", "dockerignore"].includes(fileName.toLowerCase()))
    return <File className={cn(iconClass, "text-blue-400")} />
  if (["css", "scss", "sass", "less"].includes(ext || ""))
    return <FileType className={cn(iconClass, "text-blue-500")} />
  if (["html", "htm"].includes(ext || "")) return <FileType className={cn(iconClass, "text-orange-500")} />
  if (["md", "mdx", "markdown"].includes(ext || "")) return <FileText className={cn(iconClass, "text-gray-400")} />
  if (["xml", "svg"].includes(ext || "")) return <FileText className={cn(iconClass, "text-yellow-600")} />
  if (["env", "gitignore", "editorconfig"].includes(ext || "")) return <File className={iconClass} />

  return <FileText className={iconClass} />
}

function FileTreeItem({
  node,
  depth,
  onSelect,
  selectedFile,
  path,
  searchQuery,
  expandedFolders,
}: FileTreeItemProps & { searchQuery: string; expandedFolders: Set<string> }) {
  const currentPath = path ? `${path}/${node.name}` : node.name
  const isSelected = selectedFile === currentPath

  const shouldBeOpen = expandedFolders.has(currentPath)
  const [isOpen, setIsOpen] = useState(shouldBeOpen)

  useEffect(() => {
    setIsOpen(shouldBeOpen)
  }, [shouldBeOpen])

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center gap-2 px-2 py-1 text-sm hover:bg-accent/50 rounded-sm transition-colors",
            isSelected && "bg-accent",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <ChevronRight className={cn("h-4 w-4 transition-transform text-muted-foreground", isOpen && "rotate-90")} />
          <Folder className="h-4 w-4 text-muted-foreground" />
          <span className="text-foreground">{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child, index) => (
              <FileTreeItem
                key={`${child.name}-${index}`}
                node={child}
                depth={depth + 1}
                onSelect={onSelect}
                selectedFile={selectedFile}
                path={currentPath}
                searchQuery={searchQuery}
                expandedFolders={expandedFolders}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect(node)}
      className={cn(
        "flex w-full items-center gap-2 px-2 py-1 text-sm hover:bg-accent/50 rounded-sm transition-colors",
        isSelected && "bg-accent",
      )}
      style={{ paddingLeft: `${depth * 12 + 32}px` }}
    >
      {getFileIcon(node.name)}
      <span className="text-foreground">{node.name}</span>
    </button>
  )
}

export function CodeViewer({ files, className }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCopied, setIsCopied] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const collectParentPaths = (
    nodes: FileNode[],
    query: string,
    parentPath = "",
    paths: Set<string> = new Set(),
  ): Set<string> => {
    if (!query.trim()) return paths

    const lowercaseQuery = query.toLowerCase()

    nodes.forEach((node) => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name

      if (node.type === "file" && node.name.toLowerCase().includes(lowercaseQuery)) {
        // Add all parent paths
        if (parentPath) {
          const parts = parentPath.split("/")
          let path = ""
          parts.forEach((part) => {
            path = path ? `${path}/${part}` : part
            paths.add(path)
          })
        }
      } else if (node.type === "folder") {
        if (node.children) {
          const childPaths = collectParentPaths(node.children, query, currentPath, paths)
          // If any children matched, add this folder too
          if (childPaths.size > paths.size || node.name.toLowerCase().includes(lowercaseQuery)) {
            paths.add(currentPath)
          }
        }
      }
    })

    return paths
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const paths = collectParentPaths(files, searchQuery)
      setExpandedFolders(paths)
    } else {
      setExpandedFolders(new Set())
    }
  }, [searchQuery, files])

  const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
    if (!query.trim()) return nodes

    const lowercaseQuery = query.toLowerCase()

    return nodes
      .map((node) => {
        if (node.type === "file") {
          return node.name.toLowerCase().includes(lowercaseQuery) ? node : null
        }

        if (node.type === "folder") {
          const filteredChildren = node.children ? filterNodes(node.children, query) : []
          if (filteredChildren.length > 0 || node.name.toLowerCase().includes(lowercaseQuery)) {
            return {
              ...node,
              children: filteredChildren,
            }
          }
        }

        return null
      })
      .filter((node): node is FileNode => node !== null)
  }

  const filteredFiles = filterNodes(files, searchQuery)

  const handleSelectFile = (node: FileNode, path?: string) => {
    if (node.type === "file") {
      setSelectedFile(node)
      setSelectedPath(path || node.name)
    }
  }

  const handleCopy = async () => {
    if (selectedFile?.content) {
      await navigator.clipboard.writeText(selectedFile.content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className={cn("flex h-[600px] overflow-hidden rounded-lg border border-border bg-background", className)}>
      {isSidebarOpen && (
        <div className="w-[280px] border-r border-border bg-muted/20 flex flex-col min-h-0">
          <div className="px-4 py-2.5 border-b border-border flex-shrink-0 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Files</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSidebarOpen(false)}>
              <PanelLeftClose className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="px-3 py-2 border-b border-border flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-8 pr-7 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
          <div className="py-2 flex-1 overflow-auto min-h-0">
            {filteredFiles.length > 0 ? (
              filteredFiles.map((node, index) => (
                <FileTreeItem
                  key={`${node.name}-${index}`}
                  node={node}
                  depth={0}
                  onSelect={(node) => {
                    const path = node.name
                    handleSelectFile(node, path)
                  }}
                  selectedFile={selectedPath}
                  path=""
                  searchQuery={searchQuery}
                  expandedFolders={expandedFolders}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No files found</div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col bg-background min-h-0">
        {selectedFile && selectedFile.content ? (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5 flex-shrink-0">
              <div className="flex items-center gap-2">
                {!isSidebarOpen && (
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsSidebarOpen(true)}>
                    <PanelLeft className="h-3.5 w-3.5" />
                  </Button>
                )}
                {getFileIcon(selectedFile.name)}
                <span className="text-sm text-muted-foreground font-mono">{selectedPath || selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setSelectedFile(null)
                    setSelectedPath(null)
                  }}
                  title="Close file"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopy}>
                  {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto bg-background min-h-0 min-w-0">
              <div className="font-mono text-sm inline-block min-w-full">
                {selectedFile.content.split("\n").map((line, index) => (
                  <div key={index} className="flex hover:bg-muted/30">
                    <span className="inline-block w-12 flex-shrink-0 text-right pr-4 py-0.5 text-muted-foreground select-none">
                      {index + 1}
                    </span>
                    <div className="flex-1 pr-4 py-0.5 whitespace-pre text-foreground">{line || " "}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="flex flex-col items-center gap-4">
              {!isSidebarOpen && (
                <Button variant="outline" size="sm" onClick={() => setIsSidebarOpen(true)} className="mb-2">
                  <PanelLeft className="h-4 w-4 mr-2" />
                  Show Files
                </Button>
              )}
              <p className="text-sm">Select a file to view its content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
