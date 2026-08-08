import Decode from "./Decode";

const MARK = "ARC4NE";

const SERVICES = [
  {
    n: "01 - 001",
    name: "systems architecture",
    desc: "Boundaries, data flows, failure modes — decided before the first commit. We draw the system, then we defend the drawing.",
  },
  {
    n: "02 - 010",
    name: "software engineering",
    desc: "Typed, tested, shipped. Boring pipelines, exciting products. Code that the next engineer thanks you for.",
  },
  {
    n: "03 - 011",
    name: "saas platforms",
    desc: "Multi-tenant products from zero to production — auth, billing, observability, the unglamorous 80% done right.",
  },
  {
    n: "04 - 100",
    name: "applied ai",
    desc: "RAG, agents, evals. Grounded in your data, measured against reality, zero fabrication tolerated — in the model or the pitch.",
  },
];

const STACK = [
  {
    k: "interfaces",
    v: "The latest generation of web stacks for design and front-end — fast, accessible interfaces that respect your device, your bandwidth, and your motion settings. Chosen per project, never by fashion.",
  },
  {
    k: "services",
    v: "Node · Go · Python (FastAPI) · REST & server-sent streams · typed contracts end to end",
  },
  {
    k: "data",
    v: "PostgreSQL · pgvector for retrieval · object storage (R2/S3) · caches only when they're earned",
  },
  {
    k: "platform",
    v: "Kubernetes · GitOps (ArgoCD) · Terraform · multi-arch containers (amd64+arm64) · Cloudflare edge, tunnels & WAF",
  },
  {
    k: "observability",
    v: "Prometheus · Grafana · Loki · real SLOs, real dashboards — the same ones we watch ourselves",
  },
  {
    k: "applied ai",
    v: "Claude & the modern LLM stack · RAG over your data · agent tool-loops · eval harnesses with published scores",
  },
];

const METHOD = [
  {
    n: "01 - 001",
    name: "listen & map",
    desc: "The domain, the constraints, the actual problem — before any technology gets named.",
  },
  {
    n: "02 - 010",
    name: "architect",
    desc: "Boundaries, data flows, tenancy, failure modes — on paper, argued about, then committed to.",
  },
  {
    n: "03 - 011",
    name: "build",
    desc: "Typed, tested, reviewed. CI from day one. Every image built for two architectures.",
  },
  {
    n: "04 - 100",
    name: "ship",
    desc: "GitOps: a push to main is the deploy, a revert is the rollback. No snowflake servers, no heroics.",
  },
  {
    n: "05 - 101",
    name: "run",
    desc: "Metrics, logs, SLOs, backups that provably restore — and honest post-mortems when reality pushes back.",
  },
];

const JUMPS = ["capabilities", "stack", "method", "proof", "who", "channel"];

