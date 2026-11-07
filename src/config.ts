// Everything you'd want to personalise lives here. The `site` block mirrors the
// design's Tweaks panel (identity, colours, theme, effects).

export type ThemeName = 'noir' | 'void' | 'purple'

export const site = {
    name: 'LEE YONG LE',
    title: 'FULL-STACK DEVELOPER',
    email: 'leeyl9797@gmail.com',
    /** 6-digit hex. */
    accent: '#00eeff',
    accent2: '#ff2a4a',
    theme: 'noir' as ThemeName,
    scanlines: true,
    /** Model designation shown in the nav, hero and footer. */
    model: ['MODEL LINE', '1.0'] as const,
    /** Time zone tag beside the hero's typed line. */
    tagId: 'GMT+8',
}

const THEMES: Record<ThemeName, { background: string; card: string; foreground: string }> = {
    noir: { background: '#07080c', card: '#0d1016', foreground: '#dfe3e8' },
    void: { background: '#030303', card: '#0e0e0e', foreground: '#e6e6e6' },
    purple: { background: '#0b0614', card: '#140b22', foreground: '#e0d6f0' },
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

export const TYPED_LINES = [site.title, 'OPEN TO WORK']

export const NAV_SECTIONS = ['about', 'skills', 'projects', 'contact'] as const

/** The About section's terminal session: each command and its output lines. */
export const TERMINAL: { cmd: string; out: string[]; ok?: boolean }[] = [
    { cmd: 'whoami', out: ['Full-Stack Developer'] },
    {
        cmd: 'cat bio.txt',
        out: [
            'Full-stack developer for clients',
            'ranging from telecom to government.',
            'Frontend, backend, sign-in and CI/CD,',
            'from building to shipping.',
        ],
    },
    {
        cmd: 'cat history.log',
        out: ['2023.10  Full-Stack Developer, GlobeOSS'],
    },
    { cmd: 'echo $STATUS', out: ['AVAILABLE FOR WORK'], ok: true },
]

export const STATS: [value: string, label: string][] = [
    ['03+', 'YEARS ACTIVE'],
    ['06+', 'SYSTEMS BUILT'],
]

export const SKILLS = [
    'React',
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'shadcn/ui',
    'Zustand',
    'Redux',
    'TanStack Query',
    'Node.js',
    'Express',
    'Laravel',
    'PHP',
    'Java',
    'PostgreSQL',
    'MySQL',
    'SQL Server',
    'Redis',
    'Docker',
    'Nginx',
    'Azure',
    'GitLab CI',
    'Keycloak',
    'Entra ID',
]

/** The case-file page shown at #project-<num>. */
export interface ProjectDetails {
    role: string
    client: string
    year: string
    duration: string
    status: string
    team: string
    overview: string
    challenge: string
    outcome: string
    metrics: [label: string, value: string][]
    log: [version: string, entry: string][]
}

/** Image slots: `card` on the work log, the rest on the case-file page. */
export type ImageSlot =
    | 'card'
    | 'hero'
    | 'architecture'
    | 'detail'
    | 'process1'
    | 'process2'
    | 'process3'

export interface Project {
    num: string
    name: string
    img: string
    desc: string
    tags: string[]
    /** Public repo URL; the card shows a GITHUB link only when set. */
    gh?: string
    /** Live site URL; the card shows a LIVE DEMO link only when set. */
    live?: string
    /** Paths under public/; slots left out show a hatched placeholder. */
    images?: Partial<Record<ImageSlot, string>>
    details: ProjectDetails
}

export const PROJECTS: Project[] = [
    {
        num: '01',
        name: 'AI CONTROL PANEL',
        img: 'AI GATEWAY CONSOLE',
        desc: 'Operator console for an in-house AI gateway and the local models and GPUs behind it.',
        tags: ['Next.js', 'TypeScript', 'TanStack Query', 'Keycloak'],
        images: {
            card: '/projects/ai-control-panel/card.svg',
            hero: '/projects/ai-control-panel/hero.svg',
            architecture: '/projects/ai-control-panel/architecture.svg',
            detail: '/projects/ai-control-panel/detail.svg',
            process1: '/projects/ai-control-panel/process-provider.svg',
            process2: '/projects/ai-control-panel/process-boundary.svg',
            process3: '/projects/ai-control-panel/process-download.svg',
        },
        details: {
            role: 'LEAD FRONTEND DEV',
            client: 'IN-HOUSE PLATFORM',
            year: '2026',
            duration: '5 MONTHS',
            status: 'ONGOING',
            team: '2',
            overview:
                "The operator console for a company's AI platform, fronting an OpenAI-compatible AI gateway, a local LLM engine, Rancher cluster metrics and NVIDIA GPU telemetry. Operators use it to register providers, build routed model groups, attach guardrails, issue API keys and track spend. As frontend lead I wrote most of the codebase and set its architecture and conventions.",
            challenge:
                'Fronting five upstream systems, each with its own auth, units and failure modes, without a single credential reaching the browser, while keeping every screen live without WebSockets.',
            outcome:
                'Route → controller → service → client layers with 5s-cached services and compile-time server-only guards; server-rendered pages that poll every 10s and pause on hidden tabs; Keycloak OIDC login with JWKS-verified tokens; react-hook-form + zod forms for 9 provider types, schema-driven routing strategies, keyword guardrails with presets, and API keys with rate and budget limits; a Hugging Face download wizard, DCGM GPU and MIG metrics and a usage dashboard; lint, typecheck and build gated in GitLab CI.',
            metrics: [
                ['API ROUTES', '48'],
                ['PROVIDER TYPES', '9'],
                ['UPSTREAMS', '5'],
            ],
            log: [
                ['v0.1', 'Rancher cluster overview + events'],
                ['v0.2', 'CI gate + live polling'],
                ['v0.3', 'Local models + HF downloads'],
                ['v0.5', 'Gateway registry: providers, groups'],
                ['v0.6', 'Keycloak OIDC login'],
                ['v0.7', 'API keys + data tables'],
                ['v0.8', 'Guardrails + usage dashboard'],
            ],
        },
    },
    {
        num: '02',
        name: 'BROADBAND PROVISIONING PORTAL',
        img: 'SUBSCRIBER PROVISIONING',
        desc: "Staff portal where a telecom operator's helpdesk and field installers provision broadband and VoIP subscribers and diagnose their routers.",
        tags: ['Laravel', 'React', 'Inertia.js', 'TypeScript', 'MySQL'],
        images: {
            card: '/projects/broadband-provisioning-portal/card.svg',
            hero: '/projects/broadband-provisioning-portal/hero.svg',
            architecture: '/projects/broadband-provisioning-portal/architecture.svg',
            detail: '/projects/broadband-provisioning-portal/detail.svg',
            process1: '/projects/broadband-provisioning-portal/process-edit-chain.svg',
            process2: '/projects/broadband-provisioning-portal/process-access.svg',
            process3: '/projects/broadband-provisioning-portal/process-ont.svg',
        },
        details: {
            role: 'TEAM LEAD',
            client: 'TELECOM OPERATOR',
            year: '2026',
            duration: '1 MONTH',
            status: 'ONGOING',
            team: '3',
            overview:
                "A rebuild of a telecom operator's legacy provisioning portal, where helpdesk staff and field installers look up broadband and VoIP subscribers, provision them in the operator's provisioning system and diagnose their routers remotely. Laravel 13 and Inertia with React replace a CodeIgniter app screen by screen, over the same shared database. I led the team, owned the integration layer and set the module, form and documentation conventions.",
            challenge:
                'Porting account edits onto a provisioning system with no transactions: one multi-field change becomes a chain of per-field calls that must run renames last, stop at the first refusal and report exactly which changes were already applied.',
            outcome:
                'A hardened provisioning client where lookups throw, writes return the error code and every log line has passwords redacted; 10 broadband and VoIP provisioning endpoints that send only changed fields, run renames last and stop at the first refusal; a self-service backend client covering every legacy router call (connected devices, Wi-Fi, scheduled reboots, line diagnostics) with the modem ID resolved on the server after a scope check; a broadband list with browse, installer search-only and blocked access modes, and a workspace whose tools are child routes under a persistent header; permission and subscriber-group checks on every record and action, none of which the legacy app enforced on the server; Huawei NCE fixes that keep an ONT record until the controller confirms the service is gone; an LDAP empty-password bypass patched in the legacy portal; a local MySQL copy of the shared DB with credentials blanked, for development on the VPN; OpenAPI docs and shared react-hook-form + zod building blocks for the role, user and department screens.',
            metrics: [
                ['PROVISIONING ENDPOINTS', '10'],
                ['ROUTER OPERATIONS', '11'],
                ['EXTERNAL SYSTEMS', '3'],
            ],
            log: [
                ['v0.1', 'Legacy audit + connected devices'],
                ['v0.2', 'Legacy LDAP bypass patched'],
                ['v0.3', 'Broadband list + workspace'],
                ['v0.4', 'Router API + local DB copy'],
                ['v0.5', 'Broadband + VoIP provisioning API'],
                ['v0.6', 'ONT sync fixes + OpenAPI docs'],
                ['v0.7', 'Role, user + department forms'],
            ],
        },
    },
    {
        num: '03',
        name: 'UNIFIED SIGN-IN GATEWAY',
        img: 'IDENTITY FLOWS',
        desc: 'Custom Keycloak login layer that sends staff to Entra ID or a local account from one username-first page.',
        tags: ['Keycloak', 'Java', 'Entra ID', 'Microsoft Graph', 'GitLab CI'],
        images: {
            card: '/projects/unified-sign-in-gateway/card.svg',
            hero: '/projects/unified-sign-in-gateway/hero.svg',
            architecture: '/projects/unified-sign-in-gateway/architecture.svg',
            detail: '/projects/unified-sign-in-gateway/detail.svg',
            process1: '/projects/unified-sign-in-gateway/process-routing.svg',
            process2: '/projects/unified-sign-in-gateway/process-silent-sso.svg',
            process3: '/projects/unified-sign-in-gateway/process-audit.svg',
        },
        details: {
            role: 'SOLO DEVELOPER',
            client: 'TELECOM OPERATOR',
            year: '2026',
            duration: '4 MONTHS',
            status: 'DEPLOYED',
            team: '1',
            overview:
                "A custom Keycloak plugin that replaces the stock browser login for two related internal staff apps: one username-first page that routes each user to Entra ID or a local password, silent SSO from one app's Keycloak into the other's, and an audit trail of every login. I built it alone, from the provider code and branded login theme to the two-instance local dev setup and the CI deploy.",
            challenge:
                'Carrying one identity across an Entra ID redirect and a silent SSO hop between two Keycloak instances, when each leg runs in its own auth session and notes set in one flow vanish in the next, without redirect loops or duplicate accounts.',
            outcome:
                'A username-first login that routes to Entra ID or a local password by configurable mode, with Microsoft Graph existence checks, domain-append candidates, cached lookups, timeouts and fail-open rules; silent prompt=none SSO between the two instances that links or creates the account and skips First Broker Login; email-first broker username matching with no auto-created users; a single-session enforcer that lists the other devices and lets the user end them or back out, working around resetFlow() in the post-broker flow; a minimum-password-age policy and a group-fenced user and role REST API; JSON audit events for each login step, tagged with IP, VPN range and Graph failure cause and correlated by session ID; a mobile-responsive branded theme with inline scripts moved out for CSP; 159 JUnit and Mockito tests; GitLab CI that builds the JAR and deploys to both production instances behind a manual gate.',
            metrics: [
                ['CUSTOM PROVIDERS', '13'],
                ['SPI TYPES', '6'],
                ['UNIT TESTS', '159'],
            ],
            log: [
                ['v0.1', 'Username-first login + validator'],
                ['v0.2', 'Audit logging + password age policy'],
                ['v0.3', 'Mobile theme + local Keycloak dev'],
                ['v0.4', 'Silent SSO across two instances'],
                ['v0.5', 'Broker linking + single session'],
                ['v0.6', 'GitLab CI/CD to production'],
                ['v0.7', 'VPN audit + Graph diagnostics'],
            ],
        },
    },
    {
        num: '04',
        name: 'BUSINESS CODE REGISTRY',
        img: 'CLASSIFICATION PLATFORM',
        desc: "Government platform for managing, publishing and AI-searching a country's official business classification codes.",
        tags: ['Next.js', 'Laravel', 'SQL Server', 'Azure'],
        images: {
            card: '/projects/business-code-registry/card.svg',
            hero: '/projects/business-code-registry/hero.svg',
            architecture: '/projects/business-code-registry/architecture.svg',
            detail: '/projects/business-code-registry/detail.svg',
            process1: '/projects/business-code-registry/process1.svg',
            process2: '/projects/business-code-registry/process2.svg',
            process3: '/projects/business-code-registry/process-email.svg',
        },
        details: {
            role: 'TEAM LEAD',
            client: 'GOVERNMENT AGENCY',
            year: '2025',
            duration: '23 MONTHS',
            status: 'DEPLOYED',
            team: '4',
            overview:
                'An admin console, Laravel API and bilingual public portal for three national classification systems covering industries, products and consumption. Admins upload, edit and publish code sets; the public searches them by keyword, code or hierarchy with AI assistants. I led the team and set the architecture, repo structure and coding standards.',
            challenge:
                'Importing large Excel code sets into SQL Server without losing leading zeros or hitting parameter limits, then publishing them atomically while keeping a full audit trail.',
            outcome:
                'Chunked, type-enforced Excel import for all three systems; a draft-to-publish workflow that streams live progress over SSE and re-indexes the AI search; queued SMTP email notifications for feedback, enquiries and replies, rate-limited and retried by background workers; Entra ID SSO with role-based access; containerised CI/CD to Azure across dev, staging and production.',
            metrics: [
                ['CODE SYSTEMS', '3'],
                ['API ROUTES', '111'],
                ['ADMIN SCREENS', '26'],
            ],
            log: [
                ['v0.1', 'Architecture + team standards'],
                ['v0.3', 'Excel import, 3 code systems'],
                ['v0.5', 'Next.js admin + public portal'],
                ['v0.7', 'Edit / publish + audit trail'],
                ['v0.9', 'Entra ID SSO, roles, Power BI'],
                ['v1.0', 'Azure CI/CD + SSE publishing'],
                ['v1.3', 'Laravel 13 / PHP 8.4 upgrade'],
            ],
        },
    },
    {
        num: '05',
        name: 'TOURISM ANALYTICS DASHBOARD',
        img: 'VISITOR STATISTICS',
        desc: 'Internal dashboard for exploring national tourism statistics derived from mobile network data.',
        tags: ['Next.js', 'Express', 'Microsoft Fabric', 'Azure Maps', 'Entra ID'],
        images: {
            card: '/projects/tourism-analytics-dashboard/card.svg',
            hero: '/projects/tourism-analytics-dashboard/hero.svg',
            architecture: '/projects/tourism-analytics-dashboard/architecture.svg',
            detail: '/projects/tourism-analytics-dashboard/detail.svg',
            process1: '/projects/tourism-analytics-dashboard/process-auth.svg',
            process2: '/projects/tourism-analytics-dashboard/process-expiry.svg',
            process3: '/projects/tourism-analytics-dashboard/process-stale.svg',
        },
        details: {
            role: 'FULL-STACK DEVELOPER',
            client: 'GOVERNMENT AGENCY',
            year: '2025',
            duration: '10 MONTHS',
            status: 'DEPLOYED',
            team: '3',
            overview:
                'A sign-in-only dashboard for national tourism statistics derived from mobile network data: domestic, inbound and outbound dashboards, a drag-and-drop chart builder for advanced users, Power BI QA reports and CMS-managed technical notes. A Next.js app reaches an Express API over a Microsoft Fabric warehouse through its own proxy. I built most of the API, the three overview dashboards, the export system and the auth and deployment chain.',
            challenge:
                'Checking every API call against Entra ID without calling Microsoft Graph on each request, while keeping cookie, access-token and ID-token lifetimes in step so an expired session goes back to sign-in instead of ending in a silent 401.',
            outcome:
                'An Express 5 API with 21 routes over a pooled ODBC connection to Microsoft Fabric; KPI cards, top-five rankings, transport-mode and trend charts that compare any day, month, quarter or year range with the period before and default to the latest loaded date; an Azure Maps points-of-interest layer; CSV, HTML, image and PowerPoint exports that stamp each widget with its description and timestamp; Entra ID SSO behind a Next.js proxy, with Graph-verified tokens cached in Redis under hashed keys, failing closed, and JWKS-verified role claims gating the advanced dashboard; a request-ID guard against stale responses and memoised ECharts in the chart builder; Docker images shipped to Azure App Service through dev, staging and production pipeline stages.',
            metrics: [
                ['TOURISM DASHBOARDS', '3'],
                ['API ROUTES', '21'],
                ['EXPORT FORMATS', '4'],
            ],
            log: [
                ['v0.1', 'Visitor card + chart APIs'],
                ['v0.2', 'Overview dashboards + map'],
                ['v0.3', 'Date filters + CSV / image export'],
                ['v0.4', 'PowerPoint export + POI map'],
                ['v0.5', 'Split into 3 tourism dashboards'],
                ['v0.6', 'Azure DevOps CI/CD'],
                ['v0.7', 'Redis token cache + role gates'],
            ],
        },
    },
    {
        num: '06',
        name: 'TELECOM STATS PORTAL',
        img: 'STATISTICS DASHBOARDS',
        desc: "Public portal where a telecom regulator publishes the industry's quarterly statistics as interactive charts and maps.",
        tags: ['React', 'TypeScript', 'Chart.js', 'Leaflet', 'Express'],
        images: {
            card: '/projects/telecom-stats-portal/card.svg',
            hero: '/projects/telecom-stats-portal/hero.svg',
            architecture: '/projects/telecom-stats-portal/architecture.svg',
            detail: '/projects/telecom-stats-portal/detail.svg',
            process1: '/projects/telecom-stats-portal/process-sync.svg',
            process2: '/projects/telecom-stats-portal/process-legend.svg',
            process3: '/projects/telecom-stats-portal/process-api.svg',
        },
        details: {
            role: 'FULL-STACK DEVELOPER',
            client: 'TELECOM REGULATOR',
            year: '2024',
            duration: '9 MONTHS',
            status: 'DEPLOYED',
            team: '5',
            overview:
                "A national regulator's public statistics portal: interactive dashboards for six communications and postal sectors, plus a data catalogue, query builder and reports, served by a React app with an Express BFF over an Express and SQL Server API. I built the chart and map components and the dashboards on them, and wrote the API endpoints behind them.",
            challenge:
                'Keeping a Leaflet choropleth and the Chart.js charts beside it in sync under one quarter filter, so a click on a region, bar or legend item updates every view without re-render loops or stale data.',
            outcome:
                'Reusable Chart.js bar and line components with click-to-highlight and click-away reset; a responsive region-level choropleth with hover popups and click-to-filter, linked to the charts on five dashboards; a shared quarter slider that fetches map and chart data separately; legend toggles that recalculate the total line on the postal and courier infrastructure charts; penetration-rate views for broadband, mobile and pay TV; Express + SQL Server endpoints for subscriptions and penetration rates; Jest tests for the BFF fetch and logging helpers.',
            metrics: [
                ['SECTOR DASHBOARDS', '6'],
                ['MAP-LINKED VIEWS', '5'],
                ['CHART ENDPOINTS', '34'],
            ],
            log: [
                ['v0.1', 'Chart kit + app shell'],
                ['v0.2', 'Broadband subscription APIs'],
                ['v0.3', 'Choropleth + penetration rates'],
                ['v0.4', 'Postal infra chart + map'],
                ['v0.5', 'Responsive map, mobile + pay TV'],
                ['v0.6', 'Legend totals + BFF unit tests'],
                ['v0.7', 'Traffic charts + filter polish'],
            ],
        },
    },
]

export const SOCIALS: [label: string, href: string][] = [
    ['GITHUB', 'https://github.com/yongleee'],
    ['LINKEDIN', 'https://www.linkedin.com/in/yong-le-lee-102a18191'],
    ['RESUME.PDF', '/Lee_Yong_Le_Resume.pdf'],
]
