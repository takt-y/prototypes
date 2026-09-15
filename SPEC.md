# Idea Prototypes — Spec

## Goal

Two small clickable prototypes in one site, so the team can compare two project ideas by clicking through their core screens. Frontend only, mock data, no backend, no login.

## Constraints

- Vite + React + TypeScript, Tailwind CSS, React Router with `HashRouter`.
- Mock data in typed files under `src/mocks/team/` and `src/mocks/job/`. Changes live in React state and reset on reload.
- External services (GitHub, WakaTime, chat partners) are simulated.
- UI text in English with EU spelling. Responsive. No console errors.
- Keep it small: only the screens listed below.

## Start page `/`

Two cards: "Team Project Tracker" and "Job Tracker", each with a one-sentence description and an "Open" button. Each prototype has a top bar with its name and a "Back to ideas" link.

## Idea 1 — Team Project Tracker `/team`

A tool for organising team work on study projects: tasks, estimated vs actual hours, GitHub activity.

Mock data: one team of 5, one project based on a template with estimated hours, ~20 tasks, ~40 time entries (manual / WakaTime), ~8 pull requests.

1. **Board** `/team/board` — kanban (todo / in progress / review / done), drag and drop, filter by assignee. Card: title, assignee, estimate vs logged hours, PR badge.
2. **Task** `/team/tasks/:id` — description, status, assignee, time entries with source icons, "Log time" form, linked PR with state.
3. **Dashboard** `/team/dashboard` — estimate vs actual per task and per member (bar charts), hours over time (line chart). Use Recharts.
4. **Integrations** `/team/integrations` — GitHub card (connect → pick repo → imported PRs) and WakaTime card (connect → map project). Simulated.

## Idea 2 — Job Tracker `/job`

A personal job application tracker with minimal data entry (three states plus notes) and a shared layer for finding referrals.

Mock data: ~15 applications across states and ~8 companies (some with several applications and name variants), events per application, 10 other users (some at companies applied to), 2 conversations, 1 published summary.

1. **Applications** `/job/applications` — list with state chips, search across company, role and notes, filter by state, "Add application" dialog with link, company, role, notes only. Company names link to the company page; rows show "People you know here" when relevant.
2. **Application** `/job/applications/:id` — state switcher, notes, event timeline (manual / email / extension sources), attached CV version, "Find a referral" button that opens the company page.
3. **Company** `/job/companies/:id` — company name and number of the user's applications there; the user's applications to this company with states; people who work there with an "open to referrals" tag, "Add friend" and "Message" buttons; clicking "Message" opens a chat side panel where a mock reply arrives after a few seconds. Companies are not entered separately: the page is built from the company names in applications. Mock data includes name variants (e.g. "Booking", "booking.com") that are grouped into one company, with a small "also known as" line showing the variants.
4. **Published summary** `/job/summary` — choose what to include, set expiry, copy link, revoke; preview of the read-only public page.

## Deployment

- Repository `takt-y/prototypes`, Vite `base: '/prototypes/'`.
- GitHub Actions on push to `main`: install, build, deploy with `actions/upload-pages-artifact` and `actions/deploy-pages`. Pages source is already set to GitHub Actions.
- `.gitignore` covers `node_modules/`, `dist/`, `.env*`, logs, OS and editor files.

## Done when

- `npm run build` passes with no type errors.
- All 8 screens are reachable by clicking from the start page.
- The site works at `https://takt-y.github.io/prototypes/`.
- README says what this is, how to run it locally, and links to the live site.