export default function Home() {
  return (
    <main>
      <p className="boot veil" aria-hidden="true">
        <span className="prompt">$</span> arc4ne --init <span className="dim">· arc struck</span>{" "}
        <span className="ok">· ok</span>
      </p>

      <header className="hero">
        <h1 className="mark" aria-label="ARC4NE">
          {MARK.split("").map((ch, i) => (
            <span
              key={i}
              className={ch === "4" ? "g four" : "g"}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              {ch}
            </span>
          ))}
        </h1>
        <Decode
          as="p"
          className="tag veil"
          text="systems architecture · software engineering · applied AI"
          delay={450}
        />
        <p className="defn veil">
          <span className="k">from physics:</span>{" "}
          <Decode text="an arc — current leaping a gap, tearing gas into glowing plasma. Lightning's family. Latin arcus: the bow, the curve." delay={650} />
        </p>
        <p className="defn veil">
          <span className="k">from chemistry:</span>{" "}
          <Decode text="Ne — neon, element 10. A noble gas: stable, invisible, utterly inert — until it's energised." delay={850} />
        </p>
        <p className="defn veil">
          <span className="k">put together:</span>{" "}
          <Decode text="an arc discharge through neon gas is literally how a neon sign glows. 'Arcane' means hidden knowledge; neon means visible light. arc4ne is the spark between them — the thing that makes the arcane glow." delay={1050} />
        </p>
        <Decode
          as="p"
          className="decode veil"
          text="/ɑːˈkeɪn/ — an arc for Ne · neon sits dark until an arc strikes through it."
          delay={1300}
        />
        <Decode
          as="p"
          className="spark veil"
          text="You bring the neon. We bring the arc."
          delay={1550}
        />
        <Decode
          as="p"
          className="sub veil"
          text="We design, build, and run software that holds up in production — from first diagram to metal."
          delay={1750}
        />
        <p className="badge">
          <Decode text="alpha v0.1 — forged in Australia" delay={1950} />
        </p>
        <nav className="jump veil" aria-label="sections">
          <span className="prompt">&gt;</span> goto:{" "}
          {JUMPS.map((j, i) => (
            <span key={j}>
              <a href={`#${j}`}>{j}</a>
              {i < JUMPS.length - 1 ? <span className="sep"> · </span> : null}
            </span>
          ))}
        </nav>
      </header>

      <section id="capabilities" className="services" aria-labelledby="svc-h">
        <h2 id="svc-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="ls ./capabilities" />
        </h2>
        <div className="grid">
          {SERVICES.map((s, i) => (
            <article key={s.n} className="card">
              <span className="num" aria-hidden="true">
                {s.n}
              </span>
              <Decode as="h3" text={s.name} delay={i * 120} />
              <Decode as="p" text={s.desc} delay={i * 120 + 150} />
            </article>
          ))}
        </div>
      </section>

      <section id="stack" className="services" aria-labelledby="stk-h">
        <h2 id="stk-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="cat ./stack" />
        </h2>
        <Decode
          as="p"
          className="lead veil"
          text="Current-generation, boring-on-purpose choices — modern enough to move fast, proven enough to sleep at night."
        />
        <div className="grid">
          {STACK.map((s, i) => (
            <article key={s.k} className="card">
              <Decode as="h3" text={s.k} delay={i * 100} />
              <Decode as="p" text={s.v} delay={i * 100 + 130} />
            </article>
          ))}
        </div>
      </section>

      <section id="method" className="services" aria-labelledby="mtd-h">
        <h2 id="mtd-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="cat ./method" />
        </h2>
        <div className="grid">
          {METHOD.map((m, i) => (
            <article key={m.n} className="card">
              <span className="num" aria-hidden="true">
                {m.n}
              </span>
              <Decode as="h3" text={m.name} delay={i * 100} />
              <Decode as="p" text={m.desc} delay={i * 100 + 130} />
            </article>
          ))}
        </div>
        <Decode
          as="p"
          className="lead veil"
          text="Multi-tenant SaaS is a specialty: identity and SSO, billing, tenant isolation, rate limits, audit trails — the parts nobody demos and every customer depends on."
        />
      </section>

      <section id="proof" className="services" aria-labelledby="prf-h">
        <h2 id="prf-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="cat ./proof" />
        </h2>
        <Decode
          as="p"
          className="lead veil"
          text="We run what we sell. This page is served from our own Kubernetes cluster on ARM metal in Sydney — GitOps-deployed (a push to main built two architectures and rolled it out), fronted by Cloudflare with zero inbound ports, watched by our own dashboards, backed up off-site nightly."
        />
        <Decode
          as="p"
          className="lead veil"
          text="Built in Australia, timezone-native for Australian businesses — with partner reach across Europe and South America."
          delay={200}
        />
      </section>

      <p className="ethos veil" role="doc-epigraph">
        <Decode text="own your metal · measure, never assume · ship honest systems" />
      </p>

      <section id="who" className="founders" aria-labelledby="fnd-h">
        <h2 id="fnd-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="who" />
        </h2>
        <Decode
          as="p"
          className="lead veil"
          text="A team of German, Australian and Brazilian software engineers with a proven track record — decades of shipping, from video-conferencing systems in the '90s to modern SaaS and applied AI. Timezone-native for Australia; working reach across Europe and South America."
        />
        <div className="fgrid">
          <article className="person">
            <Decode as="h3" text="the team" />
            <Decode as="p" className="role" text="engineering · product · operations" delay={120} />
            <Decode
              as="p"
              text="Senior hands on every line: full-stack web and mobile, SaaS with auth and billing, AI/LLM integration, code audits and security hardening, DevOps and 24/7 operations. Hundreds of projects shipped — from startups to household-name platforms."
              delay={240}
            />
          </article>
          <article className="person">
            <Decode as="h3" text="the bench" delay={100} />
            <Decode as="p" className="role" text="architecture · platform · applied ai" delay={220} />
            <Decode
              as="p"
              text="Systems people: Kubernetes and GitOps, RAG pipelines with published eval scores, security-hardened by default. The cluster serving this page is our own work, end to end."
              delay={340}
            />
          </article>
        </div>
      </section>

      <section id="channel" className="contact" aria-labelledby="ctc-h">
        <h2 id="ctc-h" className="sect veil">
          <span className="prompt">$</span> <Decode text="open channel" />
        </h2>
        <p className="term">
          <a href="mailto:arcan.e@gipc.dev?subject=arc4ne">
            arcan.e@gipc.dev <span className="dim">— relay while arc4ne mail spins up</span>
          </a>
        </p>
      </section>

      <footer>
        <p className="veil">
          status: <span className="ok">alpha</span> · infra: self-hosted k3s · syd ·{" "}
          <span className="chem" title="argon · carbon · neon">
            Ar·C·Ne
          </span>{" "}
          · © {new Date().getFullYear()} arc4ne
        </p>
      </footer>
    </main>
  );
}
