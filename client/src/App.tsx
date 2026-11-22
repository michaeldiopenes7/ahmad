import { useState, type FormEvent } from 'react';

import servicesData from '../../server/data/services.json';

type Service = { id: string; label: string; desc: string; tags: string[] };

// Bundled at build time (same file the API serves), so the page never waits on the server for it.
const SERVICES: Service[] = servicesData;

// Copy marked EDIT is placeholder text to confirm with Ahmad before launch.
const PROFILE = {
  name: 'Ahmad',
  role: 'Independent designer & developer', // EDIT
  location: 'Based in Southeast Asia, working worldwide', // EDIT
  intro:
    'I build the digital side of a business: the site customers land on, the systems behind it, and the media that makes both worth looking at. One person, start to finish.', // EDIT
};

const PROCESS = [
  { k: 'Listen', d: 'We sit down and look at how customers find you, buy from you and get stuck. No deck, just your numbers and your inbox.' },
  { k: 'Shape', d: 'One plan with a fixed scope, a date and a price. You see screens and prototypes, not documents about screens.' },
  { k: 'Build', d: 'I design, build and produce the media myself, so nothing gets lost in a hand-off. Weekly demos on the real thing.' },
  { k: 'Stay', d: 'After launch I keep it running, measure what changed and improve the parts that matter.' },
];

function Sphere({ tone, className }: { tone: 'chrome' | 'black'; className?: string }) {
  return <span aria-hidden className={`sphere sphere--${tone} ${className ?? ''}`} />;
}

function Services() {
  const [open, setOpen] = useState<string | null>(SERVICES[0]?.id ?? null);

  return (
    <section className="section" id="work" aria-labelledby="work-h">
      <header className="section__head">
        <p className="eyebrow">01 — What I do</p>
        <h2 id="work-h" className="display-sm">Five disciplines, one person.</h2>
      </header>
      <ol className="services">
        {SERVICES.map((s, i) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id} className={`svc ${isOpen ? 'is-open' : ''}`}>
              <button
                className="svc__row"
                aria-expanded={isOpen}
                aria-controls={`svc-${s.id}`}
                onClick={() => setOpen(isOpen ? null : s.id)}
              >
                <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
                <span className="svc__label">{s.label}</span>
                <Sphere tone={isOpen ? 'chrome' : 'black'} className="svc__dot" />
              </button>
              <div id={`svc-${s.id}`} className="svc__body" hidden={!isOpen}>
                <p>{s.desc}</p>
                <ul className="tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const CONTACT_EMAIL = 'ahmadsalihuddin96@gmail.com';

function Contact() {
  const [msg, setMsg] = useState('');

  // No backend: opens the visitor's email app with the message pre-filled.
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') ?? '').trim();
    const message = String(f.get('message') ?? '').trim();
    if (!name || !message) {
      setMsg('Please add your name and a message.');
      return;
    }
    const subject = `Project enquiry from ${name}`;
    const body = `${message}\n\n${name}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setMsg('Opening your email app…');
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-h">
      <Sphere tone="chrome" className="contact__orb" />
      <div className="contact__inner">
        <p className="eyebrow eyebrow--inv">03 — Contact</p>
        <h2 id="contact-h" className="display">
          Let’s make
          <br />
          something <em>round</em>.
        </h2>
        <a className="contact__mail" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        <form className="form" onSubmit={submit} noValidate>
          <label className="form__wide">
            <span>Name</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label className="form__wide">
            <span>What are you working on?</span>
            <textarea name="message" rows={4} required />
          </label>
          <div className="form__foot">
            <button className="btn">Send message</button>
            <p role="status" className="form__msg">{msg}</p>
          </div>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <nav className="nav">
        <a href="#top" className="nav__mark">
          <Sphere tone="black" /> {PROFILE.name}
        </a>
        <div className="nav__links">
          <a href="#work">Work</a>
          <a href="#approach">Approach</a>
          <a href="#contact" className="nav__cta">Say hello</a>
        </div>
      </nav>

      <main id="top">
        <section className="hero">
          <div className="hero__light" aria-hidden />
          <Sphere tone="chrome" className="float f1" />
          <Sphere tone="black" className="float f2" />
          <Sphere tone="chrome" className="float f3" />

          <div className="hero__top">
            <p className="eyebrow">{PROFILE.role}</p>
            <p className="eyebrow">{PROFILE.location}</p>
          </div>

          <h1 className="hero__name">
            {PROFILE.name}
            <span className="hero__dot" aria-hidden>.</span>
          </h1>

          <div className="hero__grid">
            <div className="hero__intro">
              <p className="lede">{PROFILE.intro}</p>
              <div className="hero__actions">
                <a href="#contact" className="btn">Start a project</a>
                <a href="#work" className="btn btn--ghost">See services</a>
              </div>
            </div>

            <figure className="hero__photo">
              <img src="/ahmad.jpg" alt="Ahmad sitting cross-legged, holding a silver sphere, in a grey studio" width={1024} height={1536} />
            </figure>

            <ol className="hero__list" aria-label="Disciplines">
              {['Websites & apps', 'Business systems', 'Applied AI', 'Brand & demand', '3D & motion'].map((d, i) => (
                <li key={d}><span>{String(i + 1).padStart(2, '0')}</span>{d}</li>
              ))}
            </ol>
          </div>
        </section>

        <div className="marquee" aria-hidden>
          <div className="marquee__track">
            {Array.from({ length: 6 }).map((_, n) => (
              <span key={n}>
                Websites <i /> Systems <i /> Applied AI <i /> Brand <i /> 3D &amp; motion <i />
              </span>
            ))}
          </div>
        </div>

        <Services />

        <section className="section" id="approach" aria-labelledby="approach-h">
          <header className="section__head">
            <p className="eyebrow">02 — Approach</p>
            <h2 id="approach-h" className="display-sm">One person. Whole picture.</h2>
          </header>
          <ol className="process">
            {PROCESS.map((p, i) => (
              <li key={p.k}>
                <Sphere tone={i % 2 ? 'black' : 'chrome'} className="process__orb" />
                <h3>{p.k}</h3>
                <p>{p.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <Contact />
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <span>Designed and built by Ahmad</span>
      </footer>
    </>
  );
}
