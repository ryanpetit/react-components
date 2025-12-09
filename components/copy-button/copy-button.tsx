"use client"
import { cn } from "@/lib/utils"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useEffect, useState } from "react"

function copyToClipboardWithMeta(value: string) {
    navigator.clipboard.writeText(value)
}

export function CopyButton({
    value,
    className,
    ...props
}: { value: string, className?: string }) {
    const [hasCopied, setHasCopied] = useState(false)

    useEffect(() => {
        setTimeout(() => {
            setHasCopied(false)
        }, 2000)
    }, [hasCopied])

    return (
        <button
            className={cn(
                "relative z-10 h-4 w-4 hover:cursor-pointer",
                className
            )}
            onClick={() => {
                copyToClipboardWithMeta(
                    value,
                )
                setHasCopied(true)
            }}
            {...props}
        >
            <span className="sr-only">Copy</span>
            {hasCopied ? (
                <CheckIcon className="h-full w-full text-green-300" />
            ) : (
                <CopyIcon className="h-full w-full" />
            )}
        </button>
    )
}