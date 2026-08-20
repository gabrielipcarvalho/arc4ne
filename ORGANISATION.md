# arc4ne — founding organisation plan (2026-08-08)

> The pre-build checklist. Edit freely — this is the shared source of truth for Gabriel × Oliver
> until real project tooling exists.

## Already done
- **arc4ne.io bought** — Cloudflare Registrar, Gabriel's CF account, zone `15e2284a…`, expires
  2027-08-08, DNS Full, Universal SSL auto-issuing. (arcane.io itself is broker-parked at 4–5
  figures — ignored.)
- **Infrastructure exists and is free**: single-node k3s on Oracle A1 Sydney (2 OCPU/12GB, ~20%
  used), Cloudflare Tunnel origin, ArgoCD GitOps, multi-arch CI, nightly off-site backups. The LP
  adds ~50–100 MiB — rounding error.
- This repo (`~/Projects/arc4ne`).

## Positioning (Oliver's brief, 2026-08-08)
Company-first landing page: **software services, SaaS, AI technology, consulting** — a systems
architecture / software engineering organisation. Matrix/terminal aesthetic, based on gipc.dev's
design language. Founder section links out (Gabriel → gipc.dev, Oliver → his profile) — the same
pattern Oliver uses. Goal: a page Oliver can post on LinkedIn.

## Decisions (resolved 2026-08-08 — "two buddies building an alpha", nothing strict yet)
1. **Legal**: deferred. Tech front first.
2. **GitHub home**: repo under `gabrielipcarvalho/arc4ne` for the alpha (org creation is web-UI-only
   — no API exists; transfer to an `arc4ne` org later, GitHub leaves redirects).
3. **Brand delta**: Claude's creative call — super techy, matrix-derived, alpha-honest. Phosphor
   green + amber on near-black (vs gipc's violet/cyan), IBM-Plex-Mono DNA retained.
   **Brand decode (locked 2026-08-08): _an arc for Ne_** — the 4 reads "for"; neon is inert until
   an arc strikes through it; "arcane" = hidden knowledge, neon = visible light → *making the
   arcane glow*. Tagline: **"You bring the neon. We bring the arc."** The amber 4 in the wordmark
   is the spark; footer easter egg Ar·C·Ne (argon·carbon·neon). Honesty footnote for physicist
   parties: neon signs are technically glow discharge; arc is the high-current cousin — same
   family, cooler word. No acronym; backronyms (Agent Runtime Context…) can be layered later
   without conflict.
4. **Email**: hold. Migadu Micro has NO API (panel-only) → Gabriel adds the domain + mailboxes in
   the panel (~5 min, tomorrow); DNS records get staged the moment the verify-TXT exists.
5. **Access hygiene**: deferred until it's a real business.
6. **Copy sign-off**: Oliver reviews the live alpha before his LinkedIn post.

## Build checklist — EXECUTED 2026-08-08, arc4ne.io LIVE (TLS CN=arc4ne.io, TTFB ~80ms)
Remaining: Oliver's profile link + copy sign-off; OG image; optional $1 arc4ne.dev;
Migadu panel add-domain (optional now — see the channel note below).
- [x] **CF API access from garuda** — `cloudflare.env` fetched (2026-08-08); token verified
      `active` and sees both zones (arc4ne.io + gipc.dev) — DNS + tunnel automation ready.
- [x] **DNS (Terraform)**: `arc4ne.io` + `www` proxied CNAME → the existing tunnel
      (`…cfargotunnel.com`); later Migadu MX/SPF/DKIM if decision #4 = yes. New TF module, state
      alongside the existing R2 remote state.
- [x] **Tunnel ingress**: add both hostnames → `localhost:30082` on the oracle node (+ repo mirror
      + garuda's rollback copy stays in sync).
- [x] **Caddy host-split**: `gipc.dev` block vs `arc4ne.io` block — per-site routing, CSP, headers.
- [x] **App scaffold**: Next.js 15, tokens-only styling, matrix aesthetic, in THIS repo; CI →
      multi-arch image → GHCR; k8s manifests + a second ArgoCD Application on the same cluster.
- [x] **LP v1**: hero · what-we-do · founders (links out) · contact. SEO/OG/favicon/sitemap.
- [x] **Open channel — contact form** (2026-08-21): `#channel` is now a server-backed form
      (name · email · tel? · message · attachments) → SMTP-relayed to gabriel@gipc.dev.
      Turnstile-gated (dedicated arc4ne.io widget, fail-closed verify — the gipc ai-service
      rule), honeypot + 5/hr per-IP limit, caps **3 files · 8 MiB total · no executables**
      (Migadu publishes no per-message cap; the pod's memory + base64 overhead are the real
      ceilings → limit raised to 256 Mi). **Ops note**: the relay sends through the existing
      gipc.dev Migadu mailbox; when real arc4ne.io mail exists, swap `SMTP_USER`/`SMTP_PASS`
      in the cluster Secret — zero code change. Migadu Micro's 20 **outgoing**/day is the hard
      ceiling (Turnstile + rate limit keep us far below). Secrets live in the hand-applied
      `contact-secrets` Secret (namespace `arcane`) — this repo is public, so the Secret is
      never committed; ArgoCD doesn't manage it, so prune/self-heal can't remove it.
- [ ] Optional: `arc4ne.dev` at $1 first year (the Workers-plan perk) as a redirect.

## Architecture (agreed shape)
Same Oracle box, same tunnel, same Caddy — host-routed. **Separate repo, separate image, separate
ArgoCD app** — the company site is a tenant of the platform, not a feature of gipc.dev. Platform
manifests (cluster, tunnel, Caddy) stay in the gipc repo for now; revisit when arc4ne grows real
workloads.

## Explicitly not now
`.com.au` (waits for the ABN) · separate Cloudflare account migration · any product/SaaS build ·
touching gipc.dev (it stays Gabriel's personal portfolio at the apex, untouched).
