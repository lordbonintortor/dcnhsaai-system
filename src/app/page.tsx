import Link from "next/link";
import Image from "next/image";
import { association } from "@/lib/association";
import HeroCarousel from "./hero-carousel";
import AssociationDropdown from "./association-dropdown";
import PublicHeader from "./public-header";
import { tionkoDayActivity } from "@/lib/activity-post";
import { alumniProjects } from "@/lib/alumni-projects";

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
    title: "Association Documents",
    href: "/association-documents",
  },
  {
    title: "Outstanding Student and Alumni Awardees",
    href: "/outstanding-student-and-alumni-awardees",
  },
];

export default function Home() {
  return (
    <main>
      <PublicHeader>
        <AssociationDropdown>
          {associationLinks.map((item) => <Link key={item.href} href={item.href}>{item.title}</Link>)}
        </AssociationDropdown>
        <Link href="/alumni-directory">Alumni Directory</Link>
        <Link className="button button-small donate-button" href="/donate">Donate</Link>
      </PublicHeader>

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

      <section className="home-pathways section" aria-labelledby="pathways-title">
        <div className="section-heading">
          <div><p className="eyebrow gold">Find your place here</p><h2 id="pathways-title">A home for every City High story.</h2></div>
          <p>Whether you are reconnecting with classmates, learning about our work, or helping the next generation, there is a place for you in the alumni community.</p>
        </div>
        <div className="pathway-grid">
          <Link className="pathway-card" href="/alumni-directory"><span className="pathway-number">01</span><div><h3>Find your community</h3><p>Explore the approved alumni directory and reconnect with the people who shared your City High years.</p><span className="pathway-link">Browse the directory <Arrow /></span></div></Link>
          <Link className="pathway-card" href="/alumni-association-events"><span className="pathway-number">02</span><div><h3>See what we are doing</h3><p>Follow association activities, projects, and milestones that keep our shared story moving forward.</p><span className="pathway-link">Explore activities <Arrow /></span></div></Link>
          <Link className="pathway-card" href="/donate"><span className="pathway-number">03</span><div><h3>Help City High thrive</h3><p>Support programs and initiatives that create lasting opportunities for students and alumni.</p><span className="pathway-link">Learn how to give <Arrow /></span></div></Link>
        </div>
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
          <p className="eyebrow">Join the alumni registry</p>
          <h2>Keep your City High connection alive.</h2>
          <p>Register your profile to reconnect with classmates, discover association activities, and help build a stronger alumni community.</p>
          <div className="check-row"><span>✓ Batch-based profiles</span><span>✓ Officer verification</span><span>✓ Privacy-first</span></div>
          <Link className="button light" href="/register">Begin registration <Arrow /></Link>
        </div>
      </section>

      <section className="updates section" id="updates">
        <div className="section-heading">
          <div><p className="eyebrow gold">From the association</p><h2>News &amp; activities.</h2></div>
          <p>Explore the milestones, programs, and projects that continue to bring the City High community together.</p>
        </div>
        <div className="news-grid">
          <Link className="news-card news-feature" href="/alumni-association-events">
            <div className="news-image news-photo" style={{ backgroundImage: `url("${tionkoDayActivity.images[0].src}")` }} />
            <div className="news-card-content"><p className="tag">Association activity · {tionkoDayActivity.date}</p><h3>{tionkoDayActivity.title}</h3><p>{tionkoDayActivity.summary}</p><span className="news-card-link">Read activity <Arrow /></span></div>
          </Link>
          <Link className="news-card" href="/alumni-projects/2025">
            <div className="news-image image-two"><span className="news-year">2025</span></div>
            <div className="news-card-content"><p className="tag">Recognition program</p><h3>{alumniProjects["2025"][0].title}</h3><p>Honoring alumni and students whose contributions inspire the next generation.</p><span className="news-card-link">View project <Arrow /></span></div>
          </Link>
          <Link className="news-card" href="/alumni-projects/2024">
            <div className="news-image image-three"><span className="news-year">2024</span></div>
            <div className="news-card-content"><p className="tag">Alumni projects</p><h3>{alumniProjects["2024"].length} projects for City High</h3><p>Explore the monument, solar lighting, SSG building repair, and alumni website initiatives.</p><span className="news-card-link">Explore projects <Arrow /></span></div>
          </Link>
        </div>
        <div className="updates-footer"><p>Explore the association’s activities and projects.</p><Link className="secondary-link dark" href="/alumni-association-events">View all activities <Arrow /></Link></div>
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
        <div className="footer-bottom"><span>© 2026 DCNHS Alumni Association, Inc.</span><span><Link href="/privacy-policy">Privacy Policy</Link> · <Link href="/terms-of-use">Terms of Use</Link></span></div>
      </footer>
    </main>
  );
}
