locals {
  zone_id   = "15e2284a291aa8ad600c310b6f7255b7" # arc4ne.io (public knowledge; not a secret)
  tunnel_id = "a7fe831c-d2b3-4d6f-b607-10e2b58ce934" # the shared gipc tunnel — its CNAME target is public DNS anyway
}

# Apex + www ride the existing Cloudflare Tunnel — same origin, host-routed by Caddy.
resource "cloudflare_record" "apex" {
  zone_id = local.zone_id
  name    = "arc4ne.io"
  type    = "CNAME"
  content = "${local.tunnel_id}.cfargotunnel.com"
  proxied = true
  ttl     = 1
}

resource "cloudflare_record" "www" {
  zone_id = local.zone_id
  name    = "www"
  type    = "CNAME"
  content = "${local.tunnel_id}.cfargotunnel.com"
  proxied = true
  ttl     = 1
}

# Migadu mail records land here after the panel add-domain step generates the verify token.
