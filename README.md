# Gary Yang Portfolio + Blog Reminders

Static Astro site 

## Content workflow reminders

- Add or edit portfolio entries in `src/content/projects/`
- Add or edit blog posts in `src/content/blog/`
- Put self-hosted images in `public/images/projects/`, `public/images/blog/`, or `public/images/site/`
- Adjust homepage copy, featured project order, and current focus in `src/config/site.ts`
- Adjust shared responsive presets in `src/config/appearance.ts`

## Routes

- `/` homepage
- `/projects` projects index
- `/projects/[slug]` project pages
- `/blog` blog index
- `/blog/[slug]` blog posts

## Local development

```bash
npm install
npm run dev
```

## Deployment

This repo is configured to deploy to GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

- Production domain: `garyyang.info`
- The custom domain is declared in `public/CNAME`
- Pushes to `main` trigger a new GitHub Pages deployment




