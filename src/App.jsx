import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  FiArrowDownRight,
  FiArrowRight,
  FiArrowUpRight,
  FiBookOpen,
  FiCheck,
  FiCode,
  FiDownload,
  FiExternalLink,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMenu,
  FiMonitor,
  FiSend,
  FiShield,
  FiX,
} from "react-icons/fi";
import AnalyticsConsent from "./components/AnalyticsConsent.jsx";
import { getAnalyticsConsent, saveAnalyticsConsent, useAnalytics } from "./analytics.js";
import { portfolio } from "./data/portfolio.js";
import { downloadResume } from "./resume.js";

const navigation = [
  ["About", "about"],
  ["Education", "education"],
  ["Skills", "skills"],
  ["Projects", "projects"],
  ["Certifications", "certifications"],
  ["Resume", "resume"],
  ["Contact", "contact"],
];

function Reveal({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ index, eyebrow, title, description, id }) {
  return (
    <Reveal>
      <div className="section-heading">
        <p className="eyebrow"><span>{index}</span> / {eyebrow}</p>
        {title && <h2 id={`${id}-heading`}>{title}</h2>}
        {description && <p className="section-description">{description}</p>}
      </div>
    </Reveal>
  );
}

function EmptyState({ label }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon"><FiCode aria-hidden="true" /></span>
      <div>
        <h3>{label} not provided yet</h3>
        <p>This space is ready for verified details. Nothing has been added or assumed.</p>
      </div>
    </div>
  );
}

function AnalyticsPreferences({ consent, onConsent, hasAnalytics }) {
  return (
    <button
      className="privacy-control"
      type="button"
      onClick={() => onConsent(null)}
      aria-label={`Change analytics preference. Current setting: ${consent === "accepted" ? "allowed" : "not allowed"}`}
      title="Change analytics preference"
    >
      <FiShield aria-hidden="true" />
      {hasAnalytics ? `Analytics ${consent === "accepted" ? "on" : "off"}` : "Privacy"}
    </button>
  );
}

