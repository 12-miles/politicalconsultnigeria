# Political Consult Nigeria

Marketing site for Political Consult Nigeria (a practice of Status Solutions & Media Consult).
Static HTML, CSS and vanilla JavaScript — no build step, no dependencies.

## Structure

```
.
├── index.html              # the whole site (single page)
├── 404.html                # not-found page
├── favicon.svg
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── vercel.json             # caching + security headers
└── assets/
    ├── css/styles.css      # all styling, design tokens at the top under :root
    ├── js/main.js          # nav, hero diagram, scroll reveals, form validation
    └── img/                # photography, OG cover, touch icon
```

## Run locally

Any static server works. With Node installed:

```bash
npx serve .
```

Or with Python:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploy to Vercel

```bash
npx vercel          # preview deployment
npx vercel --prod   # production
```

Or import the repository at vercel.com/new — every push to `main` then deploys automatically.

After the first production deploy, add the domain under **Project → Settings → Domains**:
`politicalconsultnigeria.com` and `www.politicalconsultnigeria.com`. Vercel prints the DNS
records to enter at your registrar and issues SSL automatically.

## Before going live — edit these

| What | Where |
| --- | --- |
| Phone number (`+234 XXX XXX XXXX`) | `index.html`, contact block and JSON-LD |
| Email address | `index.html` (contact block, JSON-LD, form handler in `assets/js/main.js`) |
| Team names and roles (`[Founder & Lead Consultant]`, `[Name, Role]`) | `index.html`, `#firm` section |
| Domain in canonical / OG tags / sitemap | `index.html`, `sitemap.xml`, `robots.txt` |

## Consultation form

The form validates in the browser, then opens the visitor's email client with a
pre-filled message (`mailto:`). Nothing is stored server-side.

To collect submissions in an inbox or spreadsheet instead, point the form at a
service such as Formspree: give the fields `name` attributes, wrap them in a
`<form action="https://formspree.io/f/XXXX" method="POST">`, and drop the
`mailto:` branch at the end of `assets/js/main.js`.

## Design tokens

All colours, fonts and spacing live in `:root` at the top of `assets/css/styles.css`.
Change them there and the whole site follows.

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#0C1512` | page background |
| `--chalk` | `#EFEEE7` | body text, light sections |
| `--saffron` | `#E9B23C` | primary accent, buttons |
| `--kola` | `#C0392E` | myth strike-through, errors |
| `--sage` | `#7E9483` | secondary text, diagram nodes |

## Accessibility

Keyboard focus is visible throughout, there is a skip link, images carry alt text,
and `prefers-reduced-motion` disables every animation.
