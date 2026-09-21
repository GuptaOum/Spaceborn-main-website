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
    image: 'https://res.cloudinary.com/bidpa4j5/image/upload/v1789974122/WhatsApp_Image_2026-08-03_at_6.52.03_PM_1.jpg',
  },
  {
  project: "VISIONWS",
  classification: "Robotics & Simulation",
  date: "4 SEP",
  image: "https://res.cloudinary.com/bidpa4j5/image/upload/v1789973902/WhatsApp_Image_2026-08-03_at_6.52.09_PM_1.jpg"
},
  {
    project: 'H7',
    classification: 'Hardware',
    date: '5 SEP',
    image:'https://res.cloudinary.com/bidpa4j5/image/upload/v1789973902/WhatsApp_Image_2026-08-03_at_6.52.07_PM.jpg'
  },
  {
    project: 'Power & Battery Simulator',
    classification: 'Robotics & Simulation',
    date: '6 SEP',
  },
  {
    project: 'Control Stack Validation v2',
    classification: 'Control Logic',
    date: '7 SEP',
  },
  {
    project: 'DERYK Website',
    classification: 'Platform & DevOps',
    date: '11 SEP',
  },
  {
    project: 'Security Runtime',
    classification: 'FSM',
    date: '12 SEP',
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

const INITIAL_VISIBLE_COUNT = 6;

export default function LaunchesPage() {
  const [upcomingLaunches, setUpcomingLaunches] =
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

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isComingSoon, setIsComingSoon] = useState(true);

  // Optional external JSON data for past launches
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const url = process.env.NEXT_PUBLIC_LAUNCHES_JSON_URL;

      if (!url) return;

      try {
        const fetchUrl = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;

        const response = await fetch(fetchUrl, {
          cache: 'no-store',
        });

        if (!response.ok) {
          console.error('Failed to fetch launches:', response.status);
          return;
        }

        const json = await response.json();

        if (!Array.isArray(json) || json.length === 0 || !isMounted) {
          return;
        }

        const now = Date.now();

        const past: LaunchData[] = [];

        json.forEach((launch: LaunchData) => {
          const targetTime = launch.targetUtc
            ? new Date(launch.targetUtc).getTime()
            : new Date(launch.date).getTime();

          if (!Number.isNaN(targetTime) && targetTime < now) {
            past.push(launch);
          }
        });

        if (isMounted) {
          setPastLaunches(sortLaunches(past, false));
        }
      } catch (error) {
        console.error('Failed to load launches JSON:', error);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Countdown uses the first valid target from the existing launch data.
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

    const targetDate = new Date(firstLaunch.targetUtc).getTime();

    setIsComingSoon(false);

    const updateCountdown = () => {
      const distance = targetDate - Date.now();

      if (distance <= 0) {
        setIsComingSoon(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor(
          (distance % (1000 * 60 * 60)) / (1000 * 60)
        ),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [upcomingLaunches]);

  const formatUnit = (unit: number) =>
    unit.toString().padStart(2, '0');

  const visibleUpcoming = showAllUpcoming
    ? upcomingLaunches
    : upcomingLaunches.slice(0, INITIAL_VISIBLE_COUNT);

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
            className={`launch-card ${isPast ? 'past-card' : ''}`}
            key={`${launch.project}-${launch.date}-${index}`}
          >
           
 <img
  className="launch-card-image"
  src={launch.image || "https://res.cloudinary.com/dq9x4mk1y/image/upload/w_2000,h_1200,c_fill/v1782859776/WhatsApp_Image_2026-06-30_at_19.48.56_g8owa7.jpg"}
  alt={launch.project}
  loading="lazy"
/>
            <div className="launch-card-top">
              <span className="launch-card-index font-mono">
                {String(index + 1).padStart(2, '0')}
              </span>

              <span
                className={`launch-card-status font-mono ${
                  isPast ? 'status-past' : 'status-upcoming'
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
  src="Spaceborn-main-website\app\launches\swarm fleet 1.mp4"
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
                  )}:${formatUnit(timeLeft.minutes)}:${formatUnit(
                    timeLeft.seconds
                  )}`}
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
                  01 / MISSION SCHEDULE
                </p>

                <h2 className="launches-section-title font-ethno">
                  UPCOMING LAUNCHES
                </h2>
              </div>

              <span className="section-count font-mono">
                {String(upcomingLaunches.length).padStart(2, '0')} ITEMS
              </span>
            </div>

            {renderLaunchCards(visibleUpcoming, false)}

            {upcomingLaunches.length > INITIAL_VISIBLE_COUNT && (
              <div className="view-more-wrap">
                <button
                  type="button"
                  className="view-more-btn font-mono"
                  onClick={() =>
                    setShowAllUpcoming((previous) => !previous)
                  }
                >
                  {showAllUpcoming
                    ? 'VIEW LESS'
                    : `VIEW MORE  (+${
                        upcomingLaunches.length -
                        INITIAL_VISIBLE_COUNT
                      })`}

                  <span>{showAllUpcoming ? '↑' : '↓'}</span>
                </button>
              </div>
            )}
          </section>

          {/* PAST LAUNCHES */}
          <section className="launches-section past-section">
            <div className="section-heading-row">
              <div>
                <p className="section-eyebrow font-mono">
                  02 / MISSION ARCHIVE
                </p>

                <h2 className="launches-section-title font-ethno">
                  PAST LAUNCHES
                </h2>
              </div>

              <span className="section-count font-mono">
                {String(pastLaunches.length).padStart(2, '0')} ITEMS
              </span>
            </div>

            {renderLaunchCards(
              visiblePast as LaunchCardData[],
              true
            )}

            {pastLaunches.length > INITIAL_VISIBLE_COUNT && (
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

                  <span>{showAllPast ? '↑' : '↓'}</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer isHome={false} />

      {/* PAGE STYLES */}
      <style >{`
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
.launches-hero-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
        .launches-hero-title {
          font-size: clamp(32px, 5.4vw, 70px);
          line-height: 1.12;
          letter-spacing: -0.035em;
          max-width: 850px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .launch-card-image-wrap {
  height: 120px; /* Pehle 190px tha */
}

.launch-card {
  min-height: 180px;
  padding: 16px;
}

.launch-card-content {
  padding: 10px 0;
  
}
  .launch-card-image-wrap {
  width: 100%;
  height: 200px;
  overflow: hidden;
  
}

.launch-card-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: overflow;
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
          transition:
            background 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease;
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
          border-color: rgba(247, 248, 245, 0.97);
          transform: translateY(-4px);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(246, 245, 245, 0.93),
              transparent 50%
            ),
            #12150f;
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
          padding: 25px 0;
        }

        .launch-card-title {
          margin: 0;
          font-size: 17px;
          line-height: 1.45;
          letter-spacing: -0.015em;
          overflow-wrap: anywhere;
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
      `}</style>
    </>
  );
}