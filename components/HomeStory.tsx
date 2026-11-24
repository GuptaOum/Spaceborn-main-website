"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import styles from "./HomeStory.module.css";

/* Scroll progress through a section, measured from the live layout on every
   frame that scrolls, so content loading above it never skews it.
   pinned: 0 when the top reaches the top of the screen, 1 when the bottom
   reaches the bottom. Otherwise: 0 when the top enters, 1 when the bottom leaves. */
function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  pinned: boolean,
) {
  const progress = useMotionValue(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = pinned
        ? -rect.top / Math.max(1, el.offsetHeight - vh)
        : (vh - rect.top) / (vh + el.offsetHeight);
      progress.set(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, progress, pinned]);
  return progress;
}

const EASE = [0.23, 1, 0.32, 1] as const;
const VIEW = { once: true, amount: 0, margin: "0px 0px 10% 0px" } as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
  }),
};

function Rise({
  children,
  className,
  i = 0,
}: {
  children: ReactNode;
  className?: string;
  i?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={rise}
      initial="hidden"
      whileInView="shown"
      viewport={VIEW}
      custom={i}
    >
      {children}
    </motion.div>
  );
}

/* ───────────── Intro: what Spaceborn is, in one breath ───────────── */

function Intro() {
  return (
    <section className={styles.intro} aria-labelledby="story-intro">
      <Rise>
        <h2 id="story-intro" className={styles.statement}>
          The full stack for autonomous machines.
        </h2>
      </Rise>
      <Rise i={1}>
        <p className={styles.lede}>
          Spaceborn designs the compute boards, the operating system and the
          mission AI as one system, so machines can sense, decide and act on
          their own.
        </p>
      </Rise>
    </section>
  );
}

/* ───────────── Hardware, software, AI → one stack (exploded view) ───────────── */

type Mark = {
  name: string;
  logo?: { src: string; width: number; height: number };
};

const LAYERS: { category: string; detail: string; marks: Mark[] }[] = [
  {
    category: "AI",
    detail: "Mission cognition that turns operator intent into machine action.",
    marks: [
      {
        name: "DERYK",
        logo: { src: "/images/deryk-wordmark.png", width: 480, height: 62 },
      },
    ],
  },
  {
    category: "Software",
    detail: "The operating system, the simulator and the ground station.",
    marks: [
      { name: "ANSA" },
      { name: "Certanity" },
      { name: "Mission Studio" },
    ],
  },
  {
    category: "Hardware",
    detail: "Flight controllers, motor ESCs, edge compute and airframes.",
    marks: [
      {
        name: "Spaceborn",
        logo: { src: "/images/spaceborn-logo.png", width: 521, height: 66 },
      },
      { name: "ELARA" },
      { name: "ARIA" },
    ],
  },
];

function Marks({ marks }: { marks: Mark[] }) {
  return (
    <span className={styles.marks}>
      {marks.map((m) =>
        m.logo ? (
          <img
            key={m.name}
            className={styles.markLogo}
            src={m.logo.src}
            alt={m.name}
            width={m.logo.width}
            height={m.logo.height}
            decoding="async"
          />
        ) : (
          <span key={m.name} className={styles.markText}>
            {m.name}
          </span>
        ),
      )}
    </span>
  );
}

/* Timeline of the scene, as fractions of its scroll:
   0.00–0.48  three separate, out-of-focus panels drift together, sharpen and
              fuse into one machined block (their inner corners close up)
   0.48–0.64  a single light catches the finished block
   0.54–0.78  each layer fills in with its products
   then the finished stack scrolls away with the page
   The spread is measured from the room left under the copy, so the panels
   never cross the text, whatever the screen height. */
const R = 14; // corner radius of a panel, and of the finished block

function Slab({
  layer,
  progress,
  i,
  gap,
}: {
  layer: (typeof LAYERS)[number];
  progress: MotionValue<number>;
  i: number;
  gap: number;
}) {
  const outer = i !== 1;
  const spread = (i - 1) * (gap + 16); // px apart while separate: top, middle, bottom
  const closeEnd = 0.48;

  const y = useTransform(progress, [0, closeEnd], [spread, 0]);
  const scale = useTransform(progress, [0, closeEnd], [outer ? 0.94 : 0.97, 1]);
  const opacity = useTransform(progress, [0, closeEnd], [outer ? 0.5 : 0.75, 1]);
  const blur = useTransform(
    progress,
    [0, closeEnd * 0.85],
    [outer ? 6 : 2, 0],
    { clamp: true },
  );
  const filter = useTransform(blur, (b) => (b > 0.05 ? `blur(${b}px)` : "none"));
  // The corners where two panels meet close to square, so three become one.
  const seam = useTransform(progress, [closeEnd - 0.08, closeEnd], [R, 0]);
  const borderRadius = useTransform(seam, (s) =>
    i === 0
      ? `${R}px ${R}px ${s}px ${s}px`
      : i === 2
        ? `${s}px ${s}px ${R}px ${R}px`
        : `${s}px`,
  );
  const reveal = useTransform(
    progress,
    [0.54 + i * 0.06, 0.66 + i * 0.06],
    [0, 1],
  );
  const revealX = useTransform(reveal, [0, 1], ["-12px", "0px"]);

  return (
    <motion.div
      className={styles.slab}
      style={{ y, scale, opacity, filter, borderRadius }}
    >
      <span className={styles.slabCategory}>{layer.category}</span>
      <motion.span
        className={styles.slabBody}
        style={{ opacity: reveal, x: revealX }}
      >
        <Marks marks={layer.marks} />
        <span className={styles.slabDetail}>{layer.detail}</span>
      </motion.span>
    </motion.div>
  );
}

