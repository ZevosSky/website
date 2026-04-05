# Gary Yang Portfolio + Blog

Static Astro site for `garyyang.info`, with a portfolio-first homepage, a separate blog section, and file-based content editing.

## Content workflow

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

## Notes

The starter project content mirrors the shape of the current Wix site and gives you a clean place to continue migrating long-form project writeups and media.
