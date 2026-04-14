# Ode

Ode is a Next.js blog scaffold with a warm editorial theme inspired by `Xe/site`, prepared for deployment from a GitHub repository to Railway.

## Stack

- Next.js App Router
- TypeScript
- Railway via standard `npm run build` / `npm run start`
- `Iosevka Aile` for navigation
- `Schibsted Grotesk` for body copy and content blocks

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Railway deployment

1. Push this repository to GitHub.
2. In Railway, create a new project from the GitHub repo.
3. Railway will detect the Next.js app and build it with Nixpacks.
4. The included `railway.json` starts the production server with `npm run start`.

## Current scope

- Home page with hero and featured posts
- Blog archive page
- Dynamic post detail pages from local typed content
- Theme system matching the requested palette and typography direction

## Next steps

- Move posts from `src/lib/posts.ts` into MDX
- Add RSS, sitemap, and metadata polish
- Add archive grouping, tags, and richer article modules
