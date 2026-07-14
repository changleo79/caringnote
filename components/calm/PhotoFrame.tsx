import { cn } from "@/lib/utils"

export function PhotoFrame({
  src,
  alt,
  className,
  ken = false,
  children,
}: {
  src: string
  alt: string
  className?: string
  ken?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[var(--sn-ink)]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover",
          ken && "sn-hero-ken"
        )}
      />
      {children}
    </div>
  )
}
