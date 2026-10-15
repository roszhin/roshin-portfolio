import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { projects, type Project } from '../data/projects';
import { site } from '../data/site';

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProjectPreview({ project, large = false }: { project: Project; large?: boolean }) {
  const bars = [34, 59, 45, 76, 52, 88, 66];
  return (
    <div className={`project-preview ${large ? 'project-preview-large' : ''}`} style={{ '--preview-tint': project.cover ?? '#252624' } as CSSProperties} aria-hidden="true">
      <div className="preview-window-bar"><span className="preview-lights"><i /><i /><i /></span><span>{project.title}</span><span className="preview-window-mark">SOURCE-INSPIRED PREVIEW</span></div>
      <div className="preview-layout">
        <aside className="preview-sidebar"><span className="preview-brand">{project.title.split(' ').map((part) => part[0]).join('').slice(0, 3)}</span><i /><i /><i /><i /><i /></aside>
        <div className="preview-content">
          <div className="preview-heading"><div><small>{project.category}</small><strong>{project.title}</strong></div><span className="preview-avatar">RS</span></div>
          <div className="preview-metrics">{project.features.slice(0, 3).map((feature, index) => <div key={feature}><small>{['OVERVIEW', 'ACTIVITY', 'RECORDS'][index]}</small><b>{feature}</b></div>)}</div>
          <div className="preview-lower"><div className="preview-chart"><small>PROJECT ACTIVITY</small><div>{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div><div className="preview-list"><small>FEATURES</small>{project.features.slice(0, 3).map((feature) => <span key={feature}><i />{feature}</span>)}</div></div>
          <div className="preview-footnote">Illustrative interface · based on archived project files</div>
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ project, index, total, previousTitle, nextTitle, onNavigate, onClose }: { project: Project; index: number; total: number; previousTitle: string; nextTitle: string; onNavigate: (step: -1 | 1) => void; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const activeBeforeOpen = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();
    return () => activeBeforeOpen?.focus();
  }, []);

  return (
      <motion.div className="detail-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.article className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="project-detail-title" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} onClick={(event) => event.stopPropagation()} onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const focusable = event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}>
        <div className="detail-toolbar">
          <p className="detail-count" aria-live="polite">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <div className="detail-navigation" aria-label="Browse projects">
            <button onClick={() => onNavigate(-1)} aria-label={`Previous project: ${previousTitle}`}>← <span>Previous</span></button>
            <button onClick={() => onNavigate(1)} aria-label={`Next project: ${nextTitle}`}><span>Next</span> →</button>
          </div>
          <button ref={closeButton} className="detail-close" onClick={onClose} aria-label="Close project details">Close <span aria-hidden="true">×</span></button>
        </div>
        <p className="small-label">{project.category}</p>
        <h2 id="project-detail-title">{project.title}</h2>
        <p className="detail-lede">{project.summary}</p>
        {project.image ? <figure className="detail-screenshot"><img src={project.image} alt={`${project.title} running locally`} /><figcaption>Screenshot captured from the supplied project running locally. Any visible contact details or personal identifiers have been hidden.</figcaption></figure> : <><ProjectPreview project={project} large /><p className="preview-disclaimer">Illustrative interface preview based on the archive’s documented features.</p></>}
        {project.demo && <section className="detail-demo-access" aria-labelledby="demo-access-title">
          <div className="detail-demo-heading">
            <div><p className="small-label">Live project</p><h3 id="demo-access-title">Try it yourself</h3></div>
            <a className="detail-demo-link" href={project.demo} target="_blank" rel="noreferrer">Open live project <span aria-hidden="true">↗</span></a>
          </div>
          {project.demoAccounts && <div className="detail-demo-accounts">
            <h4>Demo login accounts</h4>
            <ul>{project.demoAccounts.map((account) => <li className="detail-demo-account" key={account.username}>
              <strong className="detail-demo-role">{account.role}</strong>
              <dl>
                <div><dt>Email / Username</dt><dd><code>{account.username}</code></dd></div>
                <div><dt>Password</dt><dd><code>{account.password}</code></dd></div>
              </dl>
            </li>)}</ul>
          </div>}
        </section>}
        <div className="detail-grid">
          <section><h3>The problem</h3><p>{project.problem}</p></section>
          <section><h3>The approach</h3><p>{project.solution}</p></section>
          <section><h3>What it does</h3><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
          <section><h3>Implementation</h3><p>{project.architecture}</p></section>
        </div>
        <p className="detail-stack">{project.stack.join(' · ')}</p>
        {project.source && <div className="detail-links"><a href={project.source} target="_blank" rel="noreferrer">Source code ↗</a></div>}
      </motion.article>
    </motion.div>
  );
}