function ResumePreview() {
  return (
    <div className="resume-preview glass-card">
      <div className="resume-topline">
        <span className="resume-monogram">PD</span>
        <div>
          <p className="eyebrow">RESUME / 01</p>
          <span className="resume-format">ATS-FRIENDLY · PDF</span>
        </div>
        <span className="resume-status"><span /> LIVE PREVIEW</span>
      </div>
      <div className="resume-person">
        <h3>{portfolio.name}</h3>
        <p>{portfolio.title}</p>
        <div className="resume-contact-line">
          <span><FiMapPin aria-hidden="true" /> {portfolio.location}</span>
          <a href={`mailto:${portfolio.email}`}><FiMail aria-hidden="true" /> {portfolio.email}</a>
        </div>
      </div>
      <div className="resume-objective">
        <span className="eyebrow">CAREER OBJECTIVE</span>
        <p>{portfolio.objective}</p>
      </div>
      <div className="resume-preview-grid">
        {[
          ["Education", `${portfolio.education.length} records`],
          ["Technical skills", `${portfolio.skillGroups.reduce((total, group) => total + group.skills.length, 0)} skills`],
          ["Projects", portfolio.projects.length ? `${portfolio.projects.length} projects` : "Not provided"],
          ["Certifications", `${portfolio.certifications.length} certificates`],
          ["Achievements", portfolio.achievements.length ? `${portfolio.achievements.length} entries` : "Not provided"],
        ].map(([item, detail]) => (
          <div className="resume-mini-row" key={item}>
            <span>{item}</span>
            <span className={detail === "Not provided" ? "resume-not-provided" : "resume-provided"}>{detail}</span>
          </div>
        ))}
      </div>
      <p className="resume-note">
        Add project details in <code>src/data/portfolio.js</code> before using the resume for applications.
      </p>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [consent, setConsent] = useState(() => getAnalyticsConsent());
  const [formStatus, setFormStatus] = useState({ state: "idle", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const hasAnalytics = Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID);

  useAnalytics(consent);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsLoading(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setIsLoading(false), 620);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  useEffect(() => {
    const configuredSiteUrl = import.meta.env.VITE_SITE_URL;
    const siteUrl = new URL(configuredSiteUrl || window.location.origin).origin;
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = `${siteUrl}/`;
    document.head.appendChild(canonical);

    const socialImage = `${siteUrl}/og-image.svg`;
    document.querySelector('meta[property="og:url"]')?.remove();
    const ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    ogUrl.content = `${siteUrl}/`;
    document.head.appendChild(ogUrl);
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.content = socialImage;
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.content = socialImage;

    const verification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
    let verificationMeta;
    if (verification) {
      verificationMeta = document.createElement("meta");
      verificationMeta.name = "google-site-verification";
      verificationMeta.content = verification;
      document.head.appendChild(verificationMeta);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          name: portfolio.name,
          jobTitle: portfolio.title,
          email: `mailto:${portfolio.email}`,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Solapur",
            addressRegion: "Maharashtra",
            addressCountry: "IN",
          },
          url: `${siteUrl}/`,
          sameAs: [portfolio.linkedin],
        },
        {
          "@type": "WebSite",
          name: `${portfolio.name} — Portfolio`,
          url: `${siteUrl}/`,
          inLanguage: "en-IN",
        },
      ],
    };
    const jsonLd = document.createElement("script");
    jsonLd.type = "application/ld+json";
    jsonLd.id = "portfolio-structured-data";
    jsonLd.textContent = JSON.stringify(structuredData);
    document.head.appendChild(jsonLd);

    return () => {
      canonical.remove();
      ogUrl.remove();
      jsonLd.remove();
      verificationMeta?.remove();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    function handleEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  function updateConsent(nextConsent) {
    if (nextConsent === "accepted" || nextConsent === "rejected") {
      saveAnalyticsConsent(nextConsent);
    }
    setConsent(nextConsent);
  }

  async function submitContact(event) {
    event.preventDefault();
    setIsSending(true);
    setFormStatus({ state: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    try {
      const response = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Your message could not be sent. Please try again.");
      }

      setFormStatus({ state: "success", message: result.message });
      form.reset();
    } catch (error) {
      setFormStatus({
        state: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please email me directly.",
      });
    } finally {
      setIsSending(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="loading-screen"
            role="status"
            aria-label="Loading portfolio"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="loading-content">
              <span className="loading-monogram">P<span>.</span></span>
              <span className="loading-name">PRASAD DIGHE</span>
              <span className="loading-progress"><i /></span>
              <span className="loading-caption">A PORTFOLIO IN PROGRESS</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="Prasad Dighe, home">
            <img className="brand-logo" src="/logo.svg" alt="" aria-hidden="true" />
            <span className="brand-name">PRASAD <span>DIGHE</span></span>
          </a>
          <div className={`nav-links${menuOpen ? " is-open" : ""}`}>
            {navigation.map(([label, target]) => (
              <a href={`#${target}`} key={target} onClick={closeMenu}>{label}</a>
            ))}
            <a className="nav-contact" href="#contact" onClick={closeMenu}>
              Let’s talk <FiArrowUpRight aria-hidden="true" />
            </a>
          </div>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero-section section-wrap" id="home" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <Reveal>
              <div className="availability-label"><span /> PERSONAL PORTFOLIO <span className="label-divider">/</span> 2026</div>
              <h1 id="hero-heading">
                Thoughtful by <span className="serif-word">nature.</span>
                <br />Curious by <span className="accent-word">design.</span>
              </h1>
              <p className="hero-description">
                I’m <strong>{portfolio.name}</strong> — {portfolio.title.toLowerCase()}, based in Solapur, India.
              </p>
              <div className="hero-actions">
                <a className="button button-accent" href="#projects">
                  Explore my portfolio <FiArrowRight aria-hidden="true" />
                </a>
                <a className="button button-outline" href="#contact">
                  Get in touch <FiArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal className="hero-art-wrap" delay={0.12}>
            <div className="hero-art">
              <div className="art-orbit orbit-outer" />
              <div className="art-orbit orbit-inner" />
              <span className="art-coordinate coordinate-one">CS / STUDENT</span>
              <span className="art-coordinate coordinate-two">SOFTWARE / ASPIRANT</span>
              <div className="art-core">
                <img
                  className="hero-portrait"
                  src={portfolio.profileImage}
                  alt={`Portrait of ${portfolio.name}`}
                  width="1254"
                  height="1254"
                  fetchPriority="high"
                />
                <i />
              </div>
              <span className="art-spark spark-one" />
              <span className="art-spark spark-two" />
              <span className="art-index">SOLAPUR&nbsp; / &nbsp;INDIA</span>
              <span className="art-caption">A mind in motion.</span>
            </div>
          </Reveal>

          <div className="hero-footer">
            <p><FiMapPin aria-hidden="true" /> {portfolio.location}</p>
            <a href="#about">SCROLL TO DISCOVER <FiArrowDownRight aria-hidden="true" /></a>
            <span>01 — 08</span>
          </div>
        </section>

        <section className="section-wrap content-section about-section" id="about" aria-labelledby="about-heading">
          <SectionHeading index="01" eyebrow="A LITTLE ABOUT ME" title="The person behind the pixels." id="about" />
          <div className="about-grid">
            <Reveal className="about-intro">
              <p>{portfolio.about}</p>
              <a className="text-link" href={`mailto:${portfolio.email}`}>
                Say hello <FiArrowUpRight aria-hidden="true" />
              </a>
            </Reveal>
            <Reveal className="about-facts glass-card" delay={0.08}>
              <div className="fact-row">
                <span className="fact-icon"><FiBookOpen aria-hidden="true" /></span>
                <div><span className="eyebrow">CURRENTLY</span><p>Studying computer science</p></div>
                <span className="fact-number">01</span>
              </div>
              <div className="fact-row">
                <span className="fact-icon"><FiMonitor aria-hidden="true" /></span>
                <div><span className="eyebrow">ASPIRATION</span><p>Software development</p></div>
                <span className="fact-number">02</span>
              </div>
              <div className="fact-row">
                <span className="fact-icon"><FiMapPin aria-hidden="true" /></span>
                <div><span className="eyebrow">BASED IN</span><p>Solapur, Maharashtra</p></div>
                <span className="fact-number">03</span>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="section-wrap content-section" id="education" aria-labelledby="education-heading">
          <SectionHeading
            index="02"
            eyebrow="THE FOUNDATION"
            title="Education."
            description="My academic journey in computer science and science."
            id="education"
          />
          {portfolio.education.length ? (
            <div className="record-list">
              {portfolio.education.map((item, index) => (
                <Reveal key={`${item.institution}-${index}`}>
                  <article className="record-card glass-card">
                    <span className="record-index">0{index + 1}</span>
                    <div>
                      <h3>{item.degree}</h3>
                      <p>{item.institution}</p>
                      {item.details && <p>{item.details}</p>}
                    </div>
                    <div className="education-meta">
                      {item.year && <span className="record-date">{item.year}</span>}
                      {item.status && <span className="education-status">{item.status}</span>}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : <Reveal><EmptyState label="Education details" /></Reveal>}
        </section>

        <section className="section-wrap content-section" id="skills" aria-labelledby="skills-heading">
          <SectionHeading
            index="03"
            eyebrow="TOOLS & TECHNOLOGY"
            title="What I bring to the table."
            description="Technical skills I’m building, alongside the habits and mindset I bring to learning and problem-solving."
            id="skills"
          />
          <div className="skills-subheading">
            <p className="eyebrow"><span>01</span> / TECHNICAL SKILLS</p>
            <p>Grouped by area, with my current self-assessed level.</p>
          </div>
          <div className="skill-groups">
            {portfolio.skillGroups.map((group, groupIndex) => (
              <Reveal key={group.category} delay={groupIndex * 0.05}>
                <article className="skill-group glass-card">
                  <div className="skill-group-heading">
                    <span className="record-index">0{groupIndex + 1}</span>
                    <h3>{group.category}</h3>
                  </div>
                  <div className="skill-items">
                    {group.skills.map((skill) => (
                      <div className="skill-item" key={skill.name}>
                        <span>{skill.name}</span>
                        <span
                          className={`skill-level${skill.level === "Intermediate" ? " is-intermediate" : ""}`}
                          aria-label={`Level: ${skill.level}`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="soft-skills-panel">
            <div className="skills-subheading soft-skills-heading">
              <p className="eyebrow"><span>02</span> / HOW I WORK</p>
              <h3>Soft skills</h3>
            </div>
            <div className="soft-skills-grid">
              {portfolio.softSkills.map((skill, index) => (
                <article className="soft-skill-card" key={skill.name}>
                  <span className="soft-skill-index">0{index + 1}</span>
                  <h4>{skill.name}</h4>
                  <p>{skill.description}</p>
                  <p className="soft-skill-example"><span>IN PRACTICE</span>{skill.example}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="section-wrap content-section" id="projects" aria-labelledby="projects-heading">
          <SectionHeading
            index="04"
            eyebrow="SELECTED WORK"
            title="Projects, with purpose."
            description="A growing collection of things made with curiosity."
            id="projects"
          />
          {portfolio.projects.length ? (
            <div className="project-grid grid grid-cols-1 gap-4 md:grid-cols-2">
              {portfolio.projects.map((project, index) => (
                <Reveal key={project.name} delay={index * 0.06}>
                  <article className="project-card glass-card">
                    <span className="project-index">PROJECT / 0{index + 1}</span>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="project-tags">
                        {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                      </div>
                    )}
                    <div className="project-links">
                      {project.github && <a href={project.github} target="_blank" rel="noreferrer"><FiGithub aria-hidden="true" /> Source <FiExternalLink aria-hidden="true" /></a>}
                      {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <FiExternalLink aria-hidden="true" /></a>}
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          ) : <Reveal><EmptyState label="Project details" /></Reveal>}
        </section>

        <section className="section-wrap content-section compact-section" id="certifications" aria-labelledby="certifications-heading">
          <SectionHeading
            index="05"
            eyebrow="MILESTONES"
            title="Certifications & achievements."
            description="Credentials and accomplishments will appear here once verified details are available."
            id="certifications"
          />
          {portfolio.certifications.length || portfolio.achievements.length ? (
            <div className="milestones-list">
              {portfolio.certifications.map((item, index) => (
                <Reveal key={`${item.name}-${index}`} delay={index * 0.06}>
                  <article className={`certificate-card glass-card${item.image ? " has-image" : ""}`}>
                    {item.image && (
                      <a
                        className="certificate-image-link"
                        href={item.image}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open certificate image: ${item.name}`}
                      >
                        <img
                          className="certificate-image"
                          src={item.image}
                          alt={`${item.name}${item.issuer ? `, issued by ${item.issuer}` : ""}`}
                          loading="lazy"
                        />
                        <span className="certificate-image-hint">VIEW CERTIFICATE ↗</span>
                      </a>
                    )}
                    <div className="certificate-info">
                      <span className="record-index">CERT / {String(index + 1).padStart(2, "0")}</span>
                      <h3>{item.name}</h3>
                      {item.issuer && <p>{item.issuer}</p>}
                      {item.year && <span className="record-date">{item.year}</span>}
                      {item.credentialUrl && (
                        <a className="credential-link" href={item.credentialUrl} target="_blank" rel="noreferrer">
                          Verify credential <FiExternalLink aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </article>
                </Reveal>
              ))}
              {portfolio.achievements.map((item, index) => (
                <Reveal key={item.name || item}>
                  <article className="record-card glass-card">
                    <span className="record-index">ACH / {String(index + 1).padStart(2, "0")}</span>
                    <div><h3>{item.name || item}</h3>{item.issuer && <p>{item.issuer}</p>}</div>
                    {item.year && <span className="record-date">{item.year}</span>}
                  </article>
                </Reveal>
              ))}
            </div>
          ) : <Reveal><EmptyState label="Certifications and achievements" /></Reveal>}
        </section>

        <section className="section-wrap content-section resume-section" id="resume" aria-label="Resume">
          <SectionHeading
            index="06"
            eyebrow="ONE PAGE, THE ESSENTIALS"
            title="A clear picture."
            description="A clean, ATS-friendly resume that stays honest about what has—and hasn’t—been provided."
            id="resume"
          />
          <div className="resume-layout">
            <Reveal><ResumePreview /></Reveal>
            <Reveal className="resume-aside" delay={0.1}>
              <span className="resume-aside-mark">PDF<span>.</span></span>
              <h3>Ready when you are.</h3>
              <p>Download a text-based PDF resume. Add your verified education, skills, projects, and credentials in the portfolio data file to complete it.</p>
              <button className="button button-accent" type="button" onClick={downloadResume}>
                Download resume <FiDownload aria-hidden="true" />
              </button>
              <span className="resume-file-note">PDF DOCUMENT · A4 · ATS-FRIENDLY</span>
            </Reveal>
          </div>
        </section>

        <section className="section-wrap content-section contact-section" id="contact" aria-labelledby="contact-heading">
          <SectionHeading
            index="07"
            eyebrow="LET’S CONNECT"
            title="Good things start with hello."
            description="Have a question or want to get in touch? Send a note and it’ll land in my inbox."
            id="contact"
          />
          <div className="contact-grid">
            <Reveal className="contact-details">
              <p>For opportunities, questions, or a simple introduction, email is the best way to reach me.</p>
              <a className="contact-email" href={`mailto:${portfolio.email}`}>
                {portfolio.email}<FiArrowUpRight aria-hidden="true" />
              </a>
              <a
                className="contact-social-link"
                href={portfolio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiLinkedin aria-hidden="true" />
                Connect on LinkedIn
                <FiArrowUpRight aria-hidden="true" />
              </a>
              <div className="contact-detail"><FiMapPin aria-hidden="true" /> {portfolio.location}</div>
              <p className="privacy-note"><FiShield aria-hidden="true" /> Your details are used only to respond to your message.</p>
            </Reveal>
            <Reveal className="contact-form-card glass-card" delay={0.08}>
              <form onSubmit={submitContact} className="contact-form">
                <div className="honeypot" aria-hidden="true">
                  <label htmlFor="website">Leave this field empty</label>
                  <input id="website" type="text" name="website" tabIndex="-1" autoComplete="off" />
                </div>
                <div className="form-row">
                  <label>
                    Your name
                    <input type="text" name="name" autoComplete="name" placeholder="Jane Smith" required maxLength={100} />
                  </label>
                  <label>
                    Email address
                    <input type="email" name="email" autoComplete="email" placeholder="jane@example.com" required maxLength={254} />
                  </label>
                </div>
                <label>
                  Subject
                  <input type="text" name="subject" placeholder="What would you like to talk about?" required maxLength={150} />
                </label>
                <label>
                  Message
                  <textarea name="message" rows={5} placeholder="Write your message here…" required maxLength={5000} />
                </label>
                {formStatus.message && (
                  <p className={`form-message ${formStatus.state}`} role="status">
                    {formStatus.state === "success" && <FiCheck aria-hidden="true" />}
                    {formStatus.message}
                  </p>
                )}
                <button className="button button-accent form-submit" type="submit" disabled={isSending}>
                  {isSending ? "Sending…" : "Send message"}
                  <FiSend aria-hidden="true" />
                </button>
                <p className="form-disclaimer">No tracking pixels. Your message is sent securely and only used to reply.</p>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="brand" href="#home" aria-label="Prasad Dighe, back to top">
            <img className="brand-logo" src="/logo.svg" alt="" aria-hidden="true" />
            <span className="brand-name">PRASAD <span>DIGHE</span></span>
          </a>
          <p>Made with intention, in Solapur.</p>
          <div className="footer-links">
            <a href={`mailto:${portfolio.email}`} aria-label="Email Prasad"><FiMail aria-hidden="true" /></a>
            <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Prasad on LinkedIn"><FiLinkedin aria-hidden="true" /></a>
            <a href="#home" aria-label="Back to top"><FiArrowUpRight aria-hidden="true" /></a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {portfolio.name}</span>
          <span>BUILT WITH CURIOSITY <span className="footer-dot">●</span></span>
          <AnalyticsPreferences consent={consent} onConsent={updateConsent} hasAnalytics={hasAnalytics} />
        </div>
      </footer>

      <AnalyticsConsent consent={consent} onConsent={updateConsent} hasAnalytics={hasAnalytics} />
      <AnimatePresence>
        {menuOpen && <motion.button className="menu-backdrop" aria-label="Close navigation" onClick={closeMenu} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />}
      </AnimatePresence>
    </>
  );
}

export default App;
