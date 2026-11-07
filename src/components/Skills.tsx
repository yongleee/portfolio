import { SKILLS } from '@/config'
import { Section } from './Section'

export function Skills() {
    return (
        <div className="border-y bg-linear-to-r from-[color-mix(in_srgb,var(--hot)_10%,color-mix(in_srgb,var(--background)_50%,transparent))] via-background/35 via-60% to-[color-mix(in_srgb,var(--primary)_6%,color-mix(in_srgb,var(--background)_40%,transparent))]">
            <Section id="skills" idx="02" title="TECH STACK">
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
                    {SKILLS.map((skill, i) => (
                        <li
                            key={skill}
                            className="group relative flex items-center justify-between gap-2.5 border bg-card/70 px-4 py-3.5 backdrop-blur-[6px] transition-colors duration-150 before:absolute before:-inset-y-px before:-left-px before:w-0.75 before:bg-primary before:opacity-0 before:transition-opacity hover:border-primary hover:bg-[color-mix(in_srgb,var(--primary)_12%,var(--card))] hover:before:opacity-100"
                        >
                            <span className="text-[17px] font-semibold tracking-[1px] transition-colors group-hover:text-primary">
                                {skill}
                            </span>
                            <i className="font-mono text-[10px] tracking-[1px] text-hot not-italic">
                                {String(i + 1).padStart(2, '0')}
                            </i>
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    )
}
