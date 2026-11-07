import { SOCIALS, site } from '@/config'
import { CyberButton } from './CyberButton'
import { Panel } from './Panel'
import { Section } from './Section'

export function Contact() {
    return (
        <Section id="contact" idx="04" title="CONTACT">
            <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <div>
                    <p className="skew-x-[-8deg] text-[clamp(60px,10vw,140px)] leading-[0.82] font-bold tracking-[-1px] text-hot text-shadow-glow-hot">
                        LET'S
                        <span className="block text-transparent text-shadow-none [-webkit-text-stroke:1.5px_var(--primary)]">
                            BUILD
                        </span>
                    </p>
                    <p className="mt-6 font-mono text-xs tracking-[3px] text-muted-foreground">
                        Deets to reach me.
                    </p>
                </div>
                <Panel label="TRANSMIT" code="SECURE">
                    <div className="p-5.5">
                        <CyberButton asChild className="w-full">
                            <a href={`mailto:${site.email}`}>SEND MESSAGE</a>
                        </CyberButton>
                        <ul className="mt-4.5">
                            {SOCIALS.map(([label, href]) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        {...(href.endsWith('.pdf') && {
                                            target: '_blank',
                                            rel: 'noopener noreferrer',
                                        })}
                                        className="flex items-center justify-between border-b px-1 py-3 text-[17px] font-semibold tracking-[2px] transition-[color,padding] duration-150 hover:pl-3 hover:text-primary focus-visible:pl-3 focus-visible:text-primary"
                                    >
                                        {label}
                                        <i className="font-mono text-xs text-hot not-italic">→</i>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Panel>
            </div>
        </Section>
    )
}
