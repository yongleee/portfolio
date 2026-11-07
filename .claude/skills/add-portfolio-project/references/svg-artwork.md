# Wireframe SVG artwork

The images stand in for screenshots the user can't share. They should read as "a blurred
glimpse of a real product": the right layout, the right kinds of components, the site's
colours — and zero real content. For style, open one or two images an existing real
project actually uses (the paths in its `images`) before drawing. Copy their look, not
their dimensions — older files may predate the current slot ratios, and a project
folder can hold retired files no slot points at.

## Contents

1. Slots and sizes
2. Palette
3. Drawing vocabulary
4. Anonymization
5. Layout pitfalls

## 1. Slots and sizes

Check the aspect classes in `ProjectPage.tsx` / `Projects.tsx` before drawing — the user
adjusts them, and the code wins over this table. Draw each file at the slot's exact
ratio; slots use `object-contain` on the page (so a wrong ratio letterboxes) and
`object-cover` on the card (so a wrong ratio crops).

| Slot | Where | viewBox | Show |
|---|---|---|---|
| `card` | Work-log card, `h-44`, `object-cover` | `0 0 1200 352` | Wide crop of the main screen. Keep key content in the central ~70%: narrow cards crop the sides. |
| `hero` | FEED_00 "MAIN VISUAL", `aspect-[16/7]` | `0 0 1600 700` | Composite overview: main app window plus a second surface (phone, popup) — the whole product in one look. |
| `architecture` | FEED_01, `aspect-[16/10]` | `0 0 800 500` | System diagram: clients → core service → data/infra, labelled with tech names. |
| `detail` | FEED_02, `aspect-[16/10]` | `0 0 800 500` | One signature feature up close (e.g. a live progress panel, an editor, a chart). |
| `process1`–`3` | PROCESS 01–03, `aspect-4/3` | `0 0 400 300` | Sketches of how things work: a data flow, a state machine, a pipeline, a queue. Tie at least one to the `challenge` text. |

Name files after their slot (`card.svg`, `hero.svg`, …; a descriptive name like
`process-email.svg` is fine for process sketches) so `check_artwork.py` can check ratios.

## 2. Palette

Matches the default `noir` theme with the cyan accent. If `site.accent` / `site.theme`
in `src/config.ts` have changed, shift the accent values to match — SVGs loaded through
`<img>` can't read CSS variables.

| Token | Hex | Use |
|---|---|---|
| bg | `#07111c` | Canvas, app background |
| panel | `#0a1724` / `#0b1a28` | Sidebars, cards, rows |
| panel-raised | `#0d2133` | Table headers, device bodies, chrome |
| rule | `#14304a` / `#16324a` | Borders, dividers, grid patterns |
| bar-dim / bar | `#1b3550` / `#2a4a66` | Placeholder text bars, outlines |
| muted | `#4a6a88` | Secondary labels, inactive tabs |
| text | `#c8d8f0` | Headings (as bars at ~0.85 opacity), primary labels |
| accent | `#00eeff` | Active state, primary buttons, arrows, progress |
| hot | `#ff0066` | Live indicators, warnings, retries, AI assistant |
| amber / violet | `#ffb020` / `#7c8cff` | Extra status colours (edited / new) |

## 3. Drawing vocabulary

- **Text is bars.** Body copy, names and values are rounded rects (`rx="2"`, height 6–10)
  of varied widths. Real words are allowed only for generic UI labels (tab names, step
  names, "SEARCH", "EN / BM") and diagram labels (tech and component names).
- **Type:** `font-family="ui-monospace, Menlo, Consolas, monospace"`, sizes 8–11,
  `letter-spacing` 1–2, labels in caps — matches the site's HUD look.
- **Reuse with `<defs>` + `<use href>`:** define a table row, a status pill, a result
  card once, then place copies. Keeps files small and consistent.
- **Status pills:** a pill with a 12% fill and 60% stroke in a status colour, plus a
  short solid bar inside.
- **Arrows:** a `<marker>` with `orient="auto"`; solid accent lines for the main flow,
  dashed `#4a6a88` for secondary flows.
- **Devices:** a rounded frame plus a `<clipPath>` for the screen; window chrome is a
  32px bar with three dots and an empty address pill — never a real URL.
- **Depth:** `feDropShadow` (dy 18, stdDeviation 22, black at 0.55) on floating surfaces;
  a faint radial accent glow or a dot/grid pattern behind them.
- **Panel headers:** a solid accent strip with a dark-text caps label (`CORE // API`)
  echoes the site's own Panel component.
- Add a short comment at the top of each file saying what it shows and that it holds no
  real data.

## 4. Anonymization

The artwork must not identify the client or expose anything internal:

- No client, agency or company names, acronyms, logos, emblems or brand colours.
- No internal codenames — including in file names and the `/projects/<slug>/` path.
- No domains, URLs, hostnames, emails, IPs.
- No real records: classification codes, customer rows, people's names, figures.
- No geography: no real country or region outlines, no state or city names. Draw maps
  as abstract tiles (hexes, a grid) and pass the region names to `--forbid`.
- Watch for fingerprints: real menu labels or a full list of a client's distinctive
  categories can identify them as surely as a name. Use a few generic or partial labels.
- Tech names (Laravel, SQL Server, Redis, Azure) are fine — they are already in `tags`.

Run `check_artwork.py` with every sensitive term as `--forbid`; it searches file names
and SVG text case-insensitively.

## 5. Layout pitfalls

These came up in practice — check each image for them before moving on:

- **Lines through boxes.** Route connectors around boxes, not through them; plan the
  path with explicit h/v segments.
- **Labels on lines.** Offset labels from the line they describe; rotate a label to
  follow a diagonal.
- **Text width.** At `font-size="9"` with `letter-spacing="1"`, a monospace character is
  about 6.4px wide. Measure long labels against their box and the canvas edge.
- **Self-consistency.** Counters and steps must agree (`STEP 6 / 7` with seven steps
  drawn), and facts in images must match the repo and the case-file text.
- **Overlaps by design only.** Floating panels may overlap the window beneath; text
  and content blocks otherwise shouldn't collide.
- **Validity.** Escape `&` and `<` in text; `check_artwork.py` will catch malformed XML.
