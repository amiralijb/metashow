'use client';

import { useEffect, useMemo, useState } from 'react';
import { content } from '../lib/content';

const LANGS = ['fa', 'en', 'ar'];
const SECTION_IDS = ['about', 'services', 'works', 'process', 'contact'];
const THEMES = ['dark', 'light'];

function ThemeIcon({ theme }) {
  return theme === 'dark' ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6" />
    </svg>
  );
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    const saved = window.localStorage.getItem(key);
    if (saved) setValue(saved);
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue];
}

export default function Page() {
  const [lang, setLang] = useStoredState('metasho-lang', 'fa');
  const [theme, setTheme] = useStoredState('metasho-theme', 'dark');
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const t = useMemo(() => content[lang] ?? content.fa, [lang]);

  useEffect(() => {
    if (!LANGS.includes(lang)) setLang('fa');
  }, [lang, setLang]);

  useEffect(() => {
    if (!THEMES.includes(theme)) setTheme('dark');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme, setTheme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
  }, [lang, t.dir]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      setScrolled(y > 12);
      setShowTop(y > 520);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
  }, [lang, theme]);

  const backToTopLabel = lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top';

  return (
    <main className="shell" dir={t.dir}>
      <div className="backdrop-grid" />
      <div className="noise" />
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <div className="container">
        <header className={`nav glass ${scrolled ? 'scrolled' : ''}`}>
          <div className="nav-inner">
            <a href="#about" className="brand" aria-label="Metasho home">
              <span className="brand-mark">M</span>
              <span className="brand-text">
                <strong>Metasho</strong>
                <small>{t.hero.kicker}</small>
              </span>
            </a>

            <nav className="nav-links" aria-label="Main navigation">
              <a href="#about" className={activeSection === 'about' ? 'active' : ''}>{t.nav.about}</a>
              <a href="#services" className={activeSection === 'services' ? 'active' : ''}>{t.nav.services}</a>
              <a href="#works" className={activeSection === 'works' ? 'active' : ''}>{t.nav.works}</a>
              <a href="#process" className={activeSection === 'process' ? 'active' : ''}>{t.nav.process}</a>
              <a href="#contact" className={activeSection === 'contact' ? 'active' : ''}>{t.nav.contact}</a>
            </nav>

            <div className="nav-controls">
              <button
                type="button"
                className="theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
              >
                <ThemeIcon theme={theme} />
                <span>{theme === 'dark' ? (lang === 'fa' ? 'روشن' : lang === 'ar' ? 'فاتح' : 'Light') : (lang === 'fa' ? 'تاریک' : lang === 'ar' ? 'داكن' : 'Dark')}</span>
              </button>

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
          </div>
        </header>

        <section className="hero">
          <div className="hero-grid">
            <div className="hero-main glass" data-reveal="">
              <span className="eyebrow">{t.hero.kicker}</span>
              <h1>{t.hero.title}</h1>
              <p className="hero-copy">{t.hero.text}</p>
              <p className="hero-slogan">{t.hero.slogan}</p>
              <div className="hero-actions">
                <a className="btn primary" href="#works">{t.hero.primary}</a>
                <a className="btn" href="#contact">{t.hero.secondary}</a>
              </div>
            </div>

            <aside className="hero-side">
              <div className="hero-card glass" data-reveal="">
                <h3>{t.hero.noteTitle}</h3>
                <p>{t.hero.noteText}</p>
              </div>

              <div className="stat-grid">
                {t.stats.map((item) => (
                  <div key={item.label} className="stat glass" data-reveal="">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="about">
          <div className="intro-panel glass" data-reveal="">
            <div className="intro-text">
              <span className="section-tag">{lang === 'fa' ? 'مینیمال، تمیز، تاثیرگذار' : lang === 'ar' ? 'بسيط، نظيف، مؤثر' : 'Minimal, clean, impactful'}</span>
              <h2>{lang === 'fa' ? 'از ایده تا اجرا همراه شماییم با کادری مجرب و حرفه ای تا شمارا به درستی روایت کنیم' : lang === 'ar' ? 'من الفكرة إلى التنفيذ مع فريق محترف يروي قصتك بالشكل الصحيح' : 'From idea to execution, with an experienced team that tells your story the right way.'}</h2>
            </div>
            <div className="intro-points">
              <span>{lang === 'fa' ? 'سناریو و ایده‌پردازی' : lang === 'ar' ? 'السيناريو والفكرة' : 'Strategy & script'}</span>
              <span>{lang === 'fa' ? 'فیلم‌برداری و نورپردازی' : lang === 'ar' ? 'التصوير والإضاءة' : 'Filming & lighting'}</span>
              <span>{lang === 'fa' ? 'تدوین و موشن' : lang === 'ar' ? 'المونتاج والموشن' : 'Editing & motion'}</span>
              <span>{lang === 'fa' ? 'خروجی تبلیغاتی' : lang === 'ar' ? 'نسخ إعلانية' : 'Ad-ready delivery'}</span>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-title" data-reveal="">
            <div>
              <span className="section-tag">{t.services.kicker}</span>
              <h2>{t.services.title}</h2>
            </div>
            <p>{t.services.subtitle}</p>
          </div>

          <div className="card-grid three-up">
            {t.services.items.map((item, i) => (
              <article key={item.title} className="service-card glass" data-reveal="" style={{ transitionDelay: `${i * 80}ms` }}>
                <span className="card-index">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="works">
          <div className="section-title" data-reveal="">
            <div>
              <span className="section-tag">{t.projects.kicker}</span>
              <h2>{t.projects.title}</h2>
            </div>
            <p>{t.projects.subtitle}</p>
          </div>

          <div className="card-grid two-up">
            {t.projects.items.map((item, i) => (
              <article key={item.title} className="project-card glass" data-reveal="" style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul>
                  {item.points.map((point) => <li key={point}>{point}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="process">
          <div className="section-title" data-reveal="">
            <div>
              <span className="section-tag">{t.timeline.kicker}</span>
              <h2>{t.timeline.title}</h2>
            </div>
            <p>{t.timeline.subtitle}</p>
          </div>

          <div className="timeline">
            {t.timeline.items.map((item, i) => (
              <article key={item.time} className="timeline-item glass" data-reveal="" style={{ transitionDelay: `${i * 70}ms` }}>
                <span>{item.time}</span>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-title" data-reveal="">
            <div>
              <span className="section-tag">{t.contact.kicker}</span>
              <h2>{t.contact.title}</h2>
            </div>
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
              <a className="btn primary" href={`mailto:${t.contact.email}`}>{t.contact.email}</a>
              <a className="btn" href="#about">{lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top'}</a>
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
