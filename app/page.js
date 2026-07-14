'use client';

import { useEffect, useMemo, useState } from 'react';
import { content } from '../lib/content';

const LANGS = ['fa', 'en', 'ar'];

export default function Page() {
  const [lang, setLang] = useState('fa');

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

  return (
    <main className="shell" dir={t.dir} style={accentStyle}>
      <div className="aurora aurora-a" />
      <div className="aurora aurora-b" />
      <div className="backdrop-grid" />
      <div className="container">
        <header className="nav glass">
          <div className="nav-inner">
            <div className="brand">
              <div className="brand-mark">M</div>
              <div>
                <h1>Metasho</h1>
                <p>{t.hero.kicker}</p>
              </div>
            </div>

            <nav className="nav-links" aria-label="Main navigation">
              <a href="#about">{t.nav.about}</a>
              <a href="#services">{t.nav.services}</a>
              <a href="#works">{t.nav.works}</a>
              <a href="#timeline">{t.nav.timeline}</a>
              <a href="#contact">{t.nav.contact}</a>
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
                <a className="btn primary" href="#works">
                  {t.hero.primary}
                </a>
                <a className="btn" href="#contact">
                  {t.hero.secondary}
                </a>
              </div>
            </div>

            <div className="hero-side">
              <div className="info-card glass">
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
                  <div key={item.label} className="tile glass stat">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section language-panel glass">
          <div className="section-title language-title">
            <div>
              <h3>{lang === 'fa' ? 'تفکیک زبانی' : lang === 'ar' ? 'الفصل اللغوي' : 'Language separation'}</h3>
              <p>{lang === 'fa' ? 'هر زبان شخصیت بصری خودش را دارد و در UI فقط ترجمه نشده، بلکه هویت گرفته است.' : lang === 'ar' ? 'لكل لغة شخصية بصرية خاصة بها بدل أن تكون مجرد ترجمة.' : 'Each language has its own visual identity, not just its own text.'}</p>
            </div>
            <div className="language-tag">{t.localeName}</div>
          </div>
          <div className="highlight-grid">
            {t.highlights.map((item) => (
              <article key={item.title} className="highlight-card">
                <span className="highlight-badge" />
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="about">
          <div className="section-title">
            <h3>{t.about.title}</h3>
            <p>{t.about.text}</p>
          </div>
        </section>

        <section className="section" id="services">
          <div className="section-title">
            <h3>{t.services.title}</h3>
            <p>{t.services.subtitle}</p>
          </div>
          <div className="grid-3">
            {t.services.items.map((item) => (
              <div key={item.title} className="tile glass">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="works">
          <div className="section-title">
            <h3>{t.projects.title}</h3>
            <p>{t.projects.subtitle}</p>
          </div>
          <div className="projects">
            {t.projects.items.map((item) => (
              <article key={item.title} className="project glass">
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
          <div className="section-title">
            <h3>{t.timeline.title}</h3>
            <p>{t.timeline.subtitle}</p>
          </div>
          <div className="timeline">
            {t.timeline.items.map((item) => (
              <div key={item.time} className="timeline-item glass">
                <time>{item.time}</time>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section" id="contact">
          <div className="section-title">
            <h3>{t.contact.title}</h3>
            <p>{t.contact.subtitle}</p>
          </div>
          <div className="contact-box glass">
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
              <a className="btn primary" href={`mailto:${t.contact.email}`}>
                {t.contact.email}
              </a>
              <a className="btn" href="#about">
                {lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top'}
              </a>
            </div>
          </div>
        </section>

        <footer className="footer">{t.footer}</footer>
      </div>
    </main>
  );
}
