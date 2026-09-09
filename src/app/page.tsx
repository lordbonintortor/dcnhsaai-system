import Link from "next/link";
import Image from "next/image";
import { association } from "@/lib/association";
import HeroCarousel from "./hero-carousel";
import AssociationDropdown from "./association-dropdown";

const Arrow = () => <span aria-hidden="true">↗</span>;

const associationLinks = [
  {
    title: "Alumni Activities",
    href: "/alumni-association-events",
  },
  {
    title: "Alumni Projects",
    href: "/alumni-projects",
  },
    {
    title: "Board of Trustees",
    href: "/board-of-trustees",
  },
  {
    title: "Management Reports",
    href: "/management-reports",
  },
  {
    title: "Outstanding Student and Alumni Awardees",
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
          <Link href="/about">About Us</Link>
          <AssociationDropdown>
            {associationLinks.map((item) => <Link key={item.href} href={item.href}>{item.title}</Link>)}
          </AssociationDropdown>
          <a href="#updates">News</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="header-actions">
          <Link className="text-link" href="/login">Sign in</Link>
          <Link className="button button-small" href="/register">Join the registry</Link>
        </div>
      </header>

      <HeroCarousel>
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
      </HeroCarousel>

      <section className="trust-strip" aria-label="Website highlights">
        <p><strong>Reconnect</strong><span>Find your batch community</span></p>
        <p><strong>Participate</strong><span>Join activities and projects</span></p>
        <p><strong>Give back</strong><span>Support the next generation</span></p>
      </section>

      <section className="about section" id="about">
        <div>
          <p className="eyebrow gold">About Us</p>
          <h2>Our association. Our shared story.</h2>
          <dl className="about-facts"><div><dt>Association founded</dt><dd>{association.founded}</dd></div><div><dt>Our organization</dt><dd>Non-stock,<br />non-profit</dd></div></dl>
        </div>
        <div className="about-copy">
          <p className="large-copy">{association.introduction}</p>
          <p>{association.summary}</p>
          <Link className="secondary-link dark" href="/about">Read our story <Arrow /></Link>
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
          <div><strong>Explore</strong><Link href="/about">About us</Link><Link href="/alumni-association-events">Alumni &amp; Association Events</Link><Link href="/alumni-projects">Alumni Projects</Link><Link href="/outstanding-student-and-alumni-awardees">Awardees</Link></div>
          <div><strong>Alumni</strong><Link href="/register">Register</Link><Link href="/login">Sign in</Link><a href="#contact">Contact</a></div>
          <div>
            <strong>Contact</strong>
            <a href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=F.%20Torres%20St%2C%20Poblacion%20District%2C%20Davao%20City%2C%208000%20Davao%20del%20Sur%2C%20Davao%20City%2C%20Philippines%2C%208000&FORM=FBKPL1&mkt=en-GB" target="_blank" rel="noopener noreferrer">
              F. Torres St., Poblacion District, Davao City, 8000, Philippines
            </a>
            <span>{association.contact.office}</span>
            <a href={`mailto:${association.contact.email}`}>{association.contact.email}</a>
            <a href={association.contact.phoneHref}>{association.contact.phone}</a>
          </div>
        </div>
        <div className="footer-bottom"><span>Prototype for review · 2026</span><span>Privacy policy · Terms</span></div>
      </footer>
    </main>
  );
}
