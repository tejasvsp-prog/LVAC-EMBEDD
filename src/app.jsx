/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

/* =========================================================
   Decorative SVG: AI node constellation
   ========================================================= */
function NodeNet({ count = 26, color = "#EEF4ED", accent = "#D62828", density = 1, animated = true }) {
  // Deterministic pseudo-random nodes
  const nodes = useMemo(() => {
    const seed = 7;
    const arr = [];
    let s = seed;
    const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rand() * 100,
        y: rand() * 100,
        r: 0.6 + rand() * 1.4,
        a: 0.3 + rand() * 0.6,
        accent: rand() > 0.85,
        d: 2 + rand() * 4,
      });
    }
    return arr;
  }, [count]);

  // Build a sparse network: each node connects to nearest 1-2 others
  const lines = useMemo(() => {
    const out = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes.map((n, j) => ({
        j,
        d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y),
      })).filter(o => o.j !== i).sort((a, b) => a.d - b.d);
      const k = Math.min(2, dists.length);
      for (let q = 0; q < k; q++) {
        if (dists[q].d < 28 * density) {
          out.push({ a: i, b: dists[q].j, op: 1 - dists[q].d / 35 });
        }
      }
    }
    return out;
  }, [nodes, density]);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
      <g stroke={color} strokeWidth="0.12" fill="none" style={{ opacity: 0.6 }}>
        {lines.map((l, i) => (
          <line key={i}
                x1={nodes[l.a].x} y1={nodes[l.a].y}
                x2={nodes[l.b].x} y2={nodes[l.b].y}
                opacity={Math.max(0.15, l.op)} />
        ))}
      </g>
      <g>
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r * 0.35}
                  fill={n.accent ? accent : color}
                  opacity={n.a}>
            {animated && i % 4 === 0 && (
              <animate attributeName="opacity"
                       values={`${n.a};${n.a * 0.3};${n.a}`}
                       dur={`${n.d}s`}
                       repeatCount="indefinite" />
            )}
          </circle>
        ))}
      </g>
    </svg>
  );
}

/* =========================================================
   useReveal — intersection observer
   ========================================================= */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* =========================================================
   Sticky Nav
   ========================================================= */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="container nav__inner">
        <a href="#top" className="brand" aria-label="LVAC AI Summit home">
          <span className="brand__seal">LVAC</span>
          <span className="brand__txt">
            Lansing AI Summit
            <span className="brand__sub">& Workforce Forum · 2026</span>
          </span>
        </a>
        <nav className="nav__links" aria-label="Primary">
          <a href="#about">Welcome</a>
          <a href="#agenda">Agenda</a>
          <a href="#audiences">Who</a>
          <a href="#partners">Partners</a>
          <a href="#faq">FAQ</a>
          <a href="#register" className="nav__cta">Register →</a>
        </nav>
      </div>
    </header>
  );
}

/* =========================================================
   Hero
   ========================================================= */
function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container">
        <div className="hero__meta">
          <div className="hero__meta-item">Edition <strong>I · 2026</strong></div>
          <div className="hero__meta-item">Filed from <strong>Lansing, Michigan</strong></div>
          <div className="hero__meta-item">Status <strong style={{color: "var(--red)"}}>● Open Registration</strong></div>
        </div>

        <div className="hero__title">
          <h1>
            Lansing <span className="accent it">AI</span> Summit
            <br />
            <span className="amp">&amp;</span> Workforce Forum.
          </h1>
        </div>

        <div className="hero__lower">
          <div>
            <div className="eyebrow" style={{marginBottom: 18}}><span className="dot"></span>A One-Day Hybrid Convening</div>
            <p className="hero__lede">
              A one-day hybrid convening for students, veterans, small business owners,
              and employers <span className="it">around the future of AI-powered work</span> in the
              Great Lakes region.
            </p>
            <div className="hero__cta-row">
              <a href="#register" className="btn btn--lg">
                Reserve your seat <span className="arrow">→</span>
              </a>
              <a href="#agenda" className="btn btn--ghost btn--lg">
                Read the agenda
              </a>
            </div>
          </div>

          <div className="hero__media reveal">
            <span className="hero__media-tag"><span className="dot"></span>Peckham, Inc. · Lansing, MI</span>
            <image-slot
              id="hero-photo"
              shape="rect"
              placeholder="Drop a Lansing / community photo here"
            ></image-slot>
            <div className="hero__nodes">
              <NodeNet count={32} color="#EEF4ED" accent="#D62828" density={1.1} />
            </div>
          </div>
        </div>

        <div className="hero__strip">
          <div className="hero__strip-item">
            <span className="k">Date</span>
            <span className="v">TBD <span className="small">/ Save the Date</span></span>
          </div>
          <div className="hero__strip-item">
            <span className="k">Hours</span>
            <span className="v">8:00 — 15:00</span>
          </div>
          <div className="hero__strip-item">
            <span className="k">Format</span>
            <span className="v">Hybrid<span className="small">in-person + virtual</span></span>
          </div>
          <div className="hero__strip-item">
            <span className="k">Admission</span>
            <span className="v">Free<span className="small">community</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   About
   ========================================================= */
