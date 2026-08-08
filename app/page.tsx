const MARK = "ARC4NE";

const SERVICES = [
  {
    n: "01",
    name: "systems architecture",
    desc: "Boundaries, data flows, failure modes — decided before the first commit. We draw the system, then we defend the drawing.",
  },
  {
    n: "02",
    name: "software engineering",
    desc: "Typed, tested, shipped. Boring pipelines, exciting products. Code that the next engineer thanks you for.",
  },
  {
    n: "03",
    name: "saas platforms",
    desc: "Multi-tenant products from zero to production — auth, billing, observability, the unglamorous 80% done right.",
  },
  {
    n: "04",
    name: "applied ai",
    desc: "RAG, agents, evals. Grounded in your data, measured against reality, zero fabrication tolerated — in the model or the pitch.",
  },
];

export default function Home() {
  return (
    <main>
      <p className="boot" aria-hidden="true">
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
        <p className="tag">
          systems architecture <span className="sep">·</span> software engineering{" "}
          <span className="sep">·</span> applied AI
        </p>
        <p className="decode">
          /ɑːˈkeɪn/ — <em>an arc for Ne</em> · neon sits dark until an arc strikes
          through it.
        </p>
        <p className="spark">You bring the neon. We bring the arc.</p>
        <p className="sub">
          We design, build, and run software that holds up in production — from first
          diagram to metal.
        </p>
        <p className="badge">alpha v0.1 — two engineers, one forge</p>
      </header>

      <section className="services" aria-labelledby="svc-h">
        <h2 id="svc-h" className="sect">
          <span className="prompt">$</span> ls ./capabilities
        </h2>
        <div className="grid">
          {SERVICES.map((s) => (
            <article key={s.n} className="card">
              <span className="num" aria-hidden="true">
                {s.n}
              </span>
              <h3>{s.name}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <p className="ethos" role="doc-epigraph">
        own your metal <span className="sep">·</span> measure, never assume{" "}
        <span className="sep">·</span> ship honest systems
      </p>

      <section className="founders" aria-labelledby="fnd-h">
        <h2 id="fnd-h" className="sect">
          <span className="prompt">$</span> who
        </h2>
        <div className="fgrid">
          <article className="person">
            <h3>gabriel carvalho</h3>
            <p className="role">systems · platform · ai</p>
            <p>
              Builds and runs the stack this page is served from — self-hosted
              Kubernetes, GitOps, RAG systems.{" "}
              <a href="https://gipc.dev" rel="me">
                gipc.dev ↗
              </a>
            </p>
          </article>
          <article className="person">
            <h3>oliver kuchendorf</h3>
            <p className="role">engineering · product</p>
            <p>
              Three decades of shipping software — from video-conferencing systems to
              CTO of one of Brazil&apos;s biggest consumer platforms, 1000+ projects
              through his own studio.{" "}
              <a href="https://internet-arts.com" rel="me">
                internet-arts.com ↗
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="contact" aria-labelledby="ctc-h">
        <h2 id="ctc-h" className="sect">
          <span className="prompt">$</span> open channel
        </h2>
        <p className="term">
          <a href="mailto:arcane@gipc.dev?subject=arc4ne">
            arcane@gipc.dev <span className="dim">— relay while arc4ne mail spins up</span>
          </a>
        </p>
      </section>

      <footer>
        <p>
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
