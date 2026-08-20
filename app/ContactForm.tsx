"use client";

import { useRef, useState } from "react";
import Turnstile from "./Turnstile";
import { TURNSTILE_ON } from "./turnstile";

/* open channel — the compose window. Terminal grammar throughout: labelled fields read like
   a tty session, the status line speaks in $/ok/! and lives in an aria-live region. Client caps
   mirror the route's (3 files · 8 MiB · no executables) for fast honest rejects; the server
   re-checks everything. */

const MSG_MAX = 5000;
const MAX_FILES = 3;
const MAX_TOTAL = 8 * 1024 * 1024;
const DENY_EXT = new Set([
  "exe", "bat", "cmd", "com", "scr", "pif", "msi",
  "sh", "js", "mjs", "vbs", "ps1", "jar",
]);

// the accept filter is a convenience, not the gate — the route's denylist is the gate
const ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.gif,.webp,.svg,.txt,.md,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.zip,.tar,.gz,.7z";

const fmtSize = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MiB` : `${(n / 1024).toFixed(0)} KiB`;

type Status =
  | { kind: "idle" }
  | { kind: "busy" }
  | { kind: "ok" }
  | { kind: "err"; msg: string };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [token, setToken] = useState("");
  const [tsError, setTsError] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const fileInput = useRef<HTMLInputElement>(null);
  const resetTurnstile = useRef<(() => void) | null>(null);

  const addFiles = (picked: FileList | null) => {
    if (!picked?.length) return;
    setStatus({ kind: "idle" });
    const next = [...files];
    for (const f of Array.from(picked)) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (DENY_EXT.has(ext)) {
        setStatus({ kind: "err", msg: `.${ext} files are not accepted` });
        continue;
      }
      if (next.length >= MAX_FILES) {
        setStatus({ kind: "err", msg: `at most ${MAX_FILES} files` });
        break;
      }
      if (next.reduce((n, x) => n + x.size, 0) + f.size > MAX_TOTAL) {
        setStatus({ kind: "err", msg: `attachments: ${MAX_TOTAL / 1024 / 1024} MiB total maximum` });
        break;
      }
      if (next.some((x) => x.name === f.name && x.size === f.size)) continue;
      next.push(f);
    }
    setFiles(next);
    if (fileInput.current) fileInput.current.value = ""; // allow re-adding a removed name
  };

  const removeFile = (i: number) => setFiles(files.filter((_, x) => x !== i));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status.kind === "busy") return;
    setStatus({ kind: "busy" });

    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("tel", tel);
    fd.set("message", message);
    fd.set("website", ""); // honeypot — humans never see this field
    files.forEach((f) => fd.append("files", f));
    if (TURNSTILE_ON) fd.set("cf-turnstile-token", token);

    try {
      const r = await fetch("/api/contact", { method: "POST", body: fd });
      const j = await r.json().catch(() => ({ error: "unparseable response" }));
      if (r.ok && j.ok) {
        setStatus({ kind: "ok" });
        setName(""); setEmail(""); setTel(""); setMessage(""); setFiles([]);
      } else {
        setStatus({ kind: "err", msg: j.error ?? "transmission failed" });
      }
    } catch {
      setStatus({ kind: "err", msg: "network unreachable — check your connection" });
    } finally {
      setToken("");
      resetTurnstile.current?.(); // tokens are single-use
    }
  }

  const total = files.reduce((n, f) => n + f.size, 0);

  return (
    <div className="term cform">
      <form onSubmit={submit}>
        <label className="cfield">
          <span className="clabel">name:</span>
          <input
            className="cinput"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </label>

        <label className="cfield">
          <span className="clabel">email:</span>
          <input
            className="cinput"
            type="email"
            required
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="cfield">
          <span className="clabel">
            tel: <span className="cl-opt">(optional)</span>
          </span>
          <input
            className="cinput"
            type="tel"
            maxLength={30}
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            autoComplete="tel"
            placeholder="+61 …"
          />
        </label>

        <div className="cfield cfield-msg">
          <label className="clabel" htmlFor="cf-message">message:</label>
          <textarea
            id="cf-message"
            className="cinput ctext"
            required
            maxLength={MSG_MAX}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            aria-describedby="cf-count"
          />
          <span id="cf-count" className="ccount" aria-live="off">
            {message.length}/{MSG_MAX}
          </span>
        </div>

        <div className="cfield">
          <span className="clabel">attach:</span>
          <div className="cattach">
            <button
              type="button"
              className="cfile"
              onClick={() => fileInput.current?.click()}
            >
              + add files
            </button>
            <span className="dim ccaps">
              ≤ {MAX_FILES} files · ≤ {MAX_TOTAL / 1024 / 1024} MiB total · docs / images / archives
            </span>
            <input
              ref={fileInput}
              type="file"
              multiple
              accept={ACCEPT}
              className="visually-hidden"
              onChange={(e) => addFiles(e.target.files)}
              tabIndex={-1}
            />
            {files.length > 0 && (
              <ul className="chips">
                {files.map((f, i) => (
                  <li key={`${f.name}:${f.size}`} className="chip">
                    <span className="chip-name">{f.name}</span>
                    <span className="chip-size">{fmtSize(f.size)}</span>
                    <button
                      type="button"
                      className="chip-x"
                      onClick={() => removeFile(i)}
                      aria-label={`remove ${f.name}`}
                    >
                      [x]
                    </button>
                  </li>
                ))}
                <li className="chip chip-total">{files.length} · {fmtSize(total)}</li>
              </ul>
            )}
          </div>
        </div>

        {/* honeypot — off-screen, unfocusable, unnamed to humans. Bots that fill it are
            silently dropped with a fake ok by the route. */}
        <label className="hp" aria-hidden="true">
          website
          <input tabIndex={-1} autoComplete="off" onChange={() => {}} />
        </label>

        {TURNSTILE_ON && (
          <Turnstile
            onToken={setToken}
            onError={() => setTsError(true)}
            resetRef={resetTurnstile}
          />
        )}

        <div className="cactions">
          <button className="xmit" type="submit" disabled={status.kind === "busy"}>
            ▮ transmit
          </button>
          {TURNSTILE_ON && tsError && token === "" && (
            <span className="dim cts-note">
              bot verification couldn&apos;t load — allow challenges.cloudflare.com and retry
            </span>
          )}
        </div>
      </form>

      <p className="cstat" aria-live="polite">
        {status.kind === "idle" && (
          <>
            <span className="prompt">$</span> <span className="dim">ready — compose and transmit</span>
          </>
        )}
        {status.kind === "busy" && (
          <>
            <span className="prompt">$</span> transmitting<span className="caret" aria-hidden="true">▌</span>
          </>
        )}
        {status.kind === "ok" && (
          <>
            <span className="prompt">$</span> <span className="ok">▮ ok — transmitted.</span>{" "}
            <span className="dim">we reply from gabriel@gipc.dev, usually within 2 business days.</span>
          </>
        )}
        {status.kind === "err" && (
          <>
            <span className="prompt">$</span> <span className="err">! {status.msg}</span>
          </>
        )}
      </p>
    </div>
  );
}
