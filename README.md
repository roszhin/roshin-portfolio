# Roshin R S — Developer Portfolio

An editorial, scroll-led portfolio built with React, TypeScript, Vite, Tailwind CSS v4, GSAP ScrollTrigger, and Motion for React.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

## Update content

- Project content lives in `src/data/projects.ts` and should be added only after reviewing the corresponding source archive and README.
- The gallery currently shows twelve selected project entries from the supplied archives. No verified demo links were found in the reviewed sources.
- Project screenshots live in `public/images/projects/`; entries in `src/data/projects.ts` point to their respective images. The gallery includes screenshots captured from locally running archives and screenshots supplied by the site owner.
- Education, email, GitHub, and LinkedIn configuration lives in `src/data/site.ts`. Empty link fields stay hidden in the UI.
- Replace `public/images/profile-professional.png` to update the profile portrait.

## Publish the portfolio

This is a static Vite site. It does not need an always-running computer, a PHP server, or a database once it is deployed.

To keep it available online, push the project to a GitHub repository and connect that repository to Cloudflare Pages:

1. In Cloudflare, create a Pages project and connect the GitHub repository.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Deploy. Cloudflare Pages provides a public `pages.dev` address and rebuilds the site when changes are pushed.
4. Optionally add a custom domain in the Pages project settings.

The local `npm run dev` command only serves a preview on this computer; it is not the 24/7 public host. Publishing still requires a GitHub repository and authorization to a hosting account. See the [Vite static deployment guide](https://vite.dev/guide/static-deploy.html) and [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/).

## Motion

GSAP owns the hero entrance and scroll reveals. Motion for React owns the mobile menu and project detail panel. Project cards open a detail view with screenshots, implementation notes, and previous/next project navigation. Both animation systems respect reduced-motion preferences and clean up with component lifecycle.
