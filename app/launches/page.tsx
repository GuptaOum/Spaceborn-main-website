
'use client';

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  DEFAULT_LAUNCHES,
  LaunchData,
  sortLaunches,
} from '../../components/UpcomingLaunches';

type LaunchCardData = {
  project: string;
  classification: string;
  date: string;
  targetUtc?: string;
  image?: string;
  video?: string;
};

const SEPTEMBER_LAUNCHES: LaunchCardData[] = [
  {
    project: 'SWARM / FLEET',
    classification: 'Execution Runtime',
    date: '1 SEP',
    image:
      'https://res.cloudinary.com/bidpa4j5/image/upload/v1789974122/WhatsApp_Image_2026-08-03_at_6.52.03_PM_1.jpg',
  },
  {
    project: 'VISIONWS',
    classification: 'Robotics & Simulation',
    date: '4 SEP',
    image:
      'https://res.cloudinary.com/bidpa4j5/image/upload/v1789973902/WhatsApp_Image_2026-08-03_at_6.52.09_PM_1.jpg',
  },
  {
    project: 'H7',
    classification: 'Hardware',
    date: '5 SEP',
    image:
      'https://res.cloudinary.com/bidpa4j5/image/upload/v1789973902/WhatsApp_Image_2026-08-03_at_6.52.07_PM.jpg',
  },
  {
    project: 'Power & Battery Simulator',
    classification: 'Robotics & Simulation',
    date: '6 SEP',
    image: 'https://res.cloudinary.com/bidpa4j5/image/upload/v1790013533/pexels-chengxin-zhao-1218017-15470542.jpg',
  },
  {
    project: 'Control Stack Validation v2',
    classification: 'Control Logic',
    date: '7 SEP',
    image: 'https://res.cloudinary.com/bidpa4j5/image/upload/v1790013533/pexels-tanhatamannasyed-35673120.jpg',
  },
  {
    project: 'DERYK Website',
    classification: 'Platform & DevOps',
    date: '11 SEP',
    image: 'https://res.cloudinary.com/bidpa4j5/image/upload/v1790013532/pexels-pavel-danilyuk-8438967.jpg',
  },
  {
    project: 'Security Runtime',
    classification: 'FSM',
    date: '12 SEP',
    image: 'https://res.cloudinary.com/bidpa4j5/image/upload/v1790013533/pexels-tanhatamannasyed-35652412.jpg',
  },
  {
    project: 'HPUs Documentation',
    classification: 'Hardware',
    date: '14 SEP',
  },
  {
    project: 'HAL Simulator v1',
    classification: 'Platform & DevOps',
    date: '14 SEP',
  },
  {
    project: 'Complete Execution Runtime + Integration',
    classification: 'Execution Runtime',
    date: '15 SEP',
  },
  {
    project: 'Production-Level Stack',
    classification: 'Sensor Stack / HAL',
    date: '15 SEP',
  },
  {
    project: 'Production Level',
    classification: 'FSM',
    date: '15 SEP',
  },
  {
    project: 'GUI Complete',
    classification: 'Sensor Stack / HAL',
    date: '16 SEP',
  },
  {
    project: 'Communication & Network Simulator',
    classification: 'Robotics & Simulation',
    date: '17 SEP',
  },
  {
    project: 'ANSA Website',
    classification: 'Platform & DevOps',
    date: '18 SEP',
  },
  {
    project: 'Component Selection',
    classification: 'Hardware',
    date: '19 SEP',
  },
  {
    project: 'Manufacturing & Industry Simulator',
    classification: 'Robotics & Simulation',
    date: '19 SEP',
  },
  {
    project: 'Production-Level Control Logic',
    classification: 'Control Logic',
    date: '19 SEP',
  },
  {
    project: 'Spaceborn Scratch Simulator',
    classification: 'Robotics & Simulation',
    date: '20 SEP',
  },
  {
    project: 'HPU Visual',
    classification: 'Hardware',
    date: '30 SEP',
  },
  {
    project: 'Humanoid Simulator',
    classification: 'Robotics & Simulation',
    date: '30 SEP',
  },
];

const INITIAL_CAROUSEL_COUNT = 7;
const INITIAL_VISIBLE_COUNT = 6;

