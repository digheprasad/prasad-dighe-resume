# Prasad Tanaji Dighe — Portfolio

A responsive React, Vite, and Tailwind portfolio prepared for Netlify. The supplied workspace did not contain existing resume, project, education, skills, certification, or social-link details; the site leaves those data collections empty rather than inventing credentials.

## Local development

1. Install Node.js 20.19+ or 22.12+.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and set any optional public site settings.
4. Run `npm run dev`.

The contact function needs Netlify's local development server: run `npx netlify dev` after installing the Netlify CLI. The regular Vite server does not emulate serverless functions.

## Complete your portfolio

Edit `src/data/portfolio.js` with verified education, skills, projects, certificates, achievements, and social links. Put certificate image files in `public/certificates/` and reference them from a certificate entry using a site-root path such as `/certificates/course-certificate.jpg`. Certificate entries can include `name`, `issuer`, `year`, `image`, and `credentialUrl`. Project links should be complete `https://` URLs. The resume preview and downloadable PDF use the same data. The download intentionally labels empty sections as not provided.

## Netlify deployment

Connect this project to Netlify; the build command, `dist` publish directory, serverless functions, SPA fallback, and generated `robots.txt` and `sitemap.xml` routes are set in `netlify.toml`. Set environment variables in **Site configuration → Environment variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | For contact email | Secret API key for the Resend account that sends contact form notifications. |
| `RESEND_FROM_EMAIL` | For contact email | Sender address on a domain verified with Resend. |
| `CONTACT_EMAIL` | No | Destination inbox; defaults to `digheprasad33@gmail.com`. |
| `VITE_GA_MEASUREMENT_ID` | No | GA4 web measurement ID (`G-...`), not a credential. Analytics loads only after visitor opt-in. |
| `VITE_SITE_URL` | No | Optional canonical-site override. Otherwise, metadata uses the deployed site's origin. |
| `VITE_GOOGLE_SITE_VERIFICATION` | No | Verification token from Search Console's HTML-tag method. |

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` must be server-side Netlify variables: do not prefix them with `VITE_`, commit them, or place them in client-side code. The function validates input, escapes HTML, accepts a honeypot field, limits field lengths, and returns explicit errors. Contact messages are sent only on form submission; visitor analytics never sends email.

Add your domain in Netlify's domain settings and configure its DNS there. Confirm the final canonical URL and sitemap at `https://your-domain.example/` and `https://your-domain.example/sitemap.xml`.

## Search Console & analytics

Create a Google Search Console property for the deployed domain, then either add the DNS TXT record (recommended) or set `VITE_GOOGLE_SITE_VERIFICATION` to the HTML-tag token and redeploy. Submit `https://your-domain.example/sitemap.xml` after deployment. Search indexing and ranking depend on external factors and are not guaranteed.

Create a GA4 web data stream and set `VITE_GA_MEASUREMENT_ID`. Visitors must opt in before the GA script loads. The site records page views and one `section_view` event for each section reached. GA4's aggregate reports provide active users, traffic sources, device categories, and country/city where its reporting thresholds and configuration permit. No individual visitor identity is collected. Provide an appropriate privacy notice for the jurisdictions in which the site operates.

## Contact email setup

Create and verify a sender domain in Resend, then set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in Netlify. The form endpoint is `/.netlify/functions/contact`; it does not send anything for page views. Its honeypot and validation are basic spam protections, not a substitute for provider-level abuse controls.
