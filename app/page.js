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

  useEffect(() => {
    window.localStorage.setItem('metasho-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = content[lang].dir;
  }, [lang]);

  const t = useMemo(() => content[lang], [lang]);

  return (
    <main className="shell" dir={t.dir}>
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
              {LANGS.map((code) => (
                <button key={code} className={lang === code ? 'active' : ''} onClick={() => setLang(code)}>
                  {content[code].localeName}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-grid">
            <div className="hero-main glass">
              <div className="kicker"><span className="kicker-dot" />{t.hero.kicker}</div>
              <h2>{t.hero.title}</h2>
              <p>{t.hero.text}</p>
              <div className="hero-actions">
                <a className="btn primary" href="#works">{t.hero.primary}</a>
                <a className="btn" href="#contact">{t.hero.secondary}</a>
              </div>
            </div>
            <div className="hero-side">
              <div className="info-card glass">
                <h3>{t.hero.noteTitle}</h3>
                <p>{t.hero.noteText}</p>
                <div className="badges">
                  {t.hero.badges.map((badge) => <span key={badge} className="badge">{badge}</span>)}
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

        <section className="section" id="about">
          <div className="section-title">
            <h3>{t.about.title}</h3>
            <p>{t.about.text}</p>
          </div>
          <div className="grid-3">
            {[
              { title: 'Premium Presence', text: 'A cinematic, polished visual system with luxury gradients and strong hierarchy.' },
              { title: 'Multilingual by Design', text: 'Persian, English, and Arabic content paths with correct direction handling.' },
              { title: 'Built to Scale', text: 'A clean codebase that can expand into pages, forms, CMS content, and campaigns.' },
            ].map((item) => (
              <div key={item.title} className="tile glass">
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
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
                  {item.points.map((point) => <li key={point}>{point}</li>)}
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
              <a className="btn primary" href={`mailto:${t.contact.email}`}>hello@metasho.com</a>
              <a className="btn" href="#about">{lang === 'fa' ? 'بازگشت به بالا' : lang === 'ar' ? 'العودة للأعلى' : 'Back to top'}</a>
            </div>
          </div>
        </section>

        <footer className="footer">{t.footer}</footer>
      </div>
    </main>
  );
}