export default function LaunchesPage() {
  const [upcomingLaunches] =
    useState<LaunchCardData[]>(SEPTEMBER_LAUNCHES);

  const [pastLaunches, setPastLaunches] = useState<LaunchData[]>(() => {
    const now = Date.now();

    const past = DEFAULT_LAUNCHES.filter((launch) => {
      const targetTime = launch.targetUtc
        ? new Date(launch.targetUtc).getTime()
        : new Date(launch.date).getTime();

      return !Number.isNaN(targetTime) && targetTime < now;
    });

    return sortLaunches(past, false);
  });

  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showAllPast, setShowAllPast] = useState(false);

  const [activeLaunchIndex, setActiveLaunchIndex] = useState(0);
  const [slideDirection, setSlideDirection] =
    useState<'next' | 'prev'>('next');
  const [isSliding, setIsSliding] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComingSoon, setIsComingSoon] = useState(true);

  // Automatic carousel swipe
  useEffect(() => {
    if (isSliding) return;

    const interval = window.setInterval(() => {
      setSlideDirection('next');
      setIsSliding(true);

      window.setTimeout(() => {
        setActiveLaunchIndex((previous) => {
          const maxIndex = showAllUpcoming
            ? upcomingLaunches.length - 1
            : INITIAL_CAROUSEL_COUNT;

          // VIEW MORE card ke baad carousel restart
          if (previous >= maxIndex) {
            return 0;
          }

          return previous + 1;
        });

        setIsSliding(false);
      }, 350);
    }, 1500);

    return () => window.clearInterval(interval);
  }, [isSliding, showAllUpcoming, upcomingLaunches.length]);

  const carouselLaunches = showAllUpcoming
    ? upcomingLaunches
    : upcomingLaunches.slice(0, INITIAL_CAROUSEL_COUNT);

  const isViewMoreCard =
    !showAllUpcoming &&
    activeLaunchIndex >= carouselLaunches.length;

  const handleSlide = (direction: 'next' | 'prev') => {
    if (isSliding) return;

    setSlideDirection(direction);
    setIsSliding(true);

    window.setTimeout(() => {
      setActiveLaunchIndex((previous) => {
        if (direction === 'next') {
          return Math.min(
            previous + 1,
            carouselLaunches.length
          );
        }

        return Math.max(previous - 1, 0);
      });

      setIsSliding(false);
    }, 350);
  };

  const handleViewMore = () => {
    setShowAllUpcoming(true);
    setActiveLaunchIndex(INITIAL_CAROUSEL_COUNT);
    setSlideDirection('next');
  };

  // Optional external JSON data for past launches
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const url = process.env.NEXT_PUBLIC_LAUNCHES_JSON_URL;

      if (!url) return;

      try {
        const fetchUrl = `${url}${
          url.includes('?') ? '&' : '?'
        }t=${Date.now()}`;

        const response = await fetch(fetchUrl, {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error(
            'Failed to fetch launches:',
            response.status
          );
          return;
        }

        const json = await response.json();

        if (
          !Array.isArray(json) ||
          json.length === 0 ||
          !isMounted
        ) {
          return;
        }

        const now = Date.now();
        const past: LaunchData[] = [];

        json.forEach((launch: LaunchData) => {
          const targetTime = launch.targetUtc
            ? new Date(launch.targetUtc).getTime()
            : new Date(launch.date).getTime();

          if (
            !Number.isNaN(targetTime) &&
            targetTime < now
          ) {
            past.push(launch);
          }
        });

        if (isMounted) {
          setPastLaunches(sortLaunches(past, false));
        }
      } catch (error) {
        console.error(
          'Failed to load launches JSON:',
          error
        );
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown
  useEffect(() => {
    const firstLaunch = upcomingLaunches.find((launch) => {
      if (!launch.targetUtc) return false;

      const target = new Date(launch.targetUtc).getTime();

      return !Number.isNaN(target) && target > Date.now();
    });

    if (!firstLaunch?.targetUtc) {
      setIsComingSoon(true);
      return;
    }

    const targetDate = new Date(
      firstLaunch.targetUtc
    ).getTime();

    setIsComingSoon(false);

    const updateCountdown = () => {
      const distance = targetDate - Date.now();

      if (distance <= 0) {
        setIsComingSoon(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(
          distance / (1000 * 60 * 60 * 24)
        ),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        ),
        seconds: Math.floor(
          (distance % (1000 * 60)) / 1000
        ),
      });
    };

    updateCountdown();

    const interval = window.setInterval(
      updateCountdown,
      1000
    );

    return () => window.clearInterval(interval);
  }, [upcomingLaunches]);

  const formatUnit = (unit: number) =>
    unit.toString().padStart(2, '0');

  const visiblePast = showAllPast
    ? pastLaunches
    : pastLaunches.slice(0, INITIAL_VISIBLE_COUNT);

  const renderLaunchCards = (
    launches: LaunchCardData[],
    isPast: boolean
  ) => {
    if (launches.length === 0) {
      return (
        <div className="launches-empty">
          {isPast
            ? 'No past launches available yet.'
            : 'No upcoming launches available.'}
        </div>
      );
    }

    return (
      <div className="launches-grid">
        {launches.map((launch, index) => (
          <article
            className={`launch-card ${
              isPast ? 'past-card' : ''
            }`}
            key={`${launch.project}-${launch.date}-${index}`}
          >
            <div className="launch-card-image-wrap">
              <img
                className="launch-card-image"
                src={
                  launch.image ||
                  'https://res.cloudinary.com/dq9x4mk1y/image/upload/w_2000,h_1200,c_fill/v1782859776/WhatsApp_Image_2026-06-30_at_19.48.56_g8owa7.jpg'
                }
                alt={launch.project}
                loading="lazy"
              />
            </div>

            <div className="launch-card-top">
              <span className="launch-card-index font-mono">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span
                className={`launch-card-status font-mono ${
                  isPast
                    ? 'status-past'
                    : 'status-upcoming'
                }`}
              >
                <span className="status-dot" />
                {isPast ? 'PAST' : 'UPCOMING'}
              </span>
            </div>

            <div className="launch-card-content">
              <h3 className="launch-card-title font-ethno">
                {launch.project}
              </h3>

              <p className="launch-card-classification font-mono">
                {launch.classification || 'Unclassified'}
              </p>
            </div>

            <div className="launch-card-bottom">
              <span className="launch-card-date-label font-mono">
                TARGET DATE
              </span>

              <span className="launch-card-date font-mono">
                {launch.date || 'COMING SOON'}
              </span>
            </div>
          </article>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="launches-main">
        {/* HERO */}
        <section className="launches-hero">
          <div className="launches-hero-bg">
            {upcomingLaunches[0]?.video ? (
              <video
                className="rocket-hero-video"
                src="/launches/swarm%20fleet%201.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
              />
            ) : (
              <img
                src="https://res.cloudinary.com/bidpa4j5/image/upload/v1789973901/WhatsApp_Image_2026-08-03_at_6.52.05_PM_1.jpg"
                alt="Spaceborn Launches Hero"
              />
            )}

            <div className="launches-hero-overlay" />
          </div>

          <div className="launches-hero-content">
            <div className="launches-countdown font-mono">
              {isComingSoon
                ? 'COMING SOON'
                : `T-${timeLeft.days}D ${formatUnit(
                    timeLeft.hours
                  )}:${formatUnit(
                    timeLeft.minutes
                  )}:${formatUnit(timeLeft.seconds)}`}
            </div>

            <h1 className="launches-hero-title font-ethno">
              {upcomingLaunches[0]?.project?.toUpperCase() ||
                'SPACEBORN LAUNCHES'}
            </h1>

            <p className="launches-hero-subtitle font-mono">
              REAL-TIME INTELLIGENCE, FROM EVERY FLIGHT
            </p>

            <a
              href="#upcoming-launches"
              className="launches-watch-btn font-mono"
            >
              EXPLORE LAUNCHES <span>↘</span>
            </a>
          </div>

          <div className="hero-bottom-label font-mono">
            <span>SPACEBORN</span>
            <span>MISSION CONTROL / 2026</span>
          </div>
        </section>

        {/* LAUNCHES */}
        <div className="launches-container">
          {/* UPCOMING LAUNCHES */}
          <section
            className="launches-section"
            id="upcoming-launches"
          >
            <div className="section-heading-row">
              <div>
                <p className="section-eyebrow font-mono">
               
                </p>

                <h2 className="launches-section-title font-ethno">
                  UPCOMING LAUNCHES
                </h2>
              </div>

              <span className="section-count font-mono">
                {String(upcomingLaunches.length).padStart(
                  2,
                  '0'
                )}{' '}
                ITEMS
              </span>
            </div>

            {/* CAROUSEL */}
            <div className="launch-carousel">
              <button
                type="button"
                className="carousel-arrow carousel-prev"
                onClick={() => handleSlide('prev')}
                disabled={
                  activeLaunchIndex === 0 || isSliding
                }
                aria-label="Previous launch"
              >
                ←
              </button>

              <div className="carousel-stage">
                {isViewMoreCard ? (
                  <div
                    key="view-more-card"
                    className={`view-more-carousel-card ${
                      isSliding
                        ? 'carousel-exit'
                        : 'carousel-enter'
                    }`}
                  >
                    <div className="view-more-content">
                      <span className="view-more-label font-mono">
                        SPACEBORN / MISSION ARCHIVE
                      </span>

                      <h3 className="font-ethno">
                        VIEW MORE
                      </h3>

                      <p className="font-mono">
                        Explore all upcoming launches.
                      </p>

                      <button
                        type="button"
                        onClick={handleViewMore}
                        className="view-more-action font-mono"
                      >
                        EXPLORE ALL LAUNCHES ↗
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={activeLaunchIndex}
                    className={`carousel-card ${
                      isSliding
                        ? slideDirection === 'next'
                          ? 'carousel-exit-left'
                          : 'carousel-exit-right'
                        : slideDirection === 'next'
                        ? 'carousel-enter-right'
                        : 'carousel-enter-left'
                    }`}
                  >
                    {renderLaunchCards(
                      [
                        carouselLaunches[
                          activeLaunchIndex
                        ],
                      ].filter(Boolean),
                      false
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="carousel-arrow carousel-next"
                onClick={() => handleSlide('next')}
                disabled={isSliding}
                aria-label="Next launch"
              >
                →
              </button>
            </div>

            <div className="carousel-progress font-mono">
              <span>
                {isViewMoreCard
                  ? 'VIEW MORE'
                  : `${String(
                      activeLaunchIndex + 1
                    ).padStart(2, '0')} / ${String(
                      carouselLaunches.length
                    ).padStart(2, '0')}`}
              </span>

              <div className="carousel-progress-track">
                <div
                  className="carousel-progress-fill"
                  style={{
                    width: `${
                      isViewMoreCard
                        ? 100
                        : ((activeLaunchIndex + 1) /
                            carouselLaunches.length) *
                          100
                    }%`,
                  }}
                />
              </div>

              <span>
                {showAllUpcoming
                  ? 'ALL LAUNCHES'
                  : `${INITIAL_CAROUSEL_COUNT} + ARCHIVE`}
              </span>
            </div>
          </section>
          {/* RECENT LAUNCHES SECTION */}
<section className="launches-section recent-launches-section">
  <div className="section-heading-row">
    <h2 className="font-ethno">
  RECENT LAUNCHES
</h2>

    <span className="section-count">
      LATEST MISSIONS
    </span>
  </div>

  <div className="launches-grid recent-launches-grid">
    {pastLaunches.slice(0, 3).map((launch, index) => (
      <article
        className="launch-card past-card recent-launch-card"
        key={`recent-${launch.project}-${index}`}
      >
        <div className="launch-card-image-wrap">
           
          <img
            src={launch.image ||                   'https://res.cloudinary.com/dq9x4mk1y/image/upload/w_2000,h_1200,c_fill/v1782859776/WhatsApp_Image_2026-06-30_at_19.48.56_g8owa7.jpg'
}
            alt={launch.project}
            className="launch-card-image"
          />
        </div>

        <div className="launch-card-top">
          <span className="launch-card-index">
            {String(index + 1).padStart(2, "0")}
          </span>

          <span className="launch-card-status status-past">
            <span className="status-dot" />
            COMPLETED
          </span>
        </div>

        <div className="launch-card-content">
          <h3 className="launch-card-title">
            {launch.project}
          </h3>

          <p className="launch-card-classification">
            {launch.classification}
          </p>
        </div>

        <div className="launch-card-bottom">
          <span className="launch-card-date-label">
            LAUNCH DATE
          </span>

          <span className="launch-card-date">
            {launch.date}
          </span>
        </div>
      </article>
    ))}
  </div>
</section>

          {/* PAST LAUNCHES */}
          <section className="launches-section past-section">
            <div className="section-heading-row">
              <div>
                <p className="section-eyebrow font-mono">
                
                </p>

                <h2 className="launches-section-title font-ethno">
                  PAST LAUNCHES
                </h2>
              </div>

              <span className="section-count font-mono">
                {String(pastLaunches.length).padStart(
                  2,
                  '0'
                )}{' '}
                ITEMS
              </span>
            </div>

            {renderLaunchCards(
              visiblePast as LaunchCardData[],
              true
            )}

            {pastLaunches.length >
              INITIAL_VISIBLE_COUNT && (
              <div className="view-more-wrap">
                <button
                  type="button"
                  className="view-more-btn font-mono"
                  onClick={() =>
                    setShowAllPast((previous) => !previous)
                  }
                >
                  {showAllPast
                    ? 'VIEW LESS'
                    : `VIEW MORE  (+${
                        pastLaunches.length -
                        INITIAL_VISIBLE_COUNT
                      })`}

                  <span>
                    {showAllPast ? '↑' : '↓'}
                  </span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer isHome={false} />

      {/* PAGE STYLES */}
      <style>{`
      /* Main carousel card */
.launch-card {
  width: 100%;
  max-width: 900px;
  min-height: 440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr;
  overflow: hidden;
  border-radius: 24px;
}

/* Image ko zyada space */
.launch-card-image {
  width: 100%;
  height: 100%;
  min-height: 440px;
  object-fit: cover;
  display: block;
}
  /* Card image ke upar details overlay */
.carousel-card .launch-card {
  position: relative;
  overflow: hidden;
  padding: 0;
  isolation: isolate;
}

/* Image full card mein */
.carousel-card .launch-card-image-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.carousel-card .launch-card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

/* Hover par image zoom */
.carousel-card .launch-card:hover .launch-card-image {
  transform: scale(1.06);
}

/* Details image ke upar */
.carousel-card .launch-card-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  min-height: 440px;
 

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.92) 0%,
    rgba(0, 0, 0, 0.65) 35%,
    rgba(0, 0, 0, 0.12) 75%,
    transparent 100%
  );

  color: #fff;
}
  /* RECENT LAUNCHES SECTION */

.recent-launches-section {
  margin-bottom: 100px;
}

.recent-launches-section .section-heading-row {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: 35px;
}

.recent-launches-section .launches-section-title {
  text-align: center;
}

.recent-launches-section .section-count {
  position: absolute;
  right: 0;
}

/* Keep the 3 cards in the existing grid */
.recent-launches-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* Match the image-overlay design */
.recent-launches-grid .recent-launch-card {
  min-height: 300px;
  border-radius: 14px;
}

/* Responsive layout */
@media (max-width: 1000px) {
  .recent-launches-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .recent-launches-grid {
    grid-template-columns: 1fr;
  }

  .recent-launches-section .section-heading-row {
    flex-direction: column;
    gap: 10px;
  }

  .recent-launches-section .section-count {
    position: static;
  }
}

/* Project title */
.carousel-card .launch-card-title {
  color: #fff;
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 700;
  line-height: 1.15;
 
}

/* Classification */
.carousel-card .launch-card-classification {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

/* Date / bottom details */
.carousel-card .launch-card-bottom {
  color: #fff;
  margin-top: 18px;
}

/* Top label */
.carousel-card .launch-card-top {
  position: relative;
  z-index: 3;
}

/* Mobile */
@media (max-width: 600px) {
  .carousel-card .launch-card-content {
    min-height: 380px;
    padding: 20px;
  }

  .carousel-card .launch-card-title {
    font-size: 22px;
  }
}
        .launches-main {
          --lime: #fefcfc;
          --bg: #070807;
          --card: #10120f;
          --muted: #8b9085;
          background: var(--bg);
          color: #f4f5ef;
          min-height: 100vh;
          overflow: hidden;
        }

        .rocket-hero-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.65;
          animation: videoReveal 2s ease-out both;
          will-change: opacity, transform;
        }

        @keyframes videoReveal {
          from {
            opacity: 0;
            transform: scale(1.08);
          }
          to {
            opacity: 0.65;
            transform: scale(1);
          }
        }

        .launches-hero {
          position: relative;
          min-height: 570px;
          height: min(78vh, 760px);
          display: flex;
          align-items: center;
          padding: 80px 8%;
          overflow: hidden;
          background: #080a07;
        }

        .launches-hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          overflow: hidden;
        }

        .launches-hero-bg img,
        .launches-hero-bg video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.65;
        }

        .launches-hero-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(5, 7, 5, 0.96) 0%,
              rgba(5, 7, 5, 0.72) 48%,
              rgba(5, 7, 5, 0.12) 100%
            ),
            linear-gradient(
              0deg,
              #070807 0%,
              transparent 45%,
              rgba(0, 0, 0, 0.2) 100%
            );
        }

        .launches-hero-content {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 900px;
        }

        .launches-countdown {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(200, 255, 0, 0.45);
          color: var(--lime);
          padding: 10px 15px;
          margin-bottom: 26px;
          font-size: 12px;
          letter-spacing: 0.12em;
          background: rgba(10, 15, 5, 0.45);
        }

        .launches-hero-title {
          font-size: clamp(32px, 5.4vw, 70px);
          line-height: 1.12;
          letter-spacing: -0.035em;
          max-width: 850px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .launches-hero-subtitle {
          color: #b9beb0;
          font-size: 11px;
          letter-spacing: 0.13em;
          margin-top: 22px;
          line-height: 1.8;
        }

        .launches-watch-btn {
          display: inline-flex;
          align-items: center;
          gap: 28px;
          margin-top: 30px;
          padding: 15px 20px;
          color: #080a06;
          background: var(--lime);
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          border: 1px solid var(--lime);
          transition: all 0.2s ease;
        }

        .launches-watch-btn:hover {
          background: transparent;
          color: var(--lime);
          transform: translateY(-2px);
        }

        .launches-watch-btn span {
          font-size: 17px;
        }

        .hero-bottom-label {
          position: absolute;
          z-index: 1;
          bottom: 25px;
          left: 8%;
          right: 8%;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          color: #a0a496;
          font-size: 9px;
          letter-spacing: 0.12em;
        }

        .launches-container {
          width: min(1180px, 84%);
          margin: 0 auto;
          padding: 65px 0 100px;
        }

        .launches-section {
          margin-bottom: 90px;
          scroll-margin-top: 100px;
        }

        .past-section {
          margin-bottom: 20px;
        }

        .section-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 28px;
        }

        .section-eyebrow {
          margin: 0 0 12px;
          color: var(--lime);
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        .launches-section-title {
          font-size: clamp(23px, 3vw, 36px);
          line-height: 1.2;
          margin: 0;
          letter-spacing: -0.025em;
        }

        .section-count {
          flex-shrink: 0;
          color: var(--muted);
          font-size: 10px;
          letter-spacing: 0.08em;
          padding-bottom: 5px;
        }

        /* CAROUSEL */
        .launch-carousel {
          display: grid;
          grid-template-columns: 55px minmax(0, 1fr) 55px;
          align-items: center;
          gap: 20px;
          width: 100%;
          max-width: 850px;
          margin: 0 auto;
        }

        .carousel-stage {
          min-width: 0;
          perspective: 1200px;
        }

        .carousel-card {
          width: 100%;
          transform-style: preserve-3d;
          transform-origin: center;
          backface-visibility: hidden;
        }

        .carousel-card .launches-grid {
          display: block;
        }

        .carousel-card .launch-card {
          width: 100%;
          max-width: 620px;
          min-height: 440px;
          margin: 0 auto;
          padding: 0;
          overflow: hidden;
          border-radius: 14px;
          background: #10120f;
          border: 1px solid #292d24;
        }

        .carousel-card .launch-card-image-wrap {
          width: 100%;
          height: 230px;
          overflow: hidden;
        }

        .carousel-card .launch-card-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .carousel-card .launch-card:hover .launch-card-image {
          transform: scale(1.04);
        }

        .carousel-card .launch-card-top,
        .carousel-card .launch-card-content,
        .carousel-card .launch-card-bottom {
          margin-left: 24px;
          margin-right: 24px;
        }

        .carousel-card .launch-card-top {
          margin-top: 20px;
        }

        .carousel-card .launch-card-content {
          padding: 20px 0;
        }

        .carousel-card .launch-card-title {
          font-size: clamp(20px, 3vw, 28px);
          line-height: 1.35;
        }

        .carousel-card .launch-card-classification {
          font-size: 11px;
        }

        .carousel-card .launch-card-bottom {
          margin-bottom: 22px;
        }

        .carousel-arrow {
          width: 52px;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #41463a;
          border-radius: 50%;
          background: transparent;
          color: #f4f5ef;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .carousel-arrow:hover:not(:disabled) {
          background: var(--lime);
          color: #070807;
          border-color: var(--lime);
          transform: scale(1.06);
        }

        .carousel-arrow:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .carousel-enter-right {
          animation: flipInRight 0.55s ease both;
        }

        .carousel-enter-left {
          animation: flipInLeft 0.55s ease both;
        }

        .carousel-exit-left {
          animation: flipOutLeft 0.35s ease both;
        }

        .carousel-exit-right {
          animation: flipOutRight 0.35s ease both;
        }

        @keyframes flipInRight {
          from {
            opacity: 0;
            transform: rotateY(-65deg) translateX(45px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: rotateY(0) translateX(0) scale(1);
          }
        }

        @keyframes flipInLeft {
          from {
            opacity: 0;
            transform: rotateY(65deg) translateX(-45px) scale(0.92);
          }
          to {
            opacity: 1;
            transform: rotateY(0) translateX(0) scale(1);
          }
        }

        @keyframes flipOutLeft {
          from {
            opacity: 1;
            transform: rotateY(0) translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: rotateY(55deg) translateX(-45px) scale(0.92);
          }
        }

        @keyframes flipOutRight {
          from {
            opacity: 1;
            transform: rotateY(0) translateX(0) scale(1);
          }
          to {
            opacity: 0;
            transform: rotateY(-55deg) translateX(45px) scale(0.92);
          }
        }

        .carousel-progress {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 620px;
          margin: 24px auto 0;
          color: #9da293;
          font-size: 10px;
          letter-spacing: 0.1em;
        }

        .carousel-progress-track {
          flex: 1;
          height: 2px;
          background: #292d24;
          overflow: hidden;
        }

        .carousel-progress-fill {
          height: 100%;
          background: var(--lime);
          transition: width 0.35s ease;
        }

        /* VIEW MORE CARD */
        .view-more-carousel-card {
          width: 100%;
          max-width: 620px;
          min-height: 440px;
          margin: 0 auto;
          padding: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1px solid rgba(200, 255, 0, 0.35);
          border-radius: 14px;
          background:
            radial-gradient(
              circle at center,
              rgba(200, 255, 0, 0.12),
              transparent 65%
            ),
            #090b09;
          animation: viewMoreReveal 0.55s ease both;
        }

        @keyframes viewMoreReveal {
          from {
            opacity: 0;
            transform: rotateY(-45deg) scale(0.92);
          }
          to {
            opacity: 1;
            transform: rotateY(0) scale(1);
          }
        }

        .view-more-content h3 {
          margin: 18px 0;
          font-size: clamp(30px, 5vw, 52px);
          letter-spacing: 0.08em;
        }

        .view-more-label {
          color: var(--lime);
          font-size: 10px;
          letter-spacing: 0.15em;
        }

        .view-more-content p {
          color: #aaa;
          margin-bottom: 28px;
          font-size: 11px;
        }

        .view-more-action {
          border: 1px solid var(--lime);
          border-radius: 999px;
          padding: 13px 22px;
          background: var(--lime);
          color: #080a06;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .view-more-action:hover {
          background: transparent;
          color: var(--lime);
          transform: translateY(-2px);
        }

        /* PAST LAUNCHES GRID */
        .launches-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .launch-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 220px;
          padding: 22px;
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(200, 255, 0, 0.045),
              transparent 45%
            ),
            var(--card);
          border: 1px solid #252920;
          transition:
            border-color 0.25s ease,
            transform 0.25s ease,
            background 0.25s ease;
        }

        .launch-card:hover {
          border-color: rgba(247, 248, 245, 0.5);
          transform: translateY(-4px);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(246, 245, 245, 0.08),
              transparent 50%
            ),
            #12150f;
        }

        .launch-card-image-wrap {
          width: 100%;
          height: 160px;
          overflow: hidden;
          margin-bottom: 18px;
        }

        .launch-card-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .launch-card-title {
          font-family: "font-ethno", sans-serif;
          margin: 0;
          font-size: 17px;
          line-height: 1.45;
          letter-spacing: -0.015em;
          overflow-wrap: anywhere;
        }

        .launch-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .launch-card-index {
          color: #74796d;
          font-size: 11px;
          letter-spacing: 0.08em;
        }

        .launch-card-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 9px;
          letter-spacing: 0.08em;
        }

        .status-upcoming {
          color: var(--lime);
        }

        .status-past {
          color: #92978a;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          display: inline-block;
          border-radius: 50%;
          background: currentColor;
        }

        .launch-card-content {
          padding: 20px 0;
        }

        .launch-card-classification {
          margin: 12px 0 0;
          color: #92978a;
          font-size: 10px;
          line-height: 1.6;
          letter-spacing: 0.035em;
        }

        .launch-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding-top: 15px;
          border-top: 1px solid #292d24;
        }

        .launch-card-date-label {
          color: #7f8477;
          font-size: 9px;
          letter-spacing: 0.07em;
        }

        .launch-card-date {
          color: var(--lime);
          font-size: 11px;
          letter-spacing: 0.06em;
          text-align: right;
        }

        .past-card {
          opacity: 0.78;
        }

        .past-card .launch-card-date {
          color: #a9afa0;
        }

        .launches-empty {
          border: 1px dashed #34382e;
          color: #92978a;
          padding: 35px 25px;
          font-family: monospace;
          font-size: 12px;
          text-align: center;
        }

        .view-more-wrap {
          display: flex;
          justify-content: center;
          margin-top: 28px;
        }

        .view-more-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          min-width: 190px;
          padding: 15px 20px;
          border: 1px solid #34392c;
          background: transparent;
          color: #e7e9df;
          font-size: 10px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-more-btn:hover {
          border-color: var(--lime);
          color: var(--lime);
          background: rgba(200, 255, 0, 0.04);
        }

        .view-more-btn span {
          font-size: 16px;
          color: var(--lime);
        }

        @media (max-width: 1000px) {
          .launches-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .launches-container {
            width: 88%;
          }

          .launches-hero {
            padding-left: 6%;
            padding-right: 6%;
          }

          .hero-bottom-label {
            left: 6%;
            right: 6%;
          }
        }

        @media (max-width: 600px) {
          .launches-hero {
            min-height: 530px;
            height: 72vh;
            padding: 70px 6%;
          }

          .launches-hero-title {
            font-size: clamp(30px, 9vw, 48px);
          }

          .launches-hero-subtitle {
            font-size: 9px;
          }

          .hero-bottom-label {
            font-size: 8px;
            bottom: 18px;
          }

          .launches-container {
            width: 90%;
            padding-top: 45px;
            padding-bottom: 65px;
          }

          .launches-section {
            margin-bottom: 65px;
          }

          .section-heading-row {
            align-items: flex-start;
          }

          .launches-section-title {
            font-size: 23px;
          }

          .section-count {
            font-size: 9px;
            padding-top: 5px;
          }

          .launch-carousel {
            grid-template-columns: 36px minmax(0, 1fr) 36px;
            gap: 8px;
          }

          .carousel-arrow {
            width: 36px;
            height: 36px;
            font-size: 18px;
          }

          .carousel-card .launch-card {
            min-height: 390px;
          }

          .carousel-card .launch-card-image-wrap {
            height: 180px;
          }

          .carousel-card .launch-card-top,
          .carousel-card .launch-card-content,
          .carousel-card .launch-card-bottom {
            margin-left: 16px;
            margin-right: 16px;
          }

          .carousel-card .launch-card-title {
            font-size: 19px;
          }

          .view-more-carousel-card {
            min-height: 390px;
            padding: 20px;
          }

          .carousel-progress {
            gap: 8px;
            font-size: 8px;
          }

          .launches-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .launch-card {
            min-height: 190px;
            padding: 20px;
          }

          .launch-card-title {
            font-size: 16px;
          }

          .view-more-btn {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel-card,
          .view-more-carousel-card,
          .rocket-hero-video {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
          /* FIX: FULL IMAGE VISIBLE IN UPCOMING CAROUSEL CARD */

.carousel-card .launch-card {
  position: relative !important;
  isolation: isolate;
  overflow: hidden;

  min-height: 440px;
  padding: 24px;

  background: transparent !important;
}

/* Image full card background */
.carousel-card .launch-card-image-wrap {
  position: absolute !important;
  inset: 0 !important;

  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;

  z-index: 0 !important;
}

.carousel-card .launch-card-image {
  display: block;
  width: 100% !important;
  height: 100% !important;

  object-fit: cover !important;
  object-position: center !important;
}

/* Gradient over image */
.carousel-card .launch-card::after {
  content: "";
  position: absolute;
  inset: 0;

  z-index: 1;
  pointer-events: none;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.15) 55%,
    transparent
  );
}

/* All card details above image */
.carousel-card .launch-card-top,
.carousel-card .launch-card-content,
.carousel-card .launch-card-bottom {
  position: relative !important;
  z-index: 2 !important;

  margin-left: 0 !important;
  margin-right: 0 !important;
}

.carousel-card .launch-card-content {
  margin-top: auto !important;
  padding: 20px 0 12px !important;
  background: transparent !important;
}

.carousel-card .launch-card-bottom {
  padding-top: 14px;
  background: transparent !important;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}

.carousel-card .launch-card-title,
.carousel-card .launch-card-date {
  color: #fff !important;
}

.carousel-card .launch-card-classification,
.carousel-card .launch-card-date-label {
  color: rgba(255, 255, 255, 0.8) !important;
}

@media (max-width: 600px) {
  .carousel-card .launch-card {
    min-height: 390px;
    padding: 18px;
  }
}
  /* =========================================
   PAST LAUNCHES — FULL IMAGE CARD DESIGN
   Grid layout remains unchanged
========================================= */

/* Card */
.launches-grid .past-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  min-height: 300px;
  padding: 20px;

  background: #10120f !important;
  border: 1px solid #292d24;
  border-radius: 14px;

  opacity: 1;
}

/* Full-card background image */
.launches-grid .past-card .launch-card-image-wrap {
  position: absolute;
  inset: 0;

  width: 100%;
  height: 100%;
  margin: 0;

  overflow: hidden;
  z-index: 0;
}

/* Image fills the card */
.launches-grid .past-card .launch-card-image {
  display: block;

  width: 100%;
  height: 100%;

  object-fit: cover;
  object-position: center;

  transition: transform 0.6s ease;
}

/* Light black gradient for readable text */
.launches-grid .past-card::after {
  content: "";
  position: absolute;
  inset: 0;

  z-index: 1;
  pointer-events: none;

  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.35) 45%,
    rgba(0, 0, 0, 0.08) 100%
  );
}

/* Details appear above the image */
.launches-grid .past-card .launch-card-top,
.launches-grid .past-card .launch-card-content,
.launches-grid .past-card .launch-card-bottom {
  position: relative;
  z-index: 2;

  margin-left: 0;
  margin-right: 0;
}

/* Top index and status */
.launches-grid .past-card .launch-card-top {
  margin-top: 0;
}

/* Title and classification at bottom */
.launches-grid .past-card .launch-card-content {
  margin-top: auto;
  padding: 20px 0 12px;

  background: transparent;
}

/* Title */
.launches-grid .past-card .launch-card-title {
  color: #fff;
  font-size: clamp(18px, 2vw, 25px);
  line-height: 1.25;

  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);
}

/* Classification */
.launches-grid .past-card .launch-card-classification {
  color: rgba(255, 255, 255, 0.85);
}

/* Date details */
.launches-grid .past-card .launch-card-bottom {
  padding-top: 14px;

  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.35);
}

.launches-grid .past-card .launch-card-date-label {
  color: rgba(255, 255, 255, 0.7);
}

.launches-grid .past-card .launch-card-date {
  color: #fff;
}

/* Hover */
.launches-grid .past-card:hover {
  border-color: var(--lime);
  transform: translateY(-4px);
}

.launches-grid .past-card:hover .launch-card-image {
  transform: scale(1.05);
}

/* Mobile */
@media (max-width: 600px) {
  .launches-grid .past-card {
    min-height: 280px;
    padding: 16px;
  }

  .launches-grid .past-card .launch-card-title {
    font-size: 20px;
  }
}
  /* Center Upcoming Launches heading */
.launches-section:first-of-type .section-heading-row {
  position: relative;
  justify-content: center;
  text-align: center;
}

.launches-section:first-of-type .launches-section-title {
  width: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
      `}</style>
    </>
  );
}