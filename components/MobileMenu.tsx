"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { DROPDOWN_NAV, DropdownKey } from './Navbar';
import { DEFAULT_LAUNCHES, sortLaunches, formatTimeLocal } from './UpcomingLaunches';

export default function MobileMenu({ isCareer }: { isCareer?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});
  const [launches, setLaunches] = useState<{ title: string; image: string; timeString: string }[]>([]);
  const [isLaunchesExpanded, setIsLaunchesExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    async function loadLaunches() {
      let data = DEFAULT_LAUNCHES;
      const url = process.env.NEXT_PUBLIC_LAUNCHES_JSON_URL;
      
      if (url) {
        try {
          const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
          const res = await fetch(fetchUrl, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json) && json.length > 0) {
              data = json;
            }
          }
        } catch (error) {
          console.error("Failed to load launches JSON in MobileMenu:", error);
        }
      }

      const now = Date.now();
      const upcoming = data.filter(l => {
        const targetTime = l.targetUtc ? new Date(l.targetUtc).getTime() : new Date(l.date).getTime();
        return isNaN(targetTime) || targetTime >= now;
      });
      const past = data.filter(l => {
        const targetTime = l.targetUtc ? new Date(l.targetUtc).getTime() : new Date(l.date).getTime();
        return !isNaN(targetTime) && targetTime < now;
      });

      const sortedUpcoming = sortLaunches(upcoming, true);
      const sortedPast = sortLaunches(past, false);
      const sortedData = [...sortedUpcoming, ...sortedPast];

      const topTwo = sortedData.slice(0, 2).map(l => ({
        title: l.project,
        image: l.image || 'https://res.cloudinary.com/dq9x4mk1y/image/upload/w_400,h_400,c_fill/v1782859776/WhatsApp_Image_2026-06-30_at_19.48.56_g8owa7.jpg',
        timeString: formatTimeLocal(l.targetUtc)
      }));
      setLaunches(topTwo);
    }

    loadLaunches();
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Reset accordion states when opening/closing menu
    setOpenAccordions({});
    setIsLaunchesExpanded(false);
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleLaunches = () => {
    setIsLaunchesExpanded(!isLaunchesExpanded);
  };

  const overlayContent = (
    <div className="mobile-menu-overlay">
      <div className="mobile-menu-header">
        <Link href="/" className="logo" onClick={toggleMenu}>
          <img src="https://res.cloudinary.com/kpa1wv3h/image/upload/v1783382894/spaceborn_assets/spaceborn-transparent-logo.png" alt="Spaceborn" />
        </Link>
        <button className="close-menu" onClick={toggleMenu} aria-label="Close menu">✕</button>
      </div>
      <div className="mobile-menu-content">
        <ul className="mobile-nav-links">
          {isCareer ? (
            <>
              <li><Link href="/" onClick={toggleMenu}>HOME</Link></li>
              <li><Link href="/#simulation" onClick={toggleMenu}>SIMULATION</Link></li>
              <li><Link href="/#platforms" onClick={toggleMenu}>PLATFORMS</Link></li>
              <li><Link href="/company/careers" onClick={toggleMenu}>CAREER</Link></li>
            </>
          ) : (
            <>
              {/* Accordion items for submenus */}
              {(Object.keys(DROPDOWN_NAV) as DropdownKey[]).map((key) => {
                const nav = DROPDOWN_NAV[key];
                const isExpanded = !!openAccordions[key];
                return (
                  <li key={key} className="mobile-accordion-item">
                    <button 
                      className={`mobile-accordion-trigger ${isExpanded ? 'active' : ''}`}
                      onClick={() => toggleAccordion(key)}
                    >
                      {nav.label}
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron ${isExpanded ? 'open' : ''}`}>
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    <div className={`mobile-submenu-wrapper ${isExpanded ? 'open' : ''}`}>
                      <ul className="mobile-submenu-list">
                        {nav.items.map((item) => (
                          <li key={item.label}>
                            {item.href.startsWith('/') ? (
                              <Link href={item.href} onClick={toggleMenu}>
                                {item.label}
                              </Link>
                            ) : (
                              <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
                                {item.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}

              {/* Independent Links */}
              <li>
                <Link href="/deryk" onClick={toggleMenu}>
                  DERYK
                </Link>
              </li>
              <li>
                <a href="https://khonsu.in" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
                  KHONSU
                </a>
              </li>

              {/* Upcoming Launches Accordion */}
              <li className="mobile-accordion-item">
                <button 
                  className={`mobile-accordion-trigger ${isLaunchesExpanded ? 'active' : ''}`}
                  onClick={toggleLaunches}
                >
                  UPCOMING LAUNCHES
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron ${isLaunchesExpanded ? 'open' : ''}`}>
                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <div className={`mobile-submenu-launches ${isLaunchesExpanded ? 'open' : ''}`}>
                  <div className="mobile-launches-list">
                    {launches.map((launch, index) => (
                      <div className="mobile-launch-item" key={index}>
                        <div className="mobile-launch-image">
                          <img src={launch.image} alt={launch.title} />
                        </div>
                        <div className="mobile-launch-info">
                          <h4 className="mobile-launch-title">{launch.title}</h4>
                          <p className="mobile-launch-time">{launch.timeString}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mobile-launches-footer">
                    <Link href="/launches" className="mobile-all-launches-link" onClick={toggleMenu}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="grid-icon">
                        <circle cx="2" cy="2" r="1.5"/>
                        <circle cx="8" cy="2" r="1.5"/>
                        <circle cx="14" cy="2" r="1.5"/>
                        <circle cx="2" cy="8" r="1.5"/>
                        <circle cx="8" cy="8" r="1.5"/>
                        <circle cx="14" cy="8" r="1.5"/>
                        <circle cx="2" cy="14" r="1.5"/>
                        <circle cx="8" cy="14" r="1.5"/>
                        <circle cx="14" cy="14" r="1.5"/>
                      </svg>
                      ALL UPCOMING LAUNCHES
                    </Link>
                  </div>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
        <span className="hamburger-line" />
        <span className="hamburger-line" />
        <span className="hamburger-line" />
      </button>
      {isOpen && mounted && createPortal(overlayContent, document.body)}
    </>
  );
}
