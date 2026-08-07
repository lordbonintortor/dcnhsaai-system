import Link from "next/link";
import Image from "next/image";

const Arrow = () => <span aria-hidden="true">↗</span>;

const programs = [
  {
    number: "01",
    title: "Board of Trustees",
    text: "Meet the officers entrusted with guiding the association and serving its alumni community.",
    href: "/board-of-trustees",
  },
  {
    number: "02",
    title: "Management Reports",
    text: "Access official association updates, accomplishments, and approved organizational reports.",
    href: "/management-reports",
  },
  {
    number: "03",
    title: "Projects and Benefactors",
    text: "Discover meaningful initiatives and recognize the partners who help make them possible.",
    href: "/projects-and-benefactors",
  },
  {
    number: "04",
    title: "Association Activities",
    text: "Follow general assemblies, seminars, charitable works, and fund-raising activities.",
    href: "/association-activities",
  },
  {
    number: "05",
    title: "Alumni Activities",
    text: "Stay informed about annual homecomings, batch reunions, and alumni-led gatherings.",
    href: "/alumni-activities",
  },
  {
    number: "06",
    title: "Outstanding Student and Alumni Awardees",
    text: "Celebrate students and alumni whose achievements bring honor to the City High community.",
    href: "/outstanding-student-and-alumni-awardees",
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <Link className="brand" href="#top" aria-label="DCNHS Alumni home">
          <Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={52} height={52} priority />
          <span>
            <strong>DCNHS Alumni</strong>
            <small>Association, Inc.</small>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#about">About Us</a>
          <details className="nav-menu">
            <summary>Association <span>⌄</span></summary>
            <div className="nav-dropdown">
              <Link href="/board-of-trustees">Board of Trustees</Link>
              <Link href="/management-reports">Management Reports</Link>
              <Link href="/projects-and-benefactors">Projects and Benefactors</Link>
              <Link href="/association-activities">Association Activities</Link>
              <Link href="/alumni-activities">Alumni Activities</Link>
              <Link href="/outstanding-student-and-alumni-awardees">Outstanding Student and Alumni Awardees</Link>
            </div>
          </details>
          <a href="#updates">News</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <Link className="text-link" href="/login">Sign in</Link>
          <Link className="button button-small" href="/register">Join the registry</Link>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Davao City National High School</p>
          <h1>Our roots run deep.<br/><em>Our story continues.</em></h1>
          <p className="hero-lead">
            A home for generations of City High alumni—built to reconnect,
            celebrate, and create opportunities for the community that shaped us.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/register">Register as an alumnus <Arrow /></Link>
            <a className="secondary-link" href="#about">Discover our story <span>↓</span></a>
          </div>
        </div>
        <div className="hero-art" aria-label="Davao City National High School campus">
          <Image className="campus-photo" src="/branding/enhance_image.png" alt="Davao City National High School campus courtyard" fill sizes="(max-width: 900px) 100vw, 46vw" quality={92} priority />
          <div className="hero-photo-shade" />
          <div className="year-card"><small>Established</small><strong>1922</strong><span>DAVAO CITY</span></div>
          <div className="hero-caption">One school · Many generations</div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Website highlights">
        <p><strong>Reconnect</strong><span>Find your batch community</span></p>
        <p><strong>Participate</strong><span>Join activities and projects</span></p>
        <p><strong>Give back</strong><span>Support the next generation</span></p>
      </section>

      <section className="about section" id="about">
        <div>
          <p className="eyebrow gold">About Us</p>
          <h2>Our association. Our shared story.</h2>
        </div>
        <div className="about-copy">
          <span className="content-needed">Official content requested</span>
          <p className="large-copy">This section is reserved for the official story of the Davao City National High School Alumni Association, Inc.</p>
          <p>The association may provide its history, purpose, mission, vision, founding details, and a short message to alumni. The text shown here is a presentation placeholder and will be replaced after approval.</p>
          <a className="secondary-link dark" href="#programs">Explore the association’s work <Arrow /></a>
        </div>
      </section>

      <section className="programs section" id="programs">
        <div className="section-heading">
          <div><p className="eyebrow gold">Together, we move forward</p><h2>A community in action.</h2></div>
          <p>From reunions to outreach, every connection helps make our alumni community stronger.</p>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article key={program.number}>
              <span>{program.number}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
              <Link href={program.href} aria-label={`Explore ${program.title}`}><Arrow /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="registry-callout section">
        <div className="registry-pattern" aria-hidden="true"><span>1922</span></div>
        <div className="registry-copy">
          <p className="eyebrow">The alumni registry</p>
          <h2>Your chapter belongs in our shared story.</h2>
          <p>Register your alumni profile to help the association build a verified, secure, and connected community.</p>
          <div className="check-row"><span>✓ Batch-based profiles</span><span>✓ Officer verification</span><span>✓ Privacy-first</span></div>
          <Link className="button light" href="/register">Begin registration <Arrow /></Link>
        </div>
      </section>

      <section className="updates section" id="updates">
        <div className="section-heading">
          <div><p className="eyebrow gold">From the association</p><h2>News &amp; activities.</h2></div>
          <span className="prototype-note">Sample content for presentation</span>
        </div>
        <div className="news-grid">
          <article className="news-feature"><div className="news-image image-one"><span>COMING SOON</span></div><p className="tag">Association activity</p><h3>Building a stronger alumni community, one batch at a time</h3><p>Official activity details will be published here by association officers.</p></article>
          <article><div className="news-image image-two"/><p className="tag">Alumni activity</p><h3>Annual homecoming</h3><p>Dates and event information to be confirmed.</p></article>
          <article><div className="news-image image-three"/><p className="tag">Projects</p><h3>Supporting future generations</h3><p>Project and benefactor stories will appear here.</p></article>
        </div>
      </section>

      <footer id="contact">
        <div className="footer-main">
          <div><div className="brand footer-brand"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></div><p>A digital home for the alumni of Davao City National High School.</p></div>
          <div><strong>Explore</strong><a href="#about">About us</a><a href="#programs">Projects</a><a href="#updates">Activities</a><a href="#updates">Awardees</a></div>
          <div><strong>Alumni</strong><Link href="/register">Register</Link><Link href="/login">Sign in</Link><a href="#contact">Contact</a></div>
          <div>
            <strong>Contact</strong>
            <a href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=F.%20Torres%20St%2C%20Poblacion%20District%2C%20Davao%20City%2C%208000%20Davao%20del%20Sur%2C%20Davao%20City%2C%20Philippines%2C%208000&FORM=FBKPL1&mkt=en-GB" target="_blank" rel="noopener noreferrer">
              F. Torres St., Poblacion District, Davao City, 8000, Philippines
            </a>
            <a href="mailto:dcnhsaai@gmail.com">dcnhsaai@gmail.com</a>
          </div>
        </div>
        <div className="footer-bottom"><span>Prototype for review · 2026</span><span>Privacy policy · Terms</span></div>
      </footer>
    </main>
  );
}
