'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { content } from '../lib/content';

const LANGS = ['fa', 'en', 'ar'];
const SECTION_IDS = ['about', 'services', 'works', 'timeline', 'contact'];

// --- Small, dependency-free interaction helpers -------------------------
// Kept outside the component so they aren't recreated on every render.

function handleTilt(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  const rx = (px - 0.5) * 9;
  const ry = (0.5 - py) * 9;
  el.style.setProperty('--rx', `${rx}deg`);
  el.style.setProperty('--ry', `${ry}deg`);
}

function resetTilt(e) {
  const el = e.currentTarget;
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
}

function handleRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.left = `${e.clientX - rect.left - size / 2}px`;
  span.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(span);
  span.addEventListener('animationend', () => span.remove());
}

// Animates a stat value ("24/7", "100%", "03") from zero once it scrolls
// into view, preserving any non-numeric suffix and leading-zero padding.
function StatCounter({ value, label }) {
  const ref = useRef(null);
  const match = value.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(() =>
    match ? '0'.padStart(match[1].length, '0') + match[2] : value,
  );

  useEffect(() => {
    if (!match || !ref.current) return undefined;
    const target = parseInt(match[1], 10);
    const pad = match[1].length;
    const suffix = match[2];
    let animated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || animated) return;
          animated = true;
          const start = performance.now();
          const duration = 1100;
          const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - progress) ** 3;
            const current = Math.round(target * eased);
            setDisplay(String(current).padStart(pad, '0') + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div
      ref={ref}
      className="tile glass stat tilt"
      data-reveal=""
      onMouseMove={handleTilt}
      onMouseLeave={resetTilt}
    >
      <strong>{display}</strong>
      <span>{label}</span>
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = useState('fa');
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const mainRef = useRef(null);
  const scrollBarRef = useRef(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('metasho-lang');
    if (saved && LANGS.includes(saved)) setLang(saved);
  }, []);

  const t = useMemo(() => content[lang], [lang]);

  useEffect(() => {
    window.localStorage.setItem('metasho-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  const accentStyle = useMemo(
    () => ({
      '--accent': t.theme.accent,
      '--accent-2': t.theme.accent2,
      '--accent-3': t.theme.accent3,
      '--glow': t.theme.glow,
    }),
    [t.theme],
  );

  // Cursor-following ambient glow (desktop only, mutated directly on the
  // DOM for performance rather than through React state).
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return undefined;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${e.clientX}px`);
        el.style.setProperty('--my', `${e.clientY}px`);
        raf = null;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Scroll progress bar + sticky-nav state + back-to-top visibility.
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const height = doc.scrollHeight - doc.clientHeight;
        const pct = height > 0 ? (scrollTop / height) * 100 : 0;
        if (scrollBarRef.current) {
          scrollBarRef.current.style.setProperty('--scroll', `${pct}%`);
        }
        setScrolled(scrollTop > 12);
        setShowTop(scrollTop > 560);
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scrollspy: highlight the nav link for the section in view.
  useEffect(() => {
    const els = SECTION_IDS.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Scroll-reveal: fade + rise every [data-reveal] element into place.
  // Re-runs on language change so freshly mounted (re-keyed) cards get
  // observed too, and reveals anything already on screen immediately.
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [lang]);

  const backToTopLabel = lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top';

  return (
    <main className="shell" dir={t.dir} style={accentStyle} ref={mainRef}>
      <div className="scroll-progress" ref={scrollBarRef} />
      <div className="cursor-glow" />
      <div className="noise" />
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="backdrop-grid" />
      <div className="container">
        <header className={`nav glass${scrolled ? ' scrolled' : ''}`}>
          <div className="nav-inner">
            <div className="brand">
              <div className="brand-mark">M</div>
              <div>
                <h1>Metasho</h1>
                <p>{t.hero.kicker}</p>
              </div>
            </div>

            <nav className="nav-links" aria-label="Main navigation">
              <a href="#about" className={activeSection === 'about' ? 'active' : ''}>
                {t.nav.about}
              </a>
              <a href="#services" className={activeSection === 'services' ? 'active' : ''}>
                {t.nav.services}
              </a>
              <a href="#works" className={activeSection === 'works' ? 'active' : ''}>
                {t.nav.works}
              </a>
              <a href="#timeline" className={activeSection === 'timeline' ? 'active' : ''}>
                {t.nav.timeline}
              </a>
              <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>
                {t.nav.contact}
              </a>
            </nav>

            <div className="lang-switcher" aria-label="Language switcher">
              {LANGS.map((code) => {
                const item = content[code];
                const active = lang === code;
                return (
                  <button
                    key={code}
                    type="button"
                    className={active ? 'active' : ''}
                    aria-pressed={active}
                    onClick={() => setLang(code)}
                  >
                    <span>{item.localeName}</span>
                    <small>{item.localeHint}</small>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-grid">
            <div className="hero-main glass">
              <div className="kicker">
                <span className="kicker-dot" />
                <span>{t.hero.kicker}</span>
                <span className="kicker-sep">•</span>
                <span>{t.localeName}</span>
              </div>
              <h2>{t.hero.title}</h2>
              <p>{t.hero.text}</p>
              <div className="hero-actions">
                <a className="btn primary" href="#works" onMouseDown={handleRipple}>
                  {t.hero.primary}
                </a>
                <a className="btn" href="#contact" onMouseDown={handleRipple}>
                  {t.hero.secondary}
                </a>
              </div>
            </div>

            <div className="hero-side">
              <div
                className="info-card glass tilt"
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <h3>{t.hero.noteTitle}</h3>
                <p>{t.hero.noteText}</p>
                <div className="badges">
                  {t.hero.badges.map((badge) => (
                    <span key={badge} className="badge">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                {t.stats.map((item) => (
                  <StatCounter key={item.label} value={item.value} label={item.label} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section language-panel glass" data-reveal="">
          <div className="section-title language-title">
            <div>
              <h3>{lang === 'fa' ? 'تفکیک زبانی' : lang === 'ar' ? 'الفصل اللغوي' : 'Language separation'}</h3>
              <p>{lang === 'fa' ? 'هر زبان شخصیت بصری خودش را دارد و در UI فقط ترجمه نشده، بلکه هویت گرفته است.' : lang === 'ar' ? 'لكل لغة شخصية بصرية خاصة بها بدل أن تكون مجرد ترجمة.' : 'Each language has its own visual identity, not just its own text.'}</p>
            </div>
            <div className="language-tag">{t.localeName}</div>
          </div>
          <div className="highlight-grid">
            {t.highlights.map((item, i) => (
              <article
                key={item.title}
                className="highlight-card tilt"
                data-reveal=""
                style={{ transitionDelay: `${i * 90}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <span className="highlight-badge" />
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-title" data-reveal="">
            <h3>{t.about.title}</h3>
            <p>{t.about.text}</p>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-title" data-reveal="">
            <h3>{t.services.title}</h3>
            <p>{t.services.subtitle}</p>
          </div>
          <div className="grid-3">
            {t.services.items.map((item, i) => (
              <div
                key={item.title}
                className="tile glass tilt"
                data-reveal=""
                style={{ transitionDelay: `${i * 90}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="works">
          <div className="section-title" data-reveal="">
            <h3>{t.projects.title}</h3>
            <p>{t.projects.subtitle}</p>
          </div>
          <div className="projects">
            {t.projects.items.map((item, i) => (
              <article
                key={item.title}
                className="project glass tilt"
                data-reveal=""
                style={{ transitionDelay: `${i * 100}ms` }}
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <span className="tag">{item.tag}</span>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="timeline">
          <div className="section-title" data-reveal="">
            <h3>{t.timeline.title}</h3>
            <p>{t.timeline.subtitle}</p>
          </div>
          <div className="timeline">
            {t.timeline.items.map((item, i) => (
              <div
                key={item.time}
                className="timeline-item glass"
                data-reveal=""
                style={{ transitionDelay: `${i * 90}ms` }}
              >
                <time>{item.time}</time>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-title" data-reveal="">
            <h3>{t.contact.title}</h3>
            <p>{t.contact.subtitle}</p>
          </div>
          <div className="contact-box glass" data-reveal="">
            <div className="contact-grid">
              <div className="contact-item">
                <span>Email</span>
                <strong>{t.contact.email}</strong>
              </div>
              <div className="contact-item">
                <span>Phone</span>
                <strong>{t.contact.phone}</strong>
              </div>
              <div className="contact-item">
                <span>Location</span>
                <strong>{t.contact.location}</strong>
              </div>
              <div className="contact-item">
                <span>Brand</span>
                <strong>Metasho</strong>
              </div>
            </div>
            <div className="hero-actions">
              <a className="btn primary" href={`mailto:${t.contact.email}`} onMouseDown={handleRipple}>
                {t.contact.email}
              </a>
              <a className="btn" href="#about" onMouseDown={handleRipple}>
                {lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top'}
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">{t.footer}</footer>
      </div>

      <button
        type="button"
        className={`back-to-top${showTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={backToTopLabel}
        title={backToTopLabel}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </main>
  );
}