function OneStack() {
  const ref = useRef<HTMLElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const raw = useSectionProgress(ref, true);
  // A light spring takes the jitter out of wheel scrolling without lagging behind.
  const progress = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.35 });

  // How far the outer layers can travel before touching the copy or the screen edge.
  const [gap, setGap] = useState(0);
  useEffect(() => {
    const room = roomRef.current;
    const stack = stackRef.current;
    if (!room || !stack) return;
    const measure = () => {
      const spare = room.clientHeight - stack.offsetHeight;
      setGap(Math.max(0, Math.min(220, spare / 2)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(room);
    ro.observe(stack);
    return () => ro.disconnect();
  }, [reduce]);

  const problemOpacity = useTransform(progress, [0, 0.4, 0.5], [1, 1, 0]);
  const problemY = useTransform(progress, [0.4, 0.5], ["0px", "-24px"]);
  const answerOpacity = useTransform(progress, [0.52, 0.62], [0, 1]);
  const answerY = useTransform(progress, [0.52, 0.62], ["24px", "0px"]);
  // Whichever copy is faded out is hidden outright, so it never sits under the other.
  const problemVis = useTransform(problemOpacity, (o) =>
    o > 0.01 ? "visible" : "hidden",
  );
  const answerVis = useTransform(answerOpacity, (o) =>
    o > 0.01 ? "visible" : "hidden",
  );
  // One light sweeps across the block the moment it is whole.
  const sheenX = useTransform(progress, [0.48, 0.64], ["-60%", "160%"]);
  const sheenOpacity = useTransform(
    progress,
    [0.46, 0.5, 0.6, 0.64],
    [0, 1, 1, 0],
  );

  if (reduce) {
    return (
      <section className={styles.block} aria-labelledby="story-stack">
        <h2 id="story-stack" className={styles.headline}>
          One stack, designed together.
        </h2>
        <p className={styles.body}>
          Hardware, software and AI usually come from different teams with
          different toolchains. Spaceborn designs all three together.
        </p>
        <div className={styles.slabs}>
          {LAYERS.map((l) => (
            <div key={l.category} className={styles.slab}>
              <span className={styles.slabCategory}>{l.category}</span>
              <span className={styles.slabBody}>
                <Marks marks={l.marks} />
                <span className={styles.slabDetail}>{l.detail}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={styles.scene} aria-labelledby="story-stack">
      <div className={styles.stage}>
        <div className={styles.sceneHead}>
          <motion.div
            className={styles.sceneCopy}
            style={{
              opacity: problemOpacity,
              y: problemY,
              visibility: problemVis,
            }}
          >
            <h2 id="story-stack" className={styles.headline}>
              Three disciplines, built apart.
            </h2>
            <p className={styles.body}>
              Most machines are stitched together: a flight controller from one
              vendor, software from another, AI from a third. Every new machine
              starts that integration over.
            </p>
          </motion.div>
          <motion.div
            className={styles.sceneCopy}
            style={{
              opacity: answerOpacity,
              y: answerY,
              visibility: answerVis,
            }}
            aria-hidden="true"
          >
            <p className={styles.headline}>One stack, designed together.</p>
            <p className={styles.body}>
              Spaceborn builds all three, so every layer is made for the one
              beneath it.
            </p>
          </motion.div>
        </div>

        <div ref={roomRef} className={styles.slabRoom} aria-hidden="true">
          <div ref={stackRef} className={styles.slabs}>
            {LAYERS.map((l, i) => (
              <Slab
                key={l.category}
                layer={l}
                progress={progress}
                i={i}
                gap={gap}
              />
            ))}
            <motion.span className={styles.sheen} style={{ opacity: sheenOpacity }}>
              <motion.span className={styles.sheenBand} style={{ x: sheenX }} />
            </motion.span>
          </div>
        </div>

        <p className={styles.srOnly}>
          Spaceborn builds one stack. AI: DERYK. Software: ANSA, Certanity and
          Mission Studio. Hardware: Spaceborn ELARA flight controllers and ARIA
          ESCs.
        </p>
      </div>
    </section>
  );
}

// Positions are percentages of the full 16:9 picture.
const DRONES = [
  {
    src: "/images/vision/drone-1.png",
    left: 7.75,
    top: 40.667,
    width: 8.875,
    drift: 1.6,
    bob: 6,
    dur: 4.6,
  },
  {
    src: "/images/vision/drone-2.png",
    left: 18.375,
    top: 48.667,
    width: 4,
    drift: 2,
    bob: 4,
    dur: 3.8,
  },
  {
    src: "/images/vision/drone-3.png",
    left: 82.625,
    top: 41.444,
    width: 6.875,
    drift: -1.4,
    bob: 5,
    dur: 5.2,
  },
];


function Hover({
  src,
  drift,
  bob,
  dur,
}: {
  src: string;
  drift: number;
  bob: number;
  dur: number;
}) {
  return (
    <motion.img
      src={src}
      alt=""
      className={styles.droneImg}
      animate={{
        x: ["0%", `${drift * 10}%`, "0%"],
        y: [0, -bob, 0, bob * 0.6, 0],
        rotate: [0, drift > 0 ? 1.5 : -1.5, 0, drift > 0 ? -1 : 1, 0],
      }}
      transition={{
        x: { duration: dur * 4, repeat: Infinity, ease: "easeInOut" },
        y: { duration: dur, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: dur * 1.3, repeat: Infinity, ease: "easeInOut" },
      }}
    />
  );
}

/* ───────────── Vision: the deck's closing picture, full screen ─────────────
   Rebuilt from the full slide with its baked-in title and logos removed, so it
   can fill the screen. As the visitor scrolls, the camera eases back, the
   golden-hour light warms, the robots' lights come on and the copy settles
   into the open sky, where the deck's own title sat. */
function Vision() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const raw = useSectionProgress(ref, true);
  const progress = useSpring(raw, { stiffness: 140, damping: 28, mass: 0.35 });

  const sceneScale = useTransform(progress, [0, 1], [1.18, 1]);
  const sceneY = useTransform(progress, [0, 1], ["3%", "0%"]);
  const cool = useTransform(progress, [0, 0.45], [0.38, 0]);
  const glowScale = useTransform(progress, [0, 0.7], [0.7, 1.3]);
  const glowOpacity = useTransform(progress, [0, 0.7], [0.3, 1]);
  const copyOpacity = useTransform(progress, [0.12, 0.32], [0, 1]);
  const copyY = useTransform(progress, [0.12, 0.32], ["28px", "0px"]);

  const copy = (
    <>
      <h2 id="story-vision" className={styles.visionTitle}>
        A future where every life belongs.
      </h2>
      <p className={styles.visionBody}>Machines that work beside people.</p>
    </>
  );

  const picture = (
    <div className={styles.visionPicture}>
      {reduce ? (
        <img
          src="/images/vision/vision-poster.webp"
          alt="A family, a humanoid robot, a robot dog and drones watching the sunset over a city"
          width={1344}
          height={768}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <video
          src="/images/vision/vision-loop.mp4"
          poster="/images/vision/vision-poster.webp"
          aria-label="A family, a humanoid robot, a robot dog and drones watching the sunset over a city"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
        />
      )}
    </div>
  );

  const drones = DRONES.map((d) => (
    <div
      key={d.src}
      className={styles.drone}
      style={{ left: `${d.left}%`, top: `${d.top}%`, width: `${d.width}%` }}
    >
      {reduce ? (
        <img src={d.src} alt="" className={styles.droneImg} />
      ) : (
        <Hover src={d.src} drift={d.drift} bob={d.bob} dur={d.dur} />
      )}
    </div>
  ));

  if (reduce) {
    return (
      <section
        className={`${styles.vision} ${styles.visionStatic}`}
        aria-labelledby="story-vision"
      >
        <div className={styles.visionStage}>
          <div className={styles.visionLayers}>
            {picture}
            {drones}
          </div>
          <div className={styles.visionCopy}>{copy}</div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className={styles.vision} aria-labelledby="story-vision">
      <div className={styles.visionStage}>
        <motion.div
          className={styles.visionLayers}
          style={{ scale: sceneScale, y: sceneY }}
        >
          {picture}
          <motion.span
            className={styles.sunGlow}
            aria-hidden="true"
            style={{ scale: glowScale, opacity: glowOpacity }}
          />
          <motion.div
            className={styles.cool}
            aria-hidden="true"
            style={{ opacity: cool }}
          />
          {drones}
        </motion.div>
        <motion.div
          className={styles.visionCopy}
          style={{ opacity: copyOpacity, y: copyY }}
        >
          {copy}
        </motion.div>
      </div>
    </section>
  );
}

export default function HomeStory() {
  return (
    <div className={styles.story}>
      <Intro />
      <OneStack />
      <Vision />
    </div>
  );
}
