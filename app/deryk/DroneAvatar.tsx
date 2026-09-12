'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

const propellers = [
  { x: 96, y: 94, tone: '#06D4F5', delay: 0 },
  { x: 304, y: 94, tone: '#39D89B', delay: -0.3 },
  { x: 96, y: 238, tone: '#F05252', delay: -0.6 },
  { x: 304, y: 238, tone: '#06D4F5', delay: -0.9 },
];

export default function DroneAvatar() {
  const frameRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [5, -5]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-6, 6]), { stiffness: 120, damping: 18 });
  const translateX = useSpring(useTransform(pointerX, [-1, 1], [-10, 10]), { stiffness: 100, damping: 24 });
  const translateY = useSpring(useTransform(pointerY, [-1, 1], [-8, 8]), { stiffness: 100, damping: 24 });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const move = (event: PointerEvent) => {
      const bounds = frame.getBoundingClientRect();
      pointerX.set((event.clientX - bounds.left) / bounds.width * 2 - 1);
      pointerY.set((event.clientY - bounds.top) / bounds.height * 2 - 1);
    };
    const leave = () => { pointerX.set(0); pointerY.set(0); };
    frame.addEventListener('pointermove', move, { passive: true });
    frame.addEventListener('pointerleave', leave, { passive: true });
    return () => {
      frame.removeEventListener('pointermove', move);
      frame.removeEventListener('pointerleave', leave);
    };
  }, [pointerX, pointerY]);

  return <div className="drone-avatar" ref={frameRef} aria-label="Animated autonomous DERYK drone visualization" role="img">
    <motion.svg viewBox="0 0 400 330" className="drone-avatar-svg" style={{ x: translateX, y: translateY, rotateX, rotateY }}>
      <defs>
        <filter id="drone-glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        <filter id="drone-soft-glow"><feGaussianBlur stdDeviation="11" /></filter>
        <linearGradient id="drone-shell" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ffffff" /><stop offset=".55" stopColor="#cad8e6" /><stop offset="1" stopColor="#7389a1" /></linearGradient>
        <linearGradient id="drone-arm" x1="0" x2="1"><stop stopColor="#1b344b" /><stop offset=".5" stopColor="#7e9bb5" /><stop offset="1" stopColor="#17283a" /></linearGradient>
        <radialGradient id="core-glow"><stop stopColor="#ffffff" /><stop offset=".28" stopColor="#06D4F5" stopOpacity=".95" /><stop offset="1" stopColor="#06D4F5" stopOpacity="0" /></radialGradient>
      </defs>

      <motion.g className="drone-radar" animate={{ rotate: 360 }} transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        {[70, 103, 138].map((radius) => <circle key={radius} cx="200" cy="166" r={radius} fill="none" stroke="#06D4F5" strokeOpacity={radius === 138 ? .13 : .22} strokeDasharray={radius === 138 ? '2 12' : '1 8'} />)}
        <path d="M200 166 L200 27 A139 139 0 0 1 287 58 Z" fill="url(#core-glow)" opacity=".18" />
      </motion.g>

      <motion.g className="drone-orbits" animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        <circle cx="200" cy="166" r="154" fill="none" stroke="#6495ED" strokeOpacity=".14" strokeDasharray="1 27" />
        <circle cx="46" cy="166" r="3" fill="#06D4F5" filter="url(#drone-glow)" />
        <circle cx="354" cy="166" r="2" fill="#F59E0B" filter="url(#drone-glow)" />
        <circle cx="200" cy="12" r="2" fill="#39D89B" filter="url(#drone-glow)" />
      </motion.g>

      <motion.ellipse cx="200" cy="277" rx="99" ry="13" fill="#06D4F5" opacity=".12" filter="url(#drone-soft-glow)" animate={{ rx: [88, 103, 88], opacity: [.1, .2, .1] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} />

      <g className="drone-airframe">
        {propellers.map((propeller) => <g key={`${propeller.x}-${propeller.y}`} transform={`translate(${propeller.x} ${propeller.y})`}>
          <circle r="22" fill="#08121d" stroke="#58738d" strokeWidth="1" />
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear', delay: propeller.delay }}>
            <path d="M0 -4 C-30 -20 -32 -6 -4 2 C-32 10 -30 24 0 5 C30 24 32 10 4 2 C32 -6 30 -20 0 -4Z" fill={propeller.tone} opacity=".58" filter="url(#drone-glow)" />
          </motion.g>
          <circle r="5" fill="#16324a" stroke={propeller.tone} strokeWidth="1.5" />
          <circle r="2" fill={propeller.tone} filter="url(#drone-glow)" />
        </g>)}
        <path d="M112 112 L156 144 M288 112 L244 144 M112 222 L156 190 M288 222 L244 190" stroke="url(#drone-arm)" strokeWidth="12" strokeLinecap="round" />
        <path d="M112 112 L156 144 M288 112 L244 144 M112 222 L156 190 M288 222 L244 190" stroke="#9DB3C8" strokeOpacity=".28" strokeWidth="2" />
        <path d="M150 147 Q200 119 250 147 L264 192 Q200 224 136 192Z" fill="url(#drone-shell)" stroke="#F8FAFC" strokeOpacity=".65" strokeWidth="2" />
        <path d="M163 154 Q200 139 237 154 L230 181 Q200 195 170 181Z" fill="#17283A" stroke="#BDEBFA" strokeOpacity=".35" />
        <motion.ellipse cx="200" cy="166" rx="19" ry="14" fill="url(#core-glow)" filter="url(#drone-glow)" animate={{ rx: [16, 21, 16], opacity: [.72, 1, .72] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }} />
        <circle cx="200" cy="166" r="6" fill="#F8FAFC" />
        <path d="M178 191 L222 191 L215 220 L185 220Z" fill="#192D42" stroke="#718EA7" strokeWidth="1" />
        <path d="M187 220 L213 220 L207 237 L193 237Z" fill="#0B1C2B" stroke="#06D4F5" strokeOpacity=".7" />
        <circle cx="200" cy="229" r="3" fill="#06D4F5" filter="url(#drone-glow)" />
        <path d="M200 139 L200 120 M194 120 L206 120" stroke="#BFD4E7" strokeWidth="2" strokeLinecap="round" />
        <circle cx="200" cy="117" r="4" fill="#06D4F5" filter="url(#drone-glow)" />
        <circle cx="128" cy="128" r="3" fill="#06D4F5" filter="url(#drone-glow)" />
        <circle cx="272" cy="128" r="3" fill="#39D89B" filter="url(#drone-glow)" />
        <circle cx="128" cy="206" r="3" fill="#F05252" filter="url(#drone-glow)" />
        <circle cx="272" cy="206" r="3" fill="#06D4F5" filter="url(#drone-glow)" />
      </g>
    </motion.svg>
    <div className="drone-hud hud-gate"><span><i /> GATE READY</span><strong>99.98%</strong></div>
    <div className="drone-hud hud-gps"><span>GPS LOCK</span><strong>18 SATELLITES</strong></div>
    <div className="drone-hud hud-mission"><span>MISSION</span><strong>OPIP-2048</strong></div>
    <div className="drone-hud hud-altitude"><span>ALTITUDE</span><strong>124.6 m</strong></div>
    <div className="drone-hud hud-latency"><span>LATENCY</span><strong>018 ms</strong></div>
  </div>;
}