function About() {
  return (
    <section className="section about" id="about">
      <div className="container about__inner">
        <div className="about__visual reveal">
          <div className="about__visual-net">
            <NodeNet count={28} color="#EEF4ED" accent="#D62828" density={1.0} />
          </div>
          <div className="about__quote">
            <span className="mark">“</span>
            AI will not replace workers.
            <br />
            <span className="it" style={{color:"var(--slate)"}}>Workers with AI</span> will replace those without.
          </div>
        </div>
        <div className="about__copy reveal">
          <div className="eyebrow" style={{marginBottom: 20}}><span className="dot"></span>About the Summit</div>
          <h2>AI is reshaping work. <span className="it">Be ready.</span></h2>
          <p className="lead">
            The Lansing AI Summit brings together community leaders, employers, educators,
            and workforce professionals to explore how artificial intelligence is transforming
            hiring, training, and economic opportunity.
          </p>
          <p>
            One focused day. Four audience tracks. A practical lens on how Michigan can
            lead — not follow — the next chapter of work.
          </p>
          <a href="#register" className="btn">Reserve your spot <span className="arrow">→</span></a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Why Attend
   ========================================================= */
function Why() {
  const items = [
    { n: "01", h: "Practical AI Knowledge", p: "Learn what AI actually means for your career, classroom, or business — without the jargon." },
    { n: "02", h: "Community Connections",  p: "Meet employers, educators, and peers shaping Michigan's AI-ready workforce in one room." },
    { n: "03", h: "Clear Next Steps",       p: "Leave with concrete tools, training paths, and hiring strategies you can put to work on Monday." },
  ];
  return (
    <section className="section why" id="why">
      <div className="container">
        <div className="sec-head">
          <div className="sec-head__label eyebrow"><span className="dot"></span>Why Attend</div>
          <div className="sec-head__body">
            <h2>What you'll walk away with.</h2>
            <p>A day designed to deliver real, actionable value — not just talk.</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="why__grid reveal reveal--stagger">
          {items.map(it => (
            <div className="why__card" key={it.n}>
              <div className="num">{it.n}<span style={{display:"none"}}></span></div>
              <h3>{it.h}</h3>
              <p>{it.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Audiences
   ========================================================= */
function Audiences({ onPickTrack }) {
  const items = [
    { k: "STU", track: "student",  h: "Students",             p: "High school and college students exploring AI-ready careers and skills.", pill: "Student Track" },
    { k: "VET", track: "veteran",  h: "Veterans",             p: "Service members translating military experience into civilian AI-ready roles.", pill: "Veteran Track" },
    { k: "SMB", track: "business", h: "Small Business Owners",p: "Entrepreneurs learning AI tools to compete and grow in today's economy.", pill: "Business Track" },
    { k: "EMP", track: "business", h: "Employers",            p: "HR professionals and hiring managers building AI-integrated workforce strategies.", pill: "Business Track" },
  ];
  return (
    <section className="section aud" id="audiences">
      <div className="container">
        <div className="sec-head">
          <div className="sec-head__label eyebrow"><span className="dot"></span>Who Should Attend</div>
          <div className="sec-head__body">
            <h2>Built for the whole community.</h2>
            <p>Whether you're entering the workforce, rebuilding a career, growing a business, or hiring talent — there's a track designed for you.</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="aud__grid reveal reveal--stagger">
          {items.map(it => (
            <div className="aud__card" key={it.h}
                 onClick={() => onPickTrack && onPickTrack(it.track)}
                 style={{cursor: "pointer"}}
                 title={"Filter agenda → " + it.pill}>
              <div className="icon">{it.k}</div>
              <h3>{it.h}</h3>
              <p>{it.p}</p>
              <div className="track-pill">→ {it.pill}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Agenda
   ========================================================= */
const AGENDA = [
  { time: "8:00 AM",      sub: "Doors open",   h: "Registration & Welcome Networking", p: "Doors open, coffee, and early connection with attendees and exhibitors.", tag: "Networking", tracks: ["all"] },
  { time: "9:00 AM",      sub: "Main stage",   h: "Opening Keynote: AI and the Future of Work in Michigan", p: "Setting the stage — what AI means for workers, businesses, and our region.", tag: "Keynote", tracks: ["all"] },
  { time: "10:10–11:00",  sub: "Concurrent",   h: "Morning Sessions — Choose Your Track", p: "Three concurrent breakouts. Pick the one that fits where you are.", tag: "Breakouts", tracks: ["student","veteran","business"],
    sessions: [
      { track: "student",  label: "Student Track",  h: "AI Careers & Skills for the Next Generation" },
      { track: "veteran",  label: "Veteran Track",  h: "Translating Military Skills into AI-Ready Roles" },
      { track: "business", label: "Business Track", h: "AI Tools for Growth, Hiring & Operations" },
    ] },
  { time: "11:30 — 12:30",sub: "Resource Fair",h: "Lunch & Resource Fair", p: "Connect with training programs, community organizations, and employers over lunch.", tag: "Lunch Break", tracks: ["all"] },
  { time: "1:10 — 2:30",  sub: "Main stage",   h: "Panel Discussion & Closing: Employers Leading with AI", p: "Regional employers and leaders share how they're integrating AI — followed by closing remarks and community commitments for action.", tag: "Panel & Closing", tracks: ["all"] },
  { time: "2:30 — 3:00",  sub: "Lobby",        h: "Closing Networking Reception", p: "Build lasting connections. Event concludes at 3:00 PM.", tag: "Networking", tracks: ["all"] },
];

function Agenda({ filter, setFilter }) {
  const tracks = [
    { id: "all",      label: "All Sessions" },
    { id: "student",  label: "Student" },
    { id: "veteran",  label: "Veteran" },
    { id: "business", label: "Business" },
  ];

  return (
    <section className="section agenda" id="agenda">
      <div className="container">
        <div className="sec-head">
          <div className="sec-head__label eyebrow"><span className="dot"></span>Day at a Glance</div>
          <div className="sec-head__body">
            <h2>Event Agenda <span className="it" style={{color:"var(--ink-faint)"}}>· Draft</span></h2>
            <p>A focused day of learning, connection, and actionable insight. Final schedule forthcoming.</p>
          </div>
        </div>

        <div className="agenda__filter">
          <span className="agenda__filter-label">Filter by track</span>
          {tracks.map(t => (
            <button key={t.id}
              className={"chip" + (filter === t.id ? " is-active" : "")}
              onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="agenda__list">
          {AGENDA.map((row, i) => {
            const isMatch = filter === "all"
              || row.tracks.includes("all")
              || row.tracks.includes(filter);
            const isHighlight = filter !== "all" && row.tracks.includes(filter);
            return (
              <div key={i} className={"agenda__item reveal" + (!isMatch ? " is-dimmed" : "")}>
                <div className="agenda__time">
                  {row.time}
                  <span className="sub">{row.sub}</span>
                </div>
                <div className="agenda__body">
                  <h3>{row.h}</h3>
                  <p>{row.p}</p>
                  {row.sessions && (
                    <div className="agenda__sessions">
                      {row.sessions.map((s, j) => {
                        const dim = filter !== "all" && filter !== s.track;
                        return (
                          <div key={j} className="agenda__session"
                               data-track={s.track}
                               style={{opacity: dim ? 0.3 : 1, transition: "opacity .3s"}}>
                            <div className="label">{s.label}</div>
                            <h4>{s.h}</h4>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="agenda__tag">{row.tag}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Partners
   ========================================================= */
function Partners() {
  const cats = [
    { eyebrow: "Academic", h: "Universities & Schools", logos: ["MSU","LCC","Davenport","K–12 Districts"] },
    { eyebrow: "Government & City", h: "Public Sector", logos: ["City of Lansing","Michigan Works!","Ingham Co.","LEAP"] },
    { eyebrow: "Veteran Orgs", h: "Service Networks", logos: ["MVAA","Disabled Vets","Mich. Vet Coalition"] },
    { eyebrow: "Community Nonprofits", h: "Mission Partners", logos: ["United Way","Capital Area MI","NAACP Lansing","Lansing Promise"] },
  ];
  return (
    <section className="section partners" id="partners">
      <div className="container">
        <div className="sec-head">
          <div className="sec-head__label eyebrow"><span className="dot"></span>Our Partners</div>
          <div className="sec-head__body">
            <h2>Rooted in the community.</h2>
            <p>The Lansing AI Summit is made possible through the leadership of mission-aligned organizations committed to equitable workforce development.</p>
          </div>
        </div>

        <div className="partners__host reveal">
          <div className="partners__host-logo">Peckham</div>
          <div className="partners__host-body">
            <div className="eyebrow" style={{marginBottom: 12, color:"var(--red)"}}><span className="dot"></span>Anchor & Host Partner</div>
            <h3>Peckham, Inc.</h3>
            <p>A nonprofit vocational rehabilitation organization providing job training,
              employment, and support services to individuals with barriers to employment — and the
              ideal host for this community-centered event.</p>
          </div>
        </div>

        <div className="partners__cats reveal reveal--stagger">
          {cats.map(c => (
            <div className="partners__cat" key={c.h}>
              <div className="eyebrow"><span className="dot"></span>{c.eyebrow}</div>
              <h3>{c.h}</h3>
              <div className="logos">
                {c.logos.map(l => <div className="partners__logo" key={l}>{l}</div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Register
   ========================================================= */
function Register() {
  return (
    <section className="section register" id="register">
      <div className="register__net">
        <NodeNet count={40} color="#EEF4ED" accent="#D62828" density={1.0} />
      </div>
      <div className="container">
        <div className="sec-head">
          <div className="sec-head__label eyebrow"><span className="dot"></span>Register</div>
          <div className="sec-head__body">
            <h2>Save your seat.</h2>
            <p>Free and open to the community — in-person and virtual options available. Fill out the form below to confirm your spot.</p>
          </div>
        </div>

        <div className="register__inner">
          <div className="register__side reveal">
            <h3>What to expect after registering</h3>
            <p>You'll get a confirmation email within 24 hours, with venue details, parking, and the live virtual link closer to the date.</p>
            <ul className="register__bullets">
              <li>A confirmation + calendar invite (in-person or virtual).</li>
              <li>A pre-event reading list — short, practical, no jargon.</li>
              <li>Track recommendations based on your role.</li>
              <li>Day-of logistics: venue map, parking, livestream URL.</li>
            </ul>
          </div>

          <div className="register__form-shell reveal">
            <div className="register__form-head">
              <span className="status"><span className="dot"></span>Live · Accepting RSVPs</span>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfu35tfZqywYZIbR6vfgwSqnx0fD5w_6_HzwGQn66U2dxU7Ow/viewform" target="_blank" rel="noopener">
                Open in new tab →
              </a>
            </div>
            <div className="register__form">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSfu35tfZqywYZIbR6vfgwSqnx0fD5w_6_HzwGQn66U2dxU7Ow/viewform?embedded=true"
                title="Lansing AI Summit Registration"
                loading="lazy">
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
   ========================================================= */
const FAQS = [
  { q: "How much does it cost to attend?",
    a: "The Lansing AI Summit is completely free and open to the community. We're committed to making this event accessible to anyone interested in the future of AI-powered work." },
  { q: "Is the event in-person, virtual, or both?",
    a: "Both. The summit is a hybrid event — join us in person at Peckham, Inc. in Lansing, MI, or tune in virtually from anywhere. Choose your format when you register." },
  { q: "Do I need any AI experience to attend?",
    a: "Not at all. The summit is built for the whole community — from curious newcomers to seasoned professionals. Every track is designed to meet you where you are." },
  { q: "Will lunch be provided?",
    a: "Yes — in-person attendees enjoy a complimentary lunch as part of the Resource Fair, where you can connect with training programs, community organizations, and employers." },
  { q: "Can my organization become a partner or sponsor?",
    aHtml: 'Absolutely. We welcome mission-aligned organizations committed to equitable workforce development. Reach out at <a href="mailto:mr.jamesbender@gmail.com">mr.jamesbender@gmail.com</a> to discuss partnership opportunities.' },
  { q: "Will sessions be recorded?",
    a: "Keynote and panel sessions will be recorded and shared with registered attendees after the event. Concurrent track sessions are in-person experiences designed for live engagement." },
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq" id="faq">
      <div className="container">
        <div className="faq__inner">
          <div className="faq__intro reveal">
            <div className="eyebrow" style={{marginBottom: 20}}><span className="dot"></span>FAQ</div>
            <h2>Common <span className="it">questions.</span></h2>
            <p>Everything you need to know before the summit.</p>
          </div>
          <div className="faq__list reveal">
            {FAQS.map((f, i) => (
              <div key={i} className={"faq__item" + (open === i ? " is-open" : "")}>
                <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  <span>{f.q}</span>
                  <span className="faq__icon" aria-hidden="true">+</span>
                </button>
                <div className="faq__a">
                  {f.aHtml
                    ? <p dangerouslySetInnerHTML={{ __html: f.aHtml }} />
                    : <p>{f.a}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   Closing CTA + Footer
   ========================================================= */
function ClosingCTA() {
  return (
    <section className="cta">
      <div className="cta__net">
        <NodeNet count={30} color="#0B2545" accent="#D62828" density={1.1} />
      </div>
      <div className="cta__inner reveal">
        <h2>Ready to shape <br/>the <span className="it">future of work?</span></h2>
        <p>Reserve your spot at the Lansing AI Summit. Free and open to the community — in-person and virtual options available.</p>
        <div className="cta__row">
          <a href="#register" className="btn btn--lg">Register now <span className="arrow">→</span></a>
          <a href="#agenda" className="btn btn--ghost btn--lg">View the agenda</a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <h3>Lansing AI Summit & Workforce Forum</h3>
            <p>A community-centered convening on the future of AI-powered work, hosted by Peckham, Inc. in Lansing, Michigan.</p>
          </div>
          <div className="footer__col">
            <h4>Event</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#agenda">Agenda</a></li>
              <li><a href="#audiences">Who</a></li>
              <li><a href="#partners">Partners</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Take Part</h4>
            <ul>
              <li><a href="#register">Register</a></li>
              <li><a href="mailto:mr.jamesbender@gmail.com">Partner with us</a></li>
              <li><a href="mailto:mr.jamesbender@gmail.com">Volunteer</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:mr.jamesbender@gmail.com">mr.jamesbender@gmail.com</a></li>
              <li><a href="tel:5178253737">517 · 825 · 3737</a></li>
              <li><a href="https://linkedin.com/in/jbender24" target="_blank" rel="noopener">linkedin.com/in/jbender24</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__values">
          <span>Mission</span>
          <span>Scope</span>
          <span>Insight</span>
          <span>Connection</span>
          <span>Service</span>
          <span>Development</span>
        </div>

        <div className="footer__bottom">
          <span>© 2026 MissionScope Solutions, LLC</span>
          <span>Hosted by Peckham, Inc.</span>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   App
   ========================================================= */
function App() {
  const [filter, setFilter] = useState("all");
  useReveal();

  const handlePickTrack = (track) => {
    setFilter(track);
    // scroll to agenda
    const el = document.getElementById("agenda");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 60;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <Nav />
      <Hero />
      <About />
      <Why />
      <Audiences onPickTrack={handlePickTrack} />
      <Agenda filter={filter} setFilter={setFilter} />
      <Partners />
      <Register />
      <Faq />
      <ClosingCTA />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
