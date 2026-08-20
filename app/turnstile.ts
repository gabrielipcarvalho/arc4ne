// Turnstile is build-time public config. The official TEST site key renders a "for testing only"
// widget and isn't real bot protection — so treat it (and an unset key) as OFF: no widget, no
// token required (the route runs the same graceful mode; the per-IP limit carries the load).
// A REAL site key turns the full bot-gate on (client widget + server verify).
const TEST_SITE_KEY = "1x00000000000000000000AA";

// The production widget for arc4ne.io. Site keys are public by design (they ship in every
// page's HTML) — the secret key lives only in the cluster Secret the route verifies with.
const PROD_SITE_KEY = "0x4AAAAAAEXDdBhzG7iDPNyw";

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? PROD_SITE_KEY;

export const TURNSTILE_ON =
  TURNSTILE_SITE_KEY !== "" && TURNSTILE_SITE_KEY !== TEST_SITE_KEY;
