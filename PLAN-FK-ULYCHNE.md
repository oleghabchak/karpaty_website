# Plan: Transform Boilerplate → ФК «Уличне» (FC Ulychne)

Rebrand the startup Next.js template into a Ukrainian football club website, using [FC Karpaty Lviv](https://fckarpaty.org.ua/) as the reference for structure, page names, and football assets.

---

## 1. App & brand rename

| Current | New |
|--------|-----|
| **package.json** `name` | `"startup-nextjs-template"` → `"fk-ulychne-website"` or `"fc-ulychne"` |
| **Site title / metadata** | "Free Next.js Template for Startup and SaaS" → **"ФК «Уличне»"** (or "ФК Уличне" + tagline) |
| **HTML lang** | `lang="en"` → `lang="uk"` (Ukrainian) |
| **Default font** | Consider adding Ukrainian-friendly font (e.g. keep Inter or use system fonts; Inter supports Cyrillic) |
| **Footer / copyright** | "Template by UIdeck…" → "© 2026 ФК «Уличне». Всі права захищено." (or your year/legal text) |

**Files to touch:**  
`package.json`, `src/app/layout.tsx` (title, lang), `src/app/page.tsx` (metadata), `README.md`, Footer component.

---

## 2. Route & page structure (aligned with fckarpaty.org.ua)

Map FC Karpaty’s main sections to routes and Ukrainian labels.

### 2.1 Main navigation (menu + routes)

| FC Karpaty section | Route (suggested) | Ukrainian label | Notes |
|--------------------|-------------------|-----------------|--------|
| **Головна** | `/` | Головна | Home (existing) |
| **Команда** | `/team` | Команда | First team roster (new or replace About) |
| **U-19 (youth)** | `/u19` or `/team/u19` | Уличне U-19 | Sub: Команда, Фото, Новини, Турнірна таблиця |
| **Академія** | `/academy` | Академія | Sub: Новини, Турнірні таблиці, Команди (U-17…U-14) |
| **Жіночий футбол** | `/women` | Жіночий футбол | Optional |
| **Новини** | `/news` | Новини | Reuse Blog → rename to News |
| **Клуб** | `/club` | Клуб | Sub: Менеджмент, Інфраструктура, Звітність, Медіацентр, Партнери |
| **Матчі** | `/matches` | Матчі | Match calendar & results |
| **Трибуна Героїв** | `/tribune` or `/heroes` | Трибуна Героїв | Fan / memorial section |
| **Фото** | `/photo` or `/gallery` | Фото | Photo gallery |
| **Відео** | `/video` | Відео | Video section (you have Video component) |
| **Фаншоп** | `/shop` or `/fanshop` | Фаншоп | Merch (link or page) |
| **Контакти** | `/contact` | Контакти | Keep Contact, rename Support → Контакти |

### 2.2 Route mapping from current boilerplate

| Current route | Action | New route / purpose |
|---------------|--------|----------------------|
| `/` | Keep, rebrand | Головна (home) |
| `/about` | Replace or redirect | `/club` (Клуб) or merge into Клуб |
| `/blog` | Rename conceptually | `/news` (Новини) — keep or add alias |
| `/blog-sidebar` | Optional keep | e.g. `/news/sidebar` or remove |
| `/blog-details` | Keep for article | `/news/[slug]` or `/news/details` |
| `/contact` | Keep | `/contact` (Контакти) |
| `/signin`, `/signup` | Keep or remove | Optional (e.g. for shop / members) |
| `/error` | Keep | Error page (no nav needed) |

**New routes to add (at least as placeholders):**  
`/team`, `/matches`, `/photo`, `/video`, `/club` (and sub-pages if needed), `/academy`, `/u19`, `/shop`, `/tribune`.

---

## 3. Football-specific assets

### 3.1 Naming and placement

- **Logo:**  
  - Add `public/images/logo/` with:  
    - `logo.svg` (e.g. light/primary)  
    - `logo-2.svg` or `logo-dark.svg` (dark mode)  
  - Alt text / site name: **ФК «Уличне»**.

- **Brand / partners:**  
  - Replace `public/images/brands/*` with partner logos or remove section until you have real partners.  
  - FC Karpaty has a “Партнери” block — same idea: `public/images/partners/` (optional).

- **Team / media:**  
  - `public/images/team/` — player photos, staff.  
  - `public/images/matches/` or `public/images/gallery/` — match photos, events.  
  - `public/images/stadium/` or `public/images/infrastructure/` — for Клуб / Інфраструктура.

- **UI / icons:**  
  - Favicon: replace default with club crest or “У” in `public/` (e.g. `favicon.ico`).  
  - Optional: football icon set or simple SVG icons for Матчі, Новини, Команда, etc.

### 3.2 Content placeholders

- **Команда:** List of players (photo, number, name, position) — can start with JSON/TS and static images.  
- **Матчі:** Next match block + calendar list (date, opponent, place, score).  
- **Турнірна таблиця:** Table component (position, team name, played, won, draw, lost, goals, points).  
- **Новини:** Reuse existing blog layout; rename to “Новини”, use Ukrainian titles/descriptions.  
- **Фото / Відео:** Reuse or adapt existing Video and any gallery; add “Фото” / “Відео” sections or pages.

---

## 4. Menu data and footer

### 4.1 Header menu (Ukrainian, FC Karpaty–style)

Replace `src/components/Header/menuData.tsx` with a structure like:

- **Головна** → `/`
- **Команда** → `/team`  
  - (optional sub: U-19 → `/team/u19`)
- **Уличне U-19** (or **Академія**) → `/u19` or `/academy` with submenu (Команда, Фото, Новини, Турнірна таблиця)
- **Новини** → `/news` (or `/blog` with label “Новини”)
- **Клуб** → `/club` with sub: Менеджмент, Інфраструктура, Звітність, Медіацентр, Партнери
- **Матчі** → `/matches`
- **Трибуна Героїв** → `/tribune`
- **Фото** → `/photo`
- **Відео** → `/video`
- **Фаншоп** → `/shop`
- **Контакти** → `/contact`

(Adjust submenus to match the routes you actually implement first.)

### 4.2 Footer

- Site name: **ФК «Уличне»**.
- Links: mirror main nav (Команда, Новини, Клуб, Матчі, Фото, Відео, Контакти).
- “Useful Links” → e.g. **Новини**, **Матчі**, **Клуб**.
- “Terms” → replace with **Правила**, **Політика конфіденційності** (and real URLs when you have them).
- “Support & Help” → **Контакти** or **Підтримка**.
- Copyright: **© 2026 ФК «Уличне». Всі права захищено.**
- Remove “Template by UIdeck / Next.js Templates” or replace with your dev/agency credit.

---

## 5. Home page sections (from FC Karpaty)

Order and purpose of blocks (adapt existing components where possible):

1. **Hero** — “ФК «Уличне»”, short tagline, CTA (e.g. “Матчі” / “Новини”).  
2. **Next match** — one highlighted match (date, opponent, venue, “Матч-центр” link).  
3. **Last result** — previous match (teams, score, “Відео” / “Матч-центр”).  
4. **Турнірна таблиця** — small table or “Переглянути усю таблицю” link.  
5. **Новини** — 3–4 latest news (reuse Blog block; label “Новини”).  
6. **Календар матчів** — next 3–5 matches (list or compact calendar).  
7. **Команда** — roster strip or “Команда” link.  
8. **Відео** — latest video(s) (existing Video component).  
9. **Фото** — latest photo gallery strip.  
10. **Фаншоп** — strip with 2–4 products + “Перейти до магазину”.  
11. **Партнери** — logo strip (replace Brands).  
12. **Контакт** — contact block (existing Contact / newsletter).

Rename components in code where it helps (e.g. Blog → News, Brands → Partners).

---

## 6. Implementation order (suggested)

1. **Rename app & set Ukrainian**  
   - `package.json` name, `layout.tsx` (title, `lang="uk"`), default metadata.

2. **Menu + footer**  
   - New `menuData.tsx` (Ukrainian labels, new routes).  
   - Footer: ФК «Уличне», Ukrainian links, copyright.

3. **Logo & favicon**  
   - Add `public/images/logo/` (logo.svg, logo-2.svg), update Header/Footer.  
   - Favicon.

4. **Home page**  
   - Hero text → ФК «Уличне».  
   - Replace or reorder sections: next match, last result, table teaser, Новини, calendar, team teaser, video, photo, shop, partners, contact.

5. **Routes & pages**  
   - Add placeholder pages: `/team`, `/matches`, `/club`, `/news` (or alias `/blog`), `/photo`, `/video`, `/shop`, `/tribune`, `/academy`, `/u19`.  
   - Optionally rename `/blog` → `/news` (redirect or move files).

6. **Content & assets**  
   - Team data (JSON/TS), match data, table data.  
   - Placeholder images in `team/`, `matches/`, `partners/`.  
   - Replace brand SVGs with partners or remove.

7. **Copy & content**  
   - All visible UI strings to Ukrainian (buttons, headings, form labels, error page).  
   - Sample news in Ukrainian.

8. **Optional**  
   - Трибуна Героїв content, Жіночий футбол, signin/signup for shop or members.

---

## 7. File checklist (summary)

| Area | Files to create or edit |
|------|-------------------------|
| App name & locale | `package.json`, `src/app/layout.tsx`, `src/app/page.tsx` |
| Menu | `src/components/Header/menuData.tsx` |
| Footer | `src/components/Footer/index.tsx` |
| Logo / assets | `public/images/logo/*`, `public/favicon.ico`, `public/images/partners/` or `brands/` |
| Home sections | `src/app/page.tsx`, Hero, replace Features/Blog/Brands/Pricing with match, table, news, calendar, team, video, photo, shop, partners |
| New pages | `src/app/team/page.tsx`, `src/app/matches/page.tsx`, `src/app/club/page.tsx`, `src/app/news/` (or blog rename), `src/app/photo/page.tsx`, `src/app/video/page.tsx`, `src/app/shop/page.tsx`, `src/app/tribune/page.tsx`, `src/app/academy/page.tsx`, `src/app/u19/page.tsx` |
| Types / data | `src/types/` (player, match, table row, partner), data files for team, matches, table |
| Copy | All components that show “Home”, “About”, “Blog”, “Support”, “Get Pro”, etc. → Ukrainian |

---

## 8. Reference

- **FC Karpaty Lviv:** https://fckarpaty.org.ua/  
- Use this plan as the single source of truth for renaming the app to **ФК «Уличне»** and for football-related assets and page names aligned with that reference.
