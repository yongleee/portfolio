import { SOCIALS, site } from '@/config'
import { CyberButton } from './CyberButton'
import { Section } from './Section'

export function Contact() {
    return (
        <Section id="contact" label="// 04. CONTACT" className="pb-30 text-center md:pb-30">
            <h2 className="mb-3.5 text-[clamp(44px,9vw,110px)] leading-none font-bold tracking-[-1px] text-transparent transition-[-webkit-text-stroke-color,text-shadow] duration-300 [-webkit-text-stroke:1px_var(--muted-foreground)] hover:[-webkit-text-stroke-color:var(--primary)] hover:text-shadow-[0_0_80px_color-mix(in_srgb,var(--primary)_14%,transparent)]">
                LET'S BUILD
            </h2>
            <p className="mb-9.5 font-mono text-xs tracking-[3px] text-muted-foreground">
                READY TO COLLABORATE? INITIATE TRANSMISSION.
            </p>
            <CyberButton asChild>
                <a href={`mailto:${site.email}`}>SEND MESSAGE</a>
            </CyberButton>
            <ul className="mt-9.5 flex flex-wrap justify-center gap-x-9 gap-y-3">
                {SOCIALS.map(([label, href]) => (
                    <li key={label}>
                        <a
                            href={href}
                            className="font-mono text-[11px] tracking-[3px] text-muted-foreground transition-colors hover:text-primary hover:text-shadow-glow-sm"
                        >
                            {label}
                        </a>
                    </li>
                ))}
            </ul>
        </Section>
    )
}
