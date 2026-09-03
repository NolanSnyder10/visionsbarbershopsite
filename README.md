# Visions Barbershop — website

Static site. No build step, no dependencies. Open `index.html` and it runs.

```
visions-barbershop/
├── index.html          The whole site — one page
├── privacy.html        Privacy Policy   (linked in the footer)
├── terms.html          Terms of Service (linked in the footer)
└── assets/
    ├── css/styles.css  All styling
    ├── js/config.js    ← EDIT THIS ONE (links, hours, phone)
    ├── js/main.js      Animations + open/closed logic
    └── img/            Photos go here — see img/README.txt
```

## Changing things

`assets/js/config.js` is the one file to edit. The Booksy link is already
in it, and the Book Online button reads from it. It also holds the phone number, address, Instagram link and the
opening hours. Change the hours there and the live **Open Now / Closed**
indicator and both hours tables follow automatically.

Photos live in `assets/img/` — `assets/img/README.txt` says which is which.

## Putting it on GitHub

There's no build step, so the repo is just these files.

```bash
git init
git add .
git commit -m "Visions Barbershop website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

### Turning on GitHub Pages

1. In the repo on github.com go to **Settings → Pages**.
2. Under *Build and deployment*, set **Source** to `Deploy from a branch`.
3. Pick branch **main** and folder **/ (root)**. Save.
4. Give it a minute; the site appears at
   `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

`index.html` is at the root, so Pages serves it as the homepage with no
extra configuration. The included `.nojekyll` file stops GitHub from
running the site through Jekyll, which it does by default.

### Pointing visionsbarbershop.online at it

1. Add a file named `CNAME` at the root containing one line:
   `visionsbarbershop.online`
2. At your domain registrar, point the domain at GitHub Pages
   (an `ALIAS`/`ANAME` record to `YOUR-USERNAME.github.io`, or four `A`
   records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`).
3. Back in **Settings → Pages**, enter the domain and tick
   **Enforce HTTPS** once the certificate is issued.

The site is already set up for `visionsbarbershop.online` — the
`canonical` link, `og:url`, `og:image` and the structured data all point
there. If you ever move to a different domain, search `index.html`,
`privacy.html` and `terms.html` for that string and swap it.

## Other hosts

It's plain HTML, so it also works as-is on Netlify Drop, Cloudflare Pages,
or any host's public folder. Nothing to compile.

---

## What's wired up

- **Hero load-in** — VISIONS reveals letter by letter, rule draws across,
  subtitle and CTAs fade up. Honours `prefers-reduced-motion`.
- **Booking** — lives on the same page, in the `#book` section at the
  bottom: book online, call, or walk in. Every Book button on the site
  (nav, hero, after the gallery, footer, and the sticky mobile bar) jumps
  there; only "Open Booking" leaves for Booksy.
- **Legal pages** — Privacy Policy and Terms of Service, linked bottom of
  every page. These are plain-English starting documents, NOT legal
  advice; have an Illinois attorney read them before you rely on them.
  Check the cancellation and lateness wording in Terms section 4 matches
  what you actually do.
- **Live hours** — reads the real time in `America/Chicago`, marks today's
  row and shows "Closes 7 PM" / "Opens 10 AM tomorrow". Refreshes each minute.
- **Interactive map** — Google Maps embed in full colour, with a Get
  Directions button.
- **Gallery lightbox** — click any shot to open it full-screen, Esc to close.
- **SEO** — `HairSalon` structured data with the real address, hours, phone
  and 4.9/58 rating, plus Open Graph tags for link previews.
- **Accessibility** — keyboard focus rings, ARIA on the menu and lightbox,
  semantic headings, reduced-motion support.

## Facts on the page, and where they came from

| Fact | Source |
|---|---|
| 4.9 stars, 58 reviews (57 five-star) | Google / BusinessRate report |
| #1 ranked barbershop in Romeoville | BusinessRate 2026 (246 vs 235 for #2) |
| Hours, address, walk-ins welcome | Google listing + Instagram bio |
| Review quotes | Real Google reviews, verbatim (light typo fixes only) |
| 9 barbers | Confirmed by the owner |

If anything has changed, it's all plain text in `index.html`.
