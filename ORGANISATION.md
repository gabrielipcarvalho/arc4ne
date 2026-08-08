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
4. **Email**: hold. Migadu Micro has NO API (panel-only) → Gabriel adds the domain + mailboxes in
   the panel (~5 min, tomorrow); DNS records get staged the moment the verify-TXT exists.
5. **Access hygiene**: deferred until it's a real business.
6. **Copy sign-off**: Oliver reviews the live alpha before his LinkedIn post.

## Build checklist (Claude executes, in order, once unblocked)
- [x] **CF API access from garuda** — `cloudflare.env` fetched (2026-08-08); token verified
      `active` and sees both zones (arc4ne.io + gipc.dev) — DNS + tunnel automation ready.
- [ ] **DNS (Terraform)**: `arc4ne.io` + `www` proxied CNAME → the existing tunnel
      (`…cfargotunnel.com`); later Migadu MX/SPF/DKIM if decision #4 = yes. New TF module, state
      alongside the existing R2 remote state.
- [ ] **Tunnel ingress**: add both hostnames → `localhost:30082` on the oracle node (+ repo mirror
      + garuda's rollback copy stays in sync).
- [ ] **Caddy host-split**: `gipc.dev` block vs `arc4ne.io` block — per-site routing, CSP, headers.
- [ ] **App scaffold**: Next.js 15, tokens-only styling, matrix aesthetic, in THIS repo; CI →
      multi-arch image → GHCR; k8s manifests + a second ArgoCD Application on the same cluster.
- [ ] **LP v1**: hero · what-we-do · founders (links out) · contact. SEO/OG/favicon/sitemap.
- [ ] Optional: `arc4ne.dev` at $1 first year (the Workers-plan perk) as a redirect.

## Architecture (agreed shape)
Same Oracle box, same tunnel, same Caddy — host-routed. **Separate repo, separate image, separate
ArgoCD app** — the company site is a tenant of the platform, not a feature of gipc.dev. Platform
manifests (cluster, tunnel, Caddy) stay in the gipc repo for now; revisit when arc4ne grows real
workloads.

## Explicitly not now
`.com.au` (waits for the ABN) · separate Cloudflare account migration · any product/SaaS build ·
touching gipc.dev (it stays Gabriel's personal portfolio at the apex, untouched).
