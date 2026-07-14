'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { content } from '../lib/content';

function SectionCard({ children, delay = 0, className = '' }) {
  return (
    <div className={`card ${className}`} data-reveal="" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Page() {
  const t = useMemo(() => content.fa, []);
  const [showTop, setShowTop] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = doc.scrollTop || document.body.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      const pct = height > 0 ? (scrollTop / height) * 100 : 0;
      if (scrollRef.current) {
        scrollRef.current.style.setProperty('--scroll', `${pct}%`);
      }
      setShowTop(scrollTop > 420);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
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
      { threshold: 0.16 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="page">
      <div className="scroll-progress" ref={scrollRef} />
      <div className="grain" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">V</div>
          <div>
            <strong>Video Studio</strong>
            <span>مینیمال / تبلیغاتی / حرفه‌ای</span>
          </div>
        </div>

        <nav className="nav">
          <a href="#home">{t.nav.home}</a>
          <a href="#services">{t.nav.services}</a>
          <a href="#process">{t.nav.process}</a>
          <a href="#works">{t.nav.works}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy" data-reveal="">
          <p className="eyebrow">{t.hero.kicker}</p>
          <h1>{t.hero.title}</h1>
          <p className="lead">{t.hero.text}</p>

          <div className="actions">
            <a className="btn btn-dark" href="#works">
              {t.hero.primary}
            </a>
            <a className="btn btn-light" href="#contact">
              {t.hero.secondary}
            </a>
          </div>

          <div className="chips">
            {t.hero.chips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-panel" data-reveal="">
          <SectionCard className="panel-panel">
            <p className="panel-label">متن‌های خفن، اما دقیق</p>
            <h2>ویدیویی که فقط دیده نشود؛ حس شود.</h2>
            <p>
              هر پلان، هر کلمه و هر ثانیه باید به یک هدف ختم شود: توجه بیشتر، اعتماد بیشتر و
              فروش بهتر.
            </p>
          </SectionCard>

          <div className="stats">
            {t.stats.map((item) => (
              <SectionCard key={item.label} className="stat">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </SectionCard>
            ))}
          </div>
        </aside>
      </section>

      <section className="section" id="services">
        <div className="section-head" data-reveal="">
          <p className="eyebrow">خدمات</p>
          <h2>{t.services.title}</h2>
          <p>{t.services.subtitle}</p>
        </div>

        <div className="grid grid-2">
          {t.services.items.map((item, index) => (
            <SectionCard key={item.title} delay={index * 70}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="section" id="process">
        <div className="section-head" data-reveal="">
          <p className="eyebrow">فرآیند</p>
          <h2>{t.process.title}</h2>
          <p>{t.process.subtitle}</p>
        </div>

        <div className="timeline">
          {t.process.items.map((item, index) => (
            <SectionCard key={item.step} delay={index * 70} className="timeline-item">
              <span className="step">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="section" id="works">
        <div className="section-head" data-reveal="">
          <p className="eyebrow">نمونه‌کار</p>
          <h2>{t.works.title}</h2>
          <p>{t.works.subtitle}</p>
        </div>

        <div className="grid grid-3">
          {t.works.items.map((item, index) => (
            <SectionCard key={item.title} delay={index * 80}>
              <span className="tag">{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="section" id="contact">
        <div className="cta" data-reveal="">
          <div>
            <p className="eyebrow">تماس</p>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.text}</p>
          </div>

          <div className="contact-grid">
            <div>
              <span>Email</span>
              <strong>{t.cta.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{t.cta.phone}</strong>
            </div>
            <div>
              <span>Location</span>
              <strong>{t.cta.location}</strong>
            </div>
          </div>

          <div className="actions">
            <a className="btn btn-dark" href={`mailto:${t.cta.email}`}>
              {t.cta.primary}
            </a>
            <a className="btn btn-light" href="#services">
              {t.cta.secondary}
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">{t.footer}</footer>

      <button
        type="button"
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="بازگشت به بالا"
        title="بازگشت به بالا"
      >
        ↑
      </button>
    </main>
  );
}
