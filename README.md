# Idea Prototypes

Two small clickable prototypes in one site, so the team can compare two project ideas by
clicking through their core screens. Frontend only, with mock data — no backend, no login.

Live site: https://takt-y.github.io/prototypes/

## The two ideas

- **Team Project Tracker** (`/team`) — organising team study-project work: a kanban board,
  a task view with time tracking, a dashboard with charts, and simulated GitHub/WakaTime
  integrations.
- **Job Tracker** (`/job`) — a personal job application tracker with minimal data entry,
  plus a shared layer for finding referrals at companies you've applied to (including a
  chat panel and a public, revocable summary link).

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. All data is mock data defined under `src/mocks/`; edits
made while clicking around live in React state and reset on reload.

## Building

```bash
npm run build
```

Type-checks with `tsc` and builds a production bundle into `dist/` with Vite.

## Deployment

Pushing to `main` triggers the `Deploy to GitHub Pages` GitHub Actions workflow, which
builds the site and publishes `dist/` via `actions/upload-pages-artifact` and
`actions/deploy-pages`. The repository's Pages source is set to "GitHub Actions".
