import Link from 'next/link';
import Navbar from './Navbar';
import Footer from './Footer';

type ContentSection = {
  title: string;
  items: string[];
};

type CtaBox = {
  label: string;
  buttonText: string;
  href: string;
};

type CompanyPageLayoutProps = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  sections?: ContentSection[];
  ctas?: CtaBox[];
  relatedLinks?: { label: string; href: string }[];
  children?: React.ReactNode;
};

const PAGE_LINKS: Record<string, string> = {
  'ANSA': '/platforms/ansa',
  'Certanity': '/platforms/certainty',
  'Mission Studio': '/platforms/missionstudio',
  'Fleet Manager': '/platforms/fleet-manager',
  'Downloads': '/platforms/downloads',
  'Reality Engine': '/simulation/realityengine',
  'Digital Twins': '/simulation/digital-twins',
  'LiDAR Simulator': '/simulation/lidar-simulator',
  'GPS-Denied Navigation': '/simulation/gpsdenied',
  'Telemetry': '/simulation/telematry',
  'Swarm Simulator': '/simulation/swarm-sim',
  'Flight Controllers': '/systems/flight-cont',
  'ESC Systems': '/systems/Esc-sys',
  'Sensor Modules': '/systems/sensor-modules',
  'Edge Compute': '/systems/edgecompute',
  'Embedded SDK': '/systems/embedded-sdk',
  'Defense': '/industries/defence',
  'Aerospace': '/industries/aerospace',
  'Robotics': '/industries/robotics',
  'Enterprise': '/industries/enterprise',
  'Research & Education': '/industries/research-education',
  'Government & Public Safety': '/industries/government-public-safety',
  'OEM & Manufacturers': '/industries/oem-manufacturers',
  'Wildlife': '/industries/wildlife',
  'Energy & Utilities': '/industries/energy-utilities',
  'Agriculture': '/industries/agriculture',
  'Logistics': '/industries/logistics',
  'About': '/company/about',
  'Leadership': '/company/leadership',
  'Careers': '/company/careers',
  'Newsroom': '/company/newsroom',
  'Partners': '/company/partners',
  'Investors': '/company/investors',
  'Contact': '/company/contact',
};

export default function CompanyPageLayout({
  title,
  subtitle,
  paragraphs,
  sections,
  ctas,
  relatedLinks,
  children,
}: CompanyPageLayoutProps) {
  const GREEN_PAGES = ['ansa', 'certanity','fleet manager','mission studio','reality engine',];
const isGreen = GREEN_PAGES.includes(title.trim().toLowerCase());

const greenBackground = `
  radial-gradient(ellipse 60% 50% at 10% 15%, rgba(198, 239, 146, 0.28) 0%, transparent 70%),
  radial-gradient(ellipse 50% 45% at 95% 80%, rgba(120, 190, 140, 0.18) 0%, transparent 70%),
  linear-gradient(180deg, #0f2a1c 0%, #010101 60%)`
  return (
    <>
      <Navbar />

      <main>
        <section
  className="company-hero"
  style={isGreen ? { background: greenBackground } : undefined}>
          <h1 className="company-title font-ethno">{title}</h1>
          {subtitle && (
            <p className="company-subtitle font-inter">{subtitle}</p>
          )}
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="company-desc font-inter">
              {paragraph}
            </p>
          ))}

          {sections && sections.length > 0 && (
            <div className="company-sections-grid">
              {sections.map((section) => (
                <div key={section.title} className="company-section-block">
                  <h2 className="company-section-title font-inter">{section.title}</h2>
                  <ul className="company-list font-inter">
                    {section.items.map((item) => {
                      const href = PAGE_LINKS[item];
                      return (
                        <li key={item}>
                          {href ? (
                            <Link href={href} className="hover-link">
                              {item}
                            </Link>
                          ) : (
                            item
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {ctas && ctas.length > 0 && (
            <div className="partners-ctas-grid">
              {ctas.map((cta) => (
                <div key={cta.label} className="partner-cta-box">
                  <span className="partner-cta-label font-inter">{cta.label}</span>
                  {cta.href.startsWith('/') ? (
                    <Link href={cta.href} className="btn font-mono">
                      {cta.buttonText}
                    </Link>
                  ) : (
                    <a href={cta.href} className="btn font-mono">
                      {cta.buttonText}
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {relatedLinks && relatedLinks.length > 0 && (
            <div className="company-related">
              <h2 className="company-section-title font-inter">Related Pages</h2>
              <ul className="company-related-links font-mono">
                {relatedLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {children}
        </section>

        <Footer isHome={false} />
      </main>
    </>
  );
}