export default function App() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : projects[selectedIndex];

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    gsap.fromTo('.hero-copy > *', { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out', delay: 0.12 });
    gsap.fromTo('.hero-portrait', { clipPath: 'inset(8% 0 0 0)', y: 40 }, { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 1.1, ease: 'power3.out' });
    gsap.utils.toArray<HTMLElement>('.project-card').forEach((card, index) => {
      gsap.fromTo(card, { y: 72, scale: 0.97 }, { y: 0, scale: 1, duration: 0.85, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse', invalidateOnRefresh: true }, delay: (index % 2) * 0.08 });
    });
    gsap.utils.toArray<HTMLElement>('.reveal').forEach((item) => gsap.fromTo(item, { y: 34 }, { y: 0, duration: 0.8, ease: 'power3.out', immediateRender: false, scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none reverse', invalidateOnRefresh: true } }));
    ScrollTrigger.refresh();
  }, { scope: root });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSelectedIndex(null); setMenuOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="site-shell" ref={root}>
      <a className="skip-link" href="#work">Skip to work</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Roshin R S home">R<span className="wordmark-dot">.</span>RS</a>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#skills">Skills</a><a href="#contact">Contact</a></nav>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? 'Close' : 'Menu'}<span aria-hidden="true">{menuOpen ? '−' : '+'}</span></button>
      </header>
      <AnimatePresence>
        {menuOpen && <motion.nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }}>
          {[['Work', '#work'], ['About', '#about'], ['Skills', '#skills'], ['Contact', '#contact']].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}<span aria-hidden="true">↗</span></a>)}
        </motion.nav>}
      </AnimatePresence>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span className="signal-dot" /> {site.role} · MCA candidate</p>
            <h1 id="hero-title">Curious about how things work.<br /><em>Focused on building things that work.</em></h1>
            <p className="hero-intro">I’m {site.name}, an MCA student working across application development, data, and the details that make software useful.</p>
            <a className="hero-link" href="#work">Explore selected work <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-portrait-wrap">
            <div className="portrait-index" aria-hidden="true"><span>RSH / 01</span><span>Portrait</span></div>
            <img className="hero-portrait" src={`${import.meta.env.BASE_URL}images/profile-professional.png`} alt="Roshin R S wearing a dark blazer and white shirt" />
            <div className="portrait-caption"><span>ROSHIN R S</span><span>SOFTWARE DEVELOPER</span></div>
          </div>
          <div className="hero-bottom"><span>Academic & personal projects</span><span>Scroll to explore <b aria-hidden="true">↓</b></span><span>Open to opportunities</span></div>
        </section>

        <section className="archive-stage" id="work" aria-labelledby="work-title">
          <div className="archive-panel">
            <div className="archive-heading reveal"><div><p className="small-label">{projects.length} source archives</p><h2 id="work-title">Work that<br /><em>solves something.</em></h2></div><p className="archive-note">Open any project for its screenshots, features, and implementation notes. Move between projects from the detail view.</p></div>
            <div className="project-grid">
              {projects.map((project, index) => <article className="project-card" key={project.slug}>
                <button className="project-open" onClick={() => setSelectedIndex(index)} aria-label={`Open details for ${project.title}`}>
                  <div className="project-image"><div className="project-index">{String(projects.indexOf(project) + 1).padStart(2, '0')}</div>{project.image ? <img src={project.image} alt={`${project.title} application screenshot`} loading="lazy" /> : <ProjectPreview project={project} />}<span className="project-arrow" aria-hidden="true">↗</span></div>
                  <div className="project-meta"><div><h3>{project.title}</h3><p>{project.summary}</p></div><div className="tag-list">{project.stack.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div>
                </button>
              </article>)}
            </div>
            <div className="archive-end"><span>{projects.length} source archives</span><span>Built with intent, refined with use.</span></div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-statement reveal"><p className="small-label">A little about me</p><h2 id="about-title">Curiosity is useful.<br /><em>Follow it into the details.</em></h2></div>
          <div className="about-copy reveal"><p>I like understanding how a problem behaves before deciding how to build around it. My projects have taken me through application workflows, databases, analytics, and practical interfaces.</p><p>I’m currently completing an MCA after a BCA, and I’m looking for opportunities to keep learning alongside people who care about building reliable software.</p><a className="text-link" href="#contact">Start a conversation <span aria-hidden="true">↗</span></a></div>
          <div className="about-rule" aria-hidden="true" />
        </section>

        <section className="skills-section" id="skills" aria-labelledby="skills-title">
          <div className="skills-heading reveal"><p className="small-label">Tools and areas explored</p><h2 id="skills-title">Skills grow<br />through <em>practice.</em></h2></div>
          <div className="skill-groups reveal">
            {site.skills.map((group) => <div className="skill-group" key={group.title}><h3>{group.title}</h3><p>{group.source}</p><ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul></div>)}
          </div>
        </section>

        <section className="education-section" aria-labelledby="education-title">
          <div className="education-heading reveal"><p className="small-label">Education</p><h2 id="education-title">Learning<br /><em>in progress.</em></h2></div>
          <div className="education-list reveal">{site.education.map((item) => <article className="education-item" key={item.degree}><span className="education-status">{item.status}</span><div><h3>{item.degree}</h3><p>{item.institution}</p></div><span className="education-arrow" aria-hidden="true">↗</span></article>)}</div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-title">
          <p className="small-label reveal">Contact</p><h2 className="reveal" id="contact-title">Have something<br /><em>interesting to build?</em></h2>
          <p className="contact-copy reveal">I’m open to conversations about software roles, collaboration, and useful problems to solve.</p>
          {site.contactEmail ? <a className="contact-cta reveal" href={`mailto:${site.contactEmail}`}>Get in touch <span aria-hidden="true">↗</span></a> : <p className="contact-pending reveal">Email address can be added in <code>src/data/site.ts</code>.</p>}
          <footer className="site-footer"><a className="wordmark wordmark-footer" href="#top">R<span className="wordmark-dot">.</span>RS</a><span>© {new Date().getFullYear()} Roshin R S</span><div>{site.github && <a href={site.github} target="_blank" rel="noreferrer">GitHub ↗</a>}{site.linkedin && <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>}<a href="#top">Back to top ↑</a></div></footer>
        </section>
      </main>
      <AnimatePresence>{selected && selectedIndex !== null && <ProjectDetail project={selected} index={selectedIndex} total={projects.length} previousTitle={projects[(selectedIndex + projects.length - 1) % projects.length].title} nextTitle={projects[(selectedIndex + 1) % projects.length].title} onNavigate={(step) => setSelectedIndex((selectedIndex + step + projects.length) % projects.length)} onClose={() => setSelectedIndex(null)} />}</AnimatePresence>
    </div>
  );
}
