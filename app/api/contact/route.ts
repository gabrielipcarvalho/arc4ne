import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* open channel — the contact endpoint. Turnstile-gated, rate-limited, capped, then relayed
   over SMTP to gabriel@gipc.dev. Ports the gipc ai-service posture: fail-closed verification,
   graceful-off when unconfigured (dev), one audit line per attempt — never the contents. */

export const runtime = "nodejs";

const TO = process.env.CONTACT_TO ?? "gabriel@gipc.dev";
const FROM_NAME = "arc4ne.io contact";

// Caps: 3 files, 8 MiB total (Migadu publishes no per-message cap; the real ceilings are this
// pod's memory and base64 (+33%) MIME overhead — hence also the 256 Mi limit in the manifest).
// The 12 MiB body guard sits above the 8 MiB payload to leave room for part boundaries/text.
const MAX_FILES = 3;
const MAX_TOTAL = 8 * 1024 * 1024;
const MAX_BODY = 12 * 1024 * 1024;
const MSG_MAX = 5000;

const DENY_EXT = new Set([
  "exe", "bat", "cmd", "com", "scr", "pif", "msi",
  "sh", "js", "mjs", "vbs", "ps1", "jar",
]);

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/* ── per-IP rate limit — 5/hour, module scope (single replica; resets on restart, fine here) ── */
const WINDOW_MS = 3600_000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // crude prune so a bot flood of spoofed ips can't grow the map unbounded
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/* ── body guard — read the raw stream with a hard cap BEFORE any multipart parsing,
       so an oversized chunked upload can't buffer its way to an OOMKill ── */
class TooLarge extends Error {}

async function readCapped(
  body: ReadableStream<Uint8Array> | null,
  cap: number,
): Promise<ArrayBuffer> {
  if (!body) return new ArrayBuffer(0);
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > cap) throw new TooLarge();
    chunks.push(value);
  }
  const buf = Buffer.concat(chunks);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

/* ── validation helpers ── */

// header-bound fields never carry CR/LF — strip before they can become injection vectors
const clean = (s: unknown) =>
  String(s ?? "").replace(/[\r\n]+/g, " ").trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TEL_RE = /^[+()\-.\d\s]{1,30}$/;

function json(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status });
}

/* ── turnstile — fail-closed (the gipc ai-service rule: any error/timeout/empty token → false) ── */
async function turnstileOk(
  token: string,
  ip: string,
  secret: string,
): Promise<boolean> {
  if (!token) return false;
  try {
    const r = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    return Boolean((await r.json())?.success);
  } catch {
    return false; // CF outage / timeout / bad JSON → fail closed
  }
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);

  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY) return json("payload too large", 413);

  let form: FormData;
  try {
    const raw = await readCapped(req.body, MAX_BODY);
    form = await new Request("http://local/api/contact", {
      method: "POST",
      headers: req.headers,
      body: raw,
    }).formData();
  } catch (e) {
    if (e instanceof TooLarge) return json("payload too large", 413);
    return json("unreadable payload", 400);
  }

  // honeypot — bots that fill the invisible `website` field get a fake ok and silence
  if (clean(form.get("website"))) {
    console.log(`[contact] honeypot trip ip=${ip}`);
    return NextResponse.json({ ok: true });
  }

  if (rateLimited(ip)) return json("too many transmissions — try again later", 429);

  const secret = process.env.TURNSTILE_SECRET;
  if (secret) {
    // graceful-off only when the secret is unset (local dev); configured ⇒ the gate is real
    if (!(await turnstileOk(clean(form.get("cf-turnstile-token")), ip, secret)))
      return json("bot verification failed — reload and try once more", 403);
  }

  const name = clean(form.get("name"));
  const email = clean(form.get("email"));
  const tel = clean(form.get("tel"));
  const message = String(form.get("message") ?? "").trim();

  if (name.length < 1 || name.length > 100) return json("name: 1–100 characters", 400);
  if (!EMAIL_RE.test(email) || email.length > 254) return json("email: a valid address is required", 400);
  if (tel && !TEL_RE.test(tel)) return json("tel: digits and + - ( ) . only", 400);
  if (message.length < 1 || message.length > MSG_MAX)
    return json(`message: 1–${MSG_MAX} characters`, 400);

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES)
    return json(`attachments: at most ${MAX_FILES} files`, 400);
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL)
    return json(`attachments: ${MAX_TOTAL / 1024 / 1024} MiB total maximum`, 413);

  const safeName = (f: File) =>
    (f.name.split(/[\\/]/).pop() ?? "file").replace(/[\x00-\x1f]/g, "").slice(0, 120) || "file";

  for (const f of files) {
    const ext = safeName(f).split(".").pop()?.toLowerCase() ?? "";
    if (DENY_EXT.has(ext))
      return json(`attachments: .${ext} files are not accepted`, 400);
  }

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass)
    return json("channel not provisioned — email us directly", 502);

  const attachMeta = files.map((f) => ` - ${safeName(f)} (${f.type || "unknown"}, ${(f.size / 1024).toFixed(1)} KiB)`);

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: 465,
      secure: true,
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"${FROM_NAME}" <${user}>`,
      to: TO,
      replyTo: email,
      subject: `[arc4ne.io] message from ${name}`,
      text: [
        `name:    ${name}`,
        `email:   ${email}`,
        `tel:     ${tel || "—"}`,
        ``,
        message,
        ``,
        files.length
          ? `attachments: ${files.length} · ${(total / 1024 / 1024).toFixed(2)} MiB total\n${attachMeta.join("\n")}`
          : "attachments: none",
        ``,
        `meta: ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Sydney" })} AEST · ip ${ip}`,
        `— arc4ne.io open channel`,
      ].join("\n"),
      attachments: await Promise.all(
        files.map(async (f) => ({
          filename: safeName(f),
          content: Buffer.from(await f.arrayBuffer()),
          contentType: f.type || "application/octet-stream",
        })),
      ),
    });
    transporter.close();
  } catch (e) {
    console.log(`[contact] smtp fail ip=${ip} files=${files.length} bytes=${total} err=${(e as Error).message.slice(0, 80)}`);
    return json("transmission failed — retry shortly, or email us directly", 502);
  }

  console.log(`[contact] sent ip=${ip} files=${files.length} bytes=${total}`);
  return NextResponse.json({ ok: true });
}
