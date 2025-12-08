"use client"

import { useState, useEffect } from "react"
import { ChevronRight, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface TreeNode {
  name: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  children?: TreeNode[]
  onClick?: () => void
}

interface TreeProps {
  data: TreeNode[]
  className?: string
  showSearch?: boolean
}

interface TreeItemProps {
  node: TreeNode
  depth: number
  path: string
  searchQuery: string
  expandedNodes: Set<string>
}

function TreeItem({ node, depth, path, searchQuery, expandedNodes }: TreeItemProps) {
  const currentPath = path ? `${path}/${node.name}` : node.name
  const shouldBeOpen = expandedNodes.has(currentPath)
  const [isOpen, setIsOpen] = useState(shouldBeOpen)
  const hasChildren = node.children && node.children.length > 0
  const Icon = node.icon

  useEffect(() => {
    setIsOpen(shouldBeOpen)
  }, [shouldBeOpen])

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
    if (node.onClick) {
      node.onClick()
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm transition-colors group",
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren && (
          <ChevronRight
            className={cn("h-4 w-4 transition-transform text-muted-foreground flex-shrink-0", isOpen && "rotate-90")}
          />
        )}
        {!hasChildren && <span className="w-4" />}
        {Icon && <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
        <span className="text-foreground truncate">{node.name}</span>
      </button>
      {isOpen && hasChildren && (
        <div>
          {node.children!.map((child, index) => (
            <TreeItem
              key={`${child.name}-${index}`}
              node={child}
              depth={depth + 1}
              path={currentPath}
              searchQuery={searchQuery}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Tree({ data, className, showSearch = true }: TreeProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const collectParentPaths = (
    nodes: TreeNode[],
    query: string,
    parentPath = "",
    paths: Set<string> = new Set(),
  ): Set<string> => {
    if (!query.trim()) return paths

    const lowercaseQuery = query.toLowerCase()

    nodes.forEach((node) => {
      const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name

      if (node.name.toLowerCase().includes(lowercaseQuery)) {
        // Add all parent paths
        if (parentPath) {
          const parts = parentPath.split("/")
          let path = ""
          parts.forEach((part) => {
            path = path ? `${path}/${part}` : part
            paths.add(path)
          })
        }
        paths.add(currentPath)
      }

      if (node.children) {
        collectParentPaths(node.children, query, currentPath, paths)
      }
    })

    return paths
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const paths = collectParentPaths(data, searchQuery)
      setExpandedNodes(paths)
    } else {
      setExpandedNodes(new Set())
    }
  }, [searchQuery, data])

  const filterNodes = (nodes: TreeNode[], query: string): TreeNode[] => {
    if (!query.trim()) return nodes

    const lowercaseQuery = query.toLowerCase()

    return nodes
      .map((node) => {
        const filteredChildren = node.children ? filterNodes(node.children, query) : []

        if (node.name.toLowerCase().includes(lowercaseQuery) || filteredChildren.length > 0) {
          return {
            ...node,
            ...(filteredChildren.length > 0 || node.children
              ? { children: filteredChildren.length > 0 ? filteredChildren : node.children }
              : {}),
          }
        }

        return null
      })
      .filter((node): node is TreeNode => node !== null)
  }

  const filteredData = filterNodes(data, searchQuery)

  return (
    <div className={cn("flex flex-col rounded-lg border border-border bg-background", className)}>
      {showSearch && (
        <div className="px-3 py-2 border-b border-border flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-7 text-sm bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="py-2 overflow-auto">
        {filteredData.length > 0 ? (
          filteredData.map((node, index) => (
            <TreeItem
              key={`${node.name}-${index}`}
              node={node}
              depth={0}
              path=""
              searchQuery={searchQuery}
              expandedNodes={expandedNodes}
            />
          ))
        ) : (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">No items found</div>
        )}
      </div>
    </div>
  )
}