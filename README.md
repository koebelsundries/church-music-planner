# Church Music Planner

A progressive web app (PWA) for planning worship music at your church. Works offline, installs to your home screen, and runs entirely in the browser with no server required.

## Features

- **Three Hymnal Catalogs** — Switch between Sing! Hymnal, Baptist Hymnal (1991), and Baptist Hymnal (2008) with 600+ hymns each
- **Song Catalog** — Browse, search, and filter hymns by title, author, tune name, first line, or hymn number
- **Service Planning** — Build Sunday song lists by dragging hymns into a service order with customizable templates
- **Team Management** — Track team member assignments and availability for upcoming Sundays
- **Usage Tracking** — Log which songs are used each Sunday, see frequency and recency stats
- **Notes & Tags** — Add personal notes, tags, and categories to any hymn
- **PDF Export** — Generate printable Order of Worship PDFs with your church name and branding
- **Custom Songs** — Add songs not in the hymnal, import via CSV
- **Dark Mode** — Toggle between light (parchment) and dark themes
- **Offline-First** — All data stored locally in IndexedDB; works without internet
- **Backup/Restore** — Export and import all your data as JSON

## Deployment

This is a single-page static app. No build step required.

### GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch**, select `main` (or `master`), root `/`
4. Your app will be live at `https://yourusername.github.io/your-repo-name/`

### Any Static Host

Upload all files to any static hosting provider (Netlify, Vercel, Cloudflare Pages, etc.). No server-side code is needed.

## Files

| File | Description |
|------|-------------|
| `index.html` | The entire app — HTML, CSS, JS, and embedded hymnal data |
| `sw.js` | Service worker for offline caching |
| `manifest.json` | PWA manifest for installability |
| `icon-192.png` | App icon (192×192) |
| `icon-512.png` | App icon (512×512) |

## Tech Stack

- Vanilla HTML/CSS/JavaScript (no frameworks, no build tools)
- IndexedDB for persistent local storage
- Service Worker for offline support
- Web App Manifest for PWA installability

## License

For personal/church use.
