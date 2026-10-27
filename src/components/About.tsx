import { Card } from '@/components/ui/card'
import { STATS, TERMINAL } from '@/config'
import { cn } from '@/lib/utils'
import { Section } from './Section'

const WINDOW_DOTS = ['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]']

function Terminal() {
    return (
        <Card className="gap-0 py-0 ring-border">
            <div className="flex items-center gap-1.75 border-b bg-primary/3 px-4 py-2.75">
                {WINDOW_DOTS.map((bg) => (
                    <span key={bg} className={cn('size-2.5 shrink-0 rounded-full', bg)} />
                ))}
                <span className="ml-2.5 font-mono text-[11px] tracking-[1px] text-muted-foreground">
                    ~/profile.sh
                </span>
            </div>
            <div className="px-6 py-5.5 font-mono text-[12.5px] leading-[1.95]">
                {TERMINAL.map(({ cmd, out, ok }, i) => (
                    <div key={cmd} className={cn(i > 0 && 'mt-2.5')}>
                        <div>
                            <span className="text-primary">$ </span>
                            {cmd}
                        </div>
                        {out.map((line) => (
                            <div
                                key={line}
                                className={cn(
                                    'pl-4.5 whitespace-pre-wrap',
                                    ok ? 'text-online' : 'text-muted-foreground',
                                )}
                            >
                                {line}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Card>
    )
}

export function About() {
    return (
        <Section id="about" label="// 01. ABOUT" title="SYSTEM PROFILE">
            <div className="grid items-start gap-13 md:grid-cols-2">
                <Terminal />
                <div className="grid grid-cols-2 gap-4.5">
                    {STATS.map(([value, label]) => (
                        <Card
                            key={label}
                            className="relative gap-0 px-6 py-7 ring-border before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-linear-to-r before:from-primary before:to-transparent"
                        >
                            <div className="font-mono text-[44px] leading-none text-primary">
                                {value}
                            </div>
                            <div className="mt-1.5 font-mono text-[10px] tracking-[2px] text-muted-foreground">
                                {label}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </Section>
    )
}
