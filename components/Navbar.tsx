'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import UpcomingLaunches from './UpcomingLaunches';

export type DropdownKey = 'platforms' | 'simulation' | 'systems' | 'industries' | 'company';

type NavItem = {
  label: string;
  href: string;
};

export const DROPDOWN_NAV: Record<DropdownKey, { label: string; items: NavItem[] }> = {
  platforms: {
    label: 'PLATFORMS',
    items: [
      { label: 'ANSA', href: '/platforms/ansa' },
      { label: 'Certanity', href: 'https://certanity.com/' },
      { label: 'Mission Studio', href: '/platforms/missionstudio' },
      { label: 'Fleet Manager', href: '/platforms/fleet-manager' },
      { label: 'Downloads', href: '/platforms/downloads' },
    ],
  },
  simulation: {
    label: 'SIMULATION',
    items: [
      { label: 'Reality Engine', href: '/simulation/realityengine' },
      { label: 'Digital Twins', href: '/simulation/digital-twins' },
      { label: 'LiDAR Simulator', href: '/simulation/lidar-simulator' },
      { label: 'GPS-Denied Navigation', href: '/simulation/gpsdenied' },
      { label: 'Telemetry', href: '/simulation/telematry' },
      { label: 'Swarm Simulator', href: '/simulation/swarm-sim' },
    ],
  },
  systems: {
    label: 'SYSTEMS',
    items: [
      { label: 'Flight Controllers', href: '/systems/flight-cont' },
      { label: 'ESC Systems', href: '/systems/Esc-sys' },
      { label: 'Sensor Modules', href: '/systems/sensor-modules' },
      { label: 'Edge Compute', href: '/systems/edgecompute' },
      { label: 'Embedded SDK', href: '/systems/embedded-sdk' },
    ],
  },
  industries: {
    label: 'INDUSTRIES',
    items: [
      { label: 'Defense', href: '/industries/defence' },
      { label: 'Aerospace', href: '/industries/aerospace' },
      { label: 'Robotics', href: '/industries/robotics' },
      { label: 'Enterprise', href: '/industries/enterprise' },
      { label: 'Research & Education', href: '/industries/research-education' },
      { label: 'Government & Public Safety', href: '/industries/government-public-safety' },
      { label: 'OEM & Manufacturers', href: '/industries/oem-manufacturers' },
      { label: 'Wildlife', href: '/industries/wildlife' },
      { label: 'Energy & Utilities', href: '/industries/energy-utilities' },
      { label: 'Agriculture', href: '/industries/agriculture' },
      { label: 'Logistics', href: '/industries/logistics' },
    ],
  },
  company: {
    label: 'COMPANY',
    items: [
      { label: 'About', href: '/company/about' },
      { label: 'Leadership', href: '/company/leadership' },
      { label: 'Careers', href: '/company/careers' },
      { label: 'Newsroom', href: '/company/newsroom' },
      { label: 'Partners', href: '/company/partners' },
      { label: 'Investors', href: '/company/investors' },
      { label: 'Contact', href: '/company/contact' },
    ],
  },
};

const CLOSE_DELAY_MS = 150;

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const [hidden, setHidden] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (openDropdown) {
        setHidden(false);
        return;
      }
      if (currentY > 60 && currentY > lastScrollY.current + 6) {
        setHidden(true);
      } else if (currentY < lastScrollY.current - 6 || currentY <= 30) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [openDropdown]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPanel = useCallback(
    (key: DropdownKey) => {
      clearCloseTimer();
      setOpenDropdown(key);
    },
    [clearCloseTimer]
  );

  const togglePanel = useCallback(
    (key: DropdownKey) => {
      clearCloseTimer();
      setOpenDropdown((prev) => (prev === key ? null : key));
    },
    [clearCloseTimer]
  );

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`navbar-wrapper${hidden ? ' is-hidden' : ''}`}>
      <nav className="navbar" ref={navRef} aria-label="Main Navigation">
        <Link href="/" className="logo" aria-label="Spaceborn Home">
          <img
            src="https://res.cloudinary.com/kpa1wv3h/image/upload/f_auto,q_auto:best,dpr_2.0/v1783382894/spaceborn_assets/spaceborn-transparent-logo.png"
            srcSet="https://res.cloudinary.com/kpa1wv3h/image/upload/f_auto,q_auto:best/v1783382894/spaceborn_assets/spaceborn-transparent-logo.png 1x, https://res.cloudinary.com/kpa1wv3h/image/upload/f_auto,q_auto:best,dpr_2.0/v1783382894/spaceborn_assets/spaceborn-transparent-logo.png 2x"
            alt="Spaceborn Logo"
            width={142}
            height={18}
          />
        </Link>

        <ul className="nav-links desktop-only" role="menubar">
          {(Object.keys(DROPDOWN_NAV) as DropdownKey[]).map((key) => {
            const isOpen = openDropdown === key;
            const isWide = key === 'industries' || DROPDOWN_NAV[key].items.length > 6;

            return (
              <li
                key={key}
                className={`nav-dropdown-trigger${isOpen ? ' is-active' : ''}`}
                onMouseEnter={() => openPanel(key)}
                onMouseLeave={scheduleClose}
                role="none"
              >
                <button
                  type="button"
                  className="nav-dropdown-btn"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => togglePanel(key)}
                >
                  <span>{DROPDOWN_NAV[key].label}</span>
                  <svg
                    className={`nav-chevron ${isOpen ? 'is-open' : ''}`}
                    width="8"
                    height="5"
                    viewBox="0 0 8 5"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L4 4L7 1"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div
                  className={`nav-dropdown-panel${isOpen ? ' is-open' : ''}${isWide ? ' is-wide' : ''}`}
                  onMouseEnter={clearCloseTimer}
                  onMouseLeave={scheduleClose}
                  aria-hidden={!isOpen}
                  role="menu"
                >
                  <div className="nav-dropdown-inner">
                    <ul className={`nav-dropdown-list${isWide ? ' is-grid' : ''}`} role="none">
                      {DROPDOWN_NAV[key].items.map((item) => (
                        <li key={item.label} className="nav-dropdown-item" role="none">
                          {item.href.startsWith('/') ? (
                            <Link
                              href={item.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="nav-item-label">{item.label}</span>
                              <span className="nav-item-arrow" aria-hidden="true">→</span>
                            </Link>
                          ) : (
                            <a
                              href={item.href}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                            >
                              <span className="nav-item-label">{item.label}</span>
                              <span className="nav-item-arrow" aria-hidden="true">→</span>
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
          <li className="nav-standalone-item" role="none">
            <a
              href="https://spaceborn-web.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-standalone-link"
              role="menuitem"
            >
              <span>DERYK</span>
              <span className="nav-external-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
          <li className="nav-standalone-item" role="none">
            <a
              href="https://khonsu.in"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-standalone-link"
              role="menuitem"
            >
              <span>KHONSU</span>
              <span className="nav-external-arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        <div className="navbar-actions">
          <UpcomingLaunches />
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}
