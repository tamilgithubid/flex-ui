import Image from "next/image";
import { cn } from "@/lib/utils";

export function EditorialCover({
  asset, className, priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px",
}: {
  asset: { src: string; alt: string };
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("relative aspect-video overflow-hidden bg-zinc-950", className)}>
      <Image src={asset.src} alt={asset.alt} fill sizes={sizes} priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025] motion-reduce:transform-none" />
    </div>
  );
}
