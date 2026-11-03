# Assense website

Static HTML and CSS with a small local script for the appearance preference. No cookies, analytics, remote fonts or remote assets.

## Structure

- `public/en/` and `public/de/`: localized home pages and legal pages.
- `public/index.html`: English fallback for static hosts without request-header routing.
- `public/assets/site.css`: website composition and explicit theme overrides.
- `public/assets/assense.css`: shared corporate design, adaptive color roles and local Inter fonts in `public/assets/fonts/` (license included).
- `public/assets/theme.js`: System / Light / Dark preference on every page.
- `public/images/`: selected photographs from the supplied image set. The hero uses `window_view.png`, Development uses `assembly.png`, and Operations uses `operations_1.jpeg`. The remaining source images stay in the repository's `images/` directory as alternatives.
- `public/assense_logo_dark.png` and `public/assense_logo_a_grau_eckig.png`: supplied logos.

The footer groups the explicit English/German links with the appearance selector. The selector uses the footer typography, a flat navy surface and yellow emphasis matching the active language; the group wraps on narrow screens. It retains a visible label, native keyboard controls and focus indication, and is hidden without JavaScript and in print. The `lang` and `hreflang` attributes identify the translations. There is no top navigation.

## Appearance

The default follows `prefers-color-scheme` and updates automatically when the system appearance changes, including with JavaScript disabled. A compact labelled native selector in the footer, directly beside EN / DE, offers System / Light / Dark (localized in German). Explicit choices override the system and are stored in `localStorage` under `assense-theme`; System removes the saved choice. Changes synchronize across tabs on the same origin. If storage is blocked, the current page can still change appearance. The script applies a saved preference before styles load to avoid a flash of the wrong theme; the selector stays hidden if JavaScript is unavailable.

Colors and local Inter files come from the [Assense corporate-design skill](https://github.com/Assense-Software-Solutions/corporate-design/tree/6d971bb453319cd8f5a32ed4ef80a06541ee0679/assense-design). The original logo sits within a continuous paper-colored masthead in both schemes, with a fixed muted masthead note, photographs stay grayscale, and the contact/footer bands retain their brand colors. Print always uses light roles and hides the selector.

## Hosting and language selection

Plain static files cannot read the browser's `Accept-Language` request header. A server rule is needed to choose a language for `/`. `deploy/Caddyfile.example` redirects to `/de/` when German is accepted with a nonzero quality value, and to `/en/` otherwise. Explicit language URLs never redirect and do not require a cookie. The root English file is a fallback on hosts without that rule; such a host does **not** meet the automatic language-selection requirement.

Serve the `public/` directory as the document root. Update the Caddy path and domain to match the deployment. The Caddy example has no access-log directive. Verify its configuration with the Caddy version used for deployment.

## Container image

`Dockerfile` packages the static files with the official Caddy image. The container listens on HTTP port 80 and is intended to run behind a TLS reverse proxy. Its configuration in `deploy/Caddyfile.container` performs the same language selection as the direct-host example.

GitHub Actions builds the image and runs HTTP smoke tests on pull requests and pushes to `main`. After the tests pass on `main`, it publishes `ghcr.io/assense-software-solutions/assense.com:latest` and a commit-specific `sha-<commit>` tag to GitHub Container Registry. The registry package's visibility follows the organization settings; publishing the image does not deploy the live domain.

To try it locally with Docker:

```sh
docker build -t assense-site:test .
docker run --rm -p 8080:80 assense-site:test
# Open http://localhost:8080/
```

## Before publication to prd

- Confirm the hosting provider, server-log behavior and retention, then replace the marked introductory notice and incomplete hosting description on both privacy pages.
- Verify the company details on both imprint pages, especially the managing director, register number and VAT ID. The details were adapted from the old site.
- Review the chosen crops on desktop and mobile after deployment. The source images are copied unchanged into `public/images/`.
- Test the deployed response for `Accept-Language: de-DE,de;q=0.9`, `en-US`, and `de;q=0`, and check direct `/en/` and `/de/` links.

The appearance preference is the only client-side storage used by this code; both privacy pages describe its purpose and removal. Review consent requirements when adding other storage, third-party services or analytics.
