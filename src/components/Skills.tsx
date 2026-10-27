import { Badge } from '@/components/ui/badge'
import { SKILLS } from '@/config'
import { Section } from './Section'

export function Skills() {
    return (
        <div className="bg-linear-to-b from-transparent via-primary/[0.025] to-transparent">
            <Section id="skills" label="// 02. SKILLS" title="TECH STACK">
                <ul className="flex flex-wrap gap-2.75">
                    {SKILLS.map((skill) => (
                        <li key={skill}>
                            <Badge
                                variant="outline"
                                className="h-auto px-4.5 py-2 font-mono text-[11px] font-normal tracking-[2px] text-muted-foreground duration-200 hover:border-primary hover:bg-primary/6 hover:text-primary hover:text-shadow-glow-sm"
                            >
                                {skill}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    )
}
