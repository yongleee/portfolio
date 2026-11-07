import { Badge } from '@/components/ui/badge'

/** Small accent-outlined tag for a project's tech stack. */
export function TechTag({ children }: { children: string }) {
    return (
        <Badge
            variant="outline"
            className="h-auto border-primary/35 bg-transparent px-2.5 py-0.75 font-mono text-[10px] font-normal tracking-[1px] text-primary"
        >
            {children}
        </Badge>
    )
}
