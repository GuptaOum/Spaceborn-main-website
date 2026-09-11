'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import MobileMenu from './MobileMenu';
import UpcomingLaunches from './UpcomingLaunches';

export type DropdownKey = 'platforms' | 'simulation' | 'systems' | 'industries' | 'company';

export const DERYK_URL = 'https://github.com/Sarthak-Developer-Coder/deryk_landing-page';

type NavItem = {
  label: string;
  href: string;
};

export const DROPDOWN_NAV: Record<DropdownKey, { label: string; items: NavItem[] }> = {
  platforms: {
    label: 'PLATFORMS',
    items: [
      { label: 'ANSA', href: '/platforms/ansa' },
      { label: 'Certanity', href: '/platforms/certainty' },
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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar">
        <Link href="/" className="logo" aria-label="Spaceborn home">
          <img
            src="https://res.cloudinary.com/kpa1wv3h/image/upload/v1783382894/spaceborn_assets/spaceborn-transparent-logo.png"
            alt="Spaceborn Logo"
          />
        </Link>

        <ul className="nav-links desktop-only">
          {(Object.keys(DROPDOWN_NAV) as DropdownKey[]).map((key) => {
            const isOpen = openDropdown === key;

            return (
              <li
                key={key}
                className={`nav-dropdown-trigger${isOpen ? ' is-active' : ''}`}
                onMouseEnter={() => openPanel(key)}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className="nav-dropdown-btn"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                >
                  {DROPDOWN_NAV[key].label}
                </button>

                <div
                  className={`nav-dropdown-panel${isOpen ? ' is-open' : ''}`}
                  onMouseEnter={clearCloseTimer}
                  aria-hidden={!isOpen}
                >
                  <div className="nav-dropdown-inner">
                    <ul className="nav-dropdown-list">
                      {DROPDOWN_NAV[key].items.map((item, index) => (
                        <li
                          key={item.label}
                          className="nav-dropdown-item"
                          style={{
                            transitionDelay: isOpen ? `${index * 30}ms` : '0ms',
                          }}
                        >
                          {item.href.startsWith('/') ? (
                            <Link href={item.href}>{item.label}</Link>
                          ) : (
                            <a href={item.href}>{item.label}</a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
          <li>
            <a href={DERYK_URL} target="_blank" rel="noopener noreferrer">
              DERYK
            </a>
          </li>
          <li>
            <a href="https://khonsu.in" target="_blank" rel="noopener noreferrer">
              KHONSU
            </a>
          </li>
        </ul>

        <UpcomingLaunches />
        <MobileMenu />
      </nav>
    </header>
  );
}
