// Everything you'd want to personalise lives here. The `site` block mirrors the
// design's Tweaks panel (identity, colours, theme, effects).

export type ThemeName = 'noir' | 'void' | 'purple'

export const site = {
    name: 'YOUR NAME',
    title: 'FULL-STACK DEVELOPER',
    email: 'hello@yoursite.dev',
    /** 6-digit hex; also drives the hero canvas colour. */
    accent: '#00eeff',
    accent2: '#ff0066',
    theme: 'noir' as ThemeName,
    scanlines: true,
}

const THEMES: Record<ThemeName, { background: string; card: string; foreground: string }> = {
    noir: { background: '#050a14', card: '#091622', foreground: '#c8d8f0' },
    void: { background: '#050505', card: '#0f0f0f', foreground: '#e0e0e0' },
    purple: { background: '#0b0614', card: '#130a22', foreground: '#d8c8f0' },
}

/** Overrides the shadcn tokens in index.css with the configured accent/theme. */
export function applyTheme() {
    const root = document.documentElement.style
    root.setProperty('--primary', site.accent)
    root.setProperty('--hot', site.accent2)
    for (const [token, value] of Object.entries(THEMES[site.theme])) {
        root.setProperty(`--${token}`, value)
    }
}

export const TYPED_LINES = [site.title, 'OPEN TO WORK', 'BUILDING THE FUTURE']

export const NAV_SECTIONS = ['about', 'skills', 'projects', 'contact'] as const

export const STATS: [value: string, label: string][] = [
    ['05+', 'YEARS ACTIVE'],
    ['30+', 'PROJECTS SHIPPED'],
    ['12', 'OPEN SOURCE LIBS'],
    ['99%', 'CLIENT SATISFACTION'],
]

export const SKILLS = [
    'React', 'TypeScript', 'Node.js', 'Python', 'Rust',
    'WebGL', 'Three.js', 'GraphQL', 'PostgreSQL', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'WebAssembly', 'Go', 'TensorFlow',
]

export interface Project {
    num: string
    name: string
    img: string
    desc: string
    tags: string[]
    gh: string
    live: string
}

export const PROJECTS: Project[] = [
    {
        num: '01', name: 'NEURAL INTERFACE', img: 'AI DASHBOARD',
        desc: 'Real-time ML inference dashboard with live data visualization and predictive analytics.',
        tags: ['React', 'TensorFlow', 'WebGL'], gh: '#', live: '#',
    },
    {
        num: '02', name: 'VOID PROTOCOL', img: 'SECURE COMMS',
        desc: 'Decentralized zero-knowledge messaging layer — provably private, chain-agnostic.',
        tags: ['Rust', 'Solidity', 'WASM'], gh: '#', live: '#',
    },
    {
        num: '03', name: 'CHROME RUNNER', img: 'GAME ENGINE',
        desc: 'Custom 3D game engine written from scratch with a deferred rendering pipeline.',
        tags: ['C++', 'OpenGL', 'GLSL'], gh: '#', live: '#',
    },
    {
        num: '04', name: 'DATA PHANTOM', img: 'ANALYTICS',
        desc: 'Event-stream analytics platform handling millions of rows at sub-millisecond latency.',
        tags: ['Go', 'Kafka', 'ClickHouse'], gh: '#', live: '#',
    },
]

export const SOCIALS: [label: string, href: string][] = [
    ['GITHUB', '#'],
    ['LINKEDIN', '#'],
    ['TWITTER', '#'],
    ['RESUME.PDF', '#'],
]
