import Decode from "./Decode";

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
        <Decode
          as="p"
          className="tag"
          text="systems architecture · software engineering · applied AI"
          delay={450}
        />
        <Decode
          as="p"
          className="decode"
          text="/ɑːˈkeɪn/ — an arc for Ne · neon sits dark until an arc strikes through it."
          delay={650}
        />
        <Decode as="p" className="spark" text="You bring the neon. We bring the arc." delay={900} />
        <Decode
          as="p"
          className="sub"
          text="We design, build, and run software that holds up in production — from first diagram to metal."
          delay={1100}
        />
        <p className="badge">
          <Decode text="alpha v0.1 — two engineers, one forge" delay={1350} />
        </p>
      </header>

      <section className="services" aria-labelledby="svc-h">
        <h2 id="svc-h" className="sect">
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

      <p className="ethos" role="doc-epigraph">
        <Decode text="own your metal · measure, never assume · ship honest systems" />
      </p>

      <section className="founders" aria-labelledby="fnd-h">
        <h2 id="fnd-h" className="sect">
          <span className="prompt">$</span> <Decode text="who" />
        </h2>
        <div className="fgrid">
          <article className="person">
            <Decode as="h3" text="gabriel carvalho" />
            <Decode as="p" className="role" text="systems · platform · ai" delay={120} />
            <p>
              <Decode
                text="Builds and runs the stack this page is served from — self-hosted Kubernetes, GitOps, RAG systems."
                delay={240}
              />{" "}
              <a href="https://gipc.dev" rel="me">
                gipc.dev ↗
              </a>
            </p>
          </article>
          <article className="person">
            <Decode as="h3" text="oliver kuchendorf" delay={100} />
            <Decode as="p" className="role" text="engineering · product" delay={220} />
            <p>
              <Decode
                text="Three decades of shipping software — from video-conferencing systems to CTO of one of Brazil's biggest consumer platforms, 1000+ projects through his own studio."
                delay={340}
              />{" "}
              <a href="https://internet-arts.com" rel="me">
                internet-arts.com ↗
              </a>
            </p>
          </article>
        </div>
      </section>

      <section className="contact" aria-labelledby="ctc-h">
        <h2 id="ctc-h" className="sect">
          <span className="prompt">$</span> <Decode text="open channel" />
        </h2>
        <p className="term">
          <a href="mailto:arcan.e@gipc.dev?subject=arc4ne">
            arcan.e@gipc.dev <span className="dim">— relay while arc4ne mail spins up</span>
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
