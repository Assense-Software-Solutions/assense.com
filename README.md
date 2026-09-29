# Assense website

Static HTML and CSS, with no JavaScript, cookies, analytics, remote fonts or remote assets.

## Structure

- `public/en/` and `public/de/`: localized home pages and legal pages.
- `public/index.html`: English fallback for static hosts without request-header routing.
- `public/assets/site.css`: shared styles.
- `public/images/`: selected photographs from the supplied image set. The hero uses `window_view.png`, Development uses `assembly.png`, and Operations uses `operations_1.jpeg`. The remaining source images stay in the repository's `images/` directory as alternatives.
- `public/assense_logo_dark.png` and `public/assense_logo_a_grau_eckig.png`: supplied logos.

The footer offers explicit English/German links. The `lang` and `hreflang` attributes identify the translations. There is no top navigation.

## Hosting and language selection

Plain static files cannot read the browser's `Accept-Language` request header. A server rule is needed to choose a language for `/`. `deploy/Caddyfile.example` redirects to `/de/` when German is accepted with a nonzero quality value, and to `/en/` otherwise. Explicit language URLs never redirect and do not require a cookie. The root English file is a fallback on hosts without that rule; such a host does **not** meet the automatic language-selection requirement.

Serve the `public/` directory as the document root. Update the Caddy path and domain to match the deployment. The Caddy example has no access-log directive. Verify its configuration with the Caddy version used for deployment.

## Before publication

- Confirm the hosting provider, server-log behavior and retention, then replace the marked introductory notice and incomplete hosting description on both privacy pages.
- Verify the company details on both imprint pages, especially the managing director, register number and VAT ID. The details were adapted from the old site.
- Review the chosen crops on desktop and mobile after deployment. The source images are copied unchanged into `public/images/`.
- Test the deployed response for `Accept-Language: de-DE,de;q=0.9`, `en-US`, and `de;q=0`, and check direct `/en/` and `/de/` links.

No cookie banner is needed for the code in this repository. Review this assumption if third-party services, analytics or client-side storage are added later.
