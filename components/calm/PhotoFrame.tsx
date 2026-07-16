import { cn } from "@/lib/utils"
import Image from "next/image"

export function PhotoFrame({
  src,
  alt,
  className,
  priority = false,
  sizes = "100vw",
  children,
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[var(--sn-surface-muted)]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {children}
    </div>
  )
}
