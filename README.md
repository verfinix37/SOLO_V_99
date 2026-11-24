# SOLO — RRB Station Master Command Centre

A futuristic, responsive study-progress dashboard for the RRB Station Master syllabus.

## Features

- Dashboard with overall syllabus progress and subject-wise progress.
- 81 chapters across Mathematics (25), Basic Science (9), Reasoning (35), and Data Analysis (12).
- Level progression from 0 to 100. Each completed chapter contributes equally to the 81-chapter total.
- XP display, milestone markers, and level-up celebration.
- Mark a chapter complete or undo it at any time.
- Reset all chapter progress while keeping profile details.
- Separate profile page for name and age.
- Local-first storage using browser `localStorage`; no account or backend required.
- Responsive layout for desktop and mobile.
- Custom power-button app icon.

## Level and XP calculation

`level = floor(completedChapters × 100 / 81)`, capped at 100.

`XP = round(completedChapters × 10,000 / 81)`.

This gives Level 0 at 0 chapters and exactly Level 100 at 81 chapters. Since 100 levels are distributed over 81 chapter completions, some completions advance two levels. Progress is recalculated from the checked chapters, so undoing a chapter also correctly reduces the level and XP.

The chapter labels are placeholders (Chapter 01, Chapter 02, etc.) because a chapter-title list was not provided. The chapter counts are configured to the requested syllabus totals.

## Run locally

Install Node.js (LTS), then from this project folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Create a production build:

```bash
npm run build
npm run preview
```

## Publish with GitHub Pages

1. Create a new GitHub repository named `SOLO`.
2. Upload the contents of this project folder to the repository root.
3. Keep the repository name `SOLO` for the included deployment configuration. The workflow automatically builds with the `/SOLO/` base path; local development continues to use `/`. If you choose a different repository name, update the base path in `vite.config.js` and the workflow build command.
4. In the repository, open **Settings → Pages** and choose **GitHub Actions** as the source.
5. The deployment workflow is already included at `.github/workflows/deploy.yml`. Commit and push to `main`; GitHub Actions will build and publish the app.

## Data and privacy

Profile and chapter progress are stored in the browser on the current device. The app does not include a server or cloud sync. Browser data clearing can remove SOLO's saved progress. Keep a separate record if the progress is important.

## Customization

- Chapter counts and subject names are in `src/main.jsx` in the `SUBJECTS` array.
- Visual theme and responsive breakpoints are in `src/styles.css`.
- App icon is `public/solo-icon.svg`.
