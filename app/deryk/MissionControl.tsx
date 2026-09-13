'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, CircleDot, LockKeyhole, Network, Radio, ShieldCheck, Terminal, Waves, Zap } from 'lucide-react';
import './mission-control.css';

const lifecycle = [
  { key: 'plan', label: 'PLAN', title: 'Turn intent into a mission.', copy: 'An operator describes the objective. DERYK structures the request into a mission contract without touching a vehicle.', icon: Terminal },
  { key: 'validate', label: 'VALIDATE', title: 'Make the boundary explicit.', copy: 'The proposed route is checked against declared constraints. The Safety Judge can advise; the EnforcementGate decides.', icon: ShieldCheck },
  { key: 'execute', label: 'EXECUTE', title: 'Carry the approved contract.', copy: 'The execution backend receives only what the deterministic gate allowed. Simulator first, compatible hardware later.', icon: Zap },
  { key: 'observe', label: 'OBSERVE', title: 'Keep the signal honest.', copy: 'Telemetry moves to the analytics logbook. Measured values stay distinct from fields the connector cannot report.', icon: Radio },
  { key: 'replay', label: 'REPLAY', title: 'Remember what happened.', copy: 'Every mission becomes a queryable record: decisions, events, durations, and the signals that actually existed.', icon: Waves },
] as const;

const faqs = [
  ['Why is the LLM read-only?', 'A model can reason about intent without being trusted with vehicle motion. Read-only tools preserve the invariant that every action passes through the deterministic gate.'],
  ['What is EnforcementGate?', 'It is the LLM-free decision boundary between a proposed mission and execution. It evaluates the contract and returns an explicit allow or block.'],
  ['What are capability masks?', 'A connector declares which telemetry fields it genuinely measures. DERYK reports the rest as Not Measured instead of turning missing data into a fabricated zero.'],
  ['Can DERYK control real drones?', 'DERYK is connector-based: the same mission loop can target a simulator today and hardware through a compatible execution backend.'],
  ['How is telemetry stored?', 'Completed flights are exported to a shared analytics logbook, tagged by source so autonomous runs remain queryable and comparable with manual flights.'],
];

function Mark() { return <span className="mc-mark" aria-hidden="true"><i /><i /><i /></span>; }

function AirspaceMap({ compact = false }: { compact?: boolean }) {
  return <div className={`airspace-map ${compact ? 'compact' : ''}`}>
    <svg viewBox="0 0 700 390" role="img" aria-label="Conceptual mission route visualization">
      <defs><linearGradient id="route" x1="0" x2="1"><stop stopColor="#477B2B" stopOpacity=".15" /><stop offset=".5" stopColor="#477B2B" /><stop offset="1" stopColor="#111513" /></linearGradient><filter id="mapGlow"><feGaussianBlur stdDeviation="3" /></filter></defs>
      <g className="map-grid"><path d="M0 65H700M0 130H700M0 195H700M0 260H700M0 325H700M70 0V390M140 0V390M210 0V390M280 0V390M350 0V390M420 0V390M490 0V390M560 0V390M630 0V390" /></g>
      <path className="contour contour-one" d="M-20 290 C100 210 130 360 270 270 S460 180 720 250" /><path className="contour contour-two" d="M-40 180 C100 80 185 240 325 145 S520 60 740 130" />
      <path className="geofence" d="M85 75 L590 52 L642 300 L170 344 Z" />
      <path className="route-shadow" d="M112 285 C160 240 187 112 290 134 S365 278 448 246 S513 118 585 87" /><motion.path className="route-line" d="M112 285 C160 240 187 112 290 134 S365 278 448 246 S513 118 585 87" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, ease: 'easeInOut' }} />
      {[['WP-01', 112, 285], ['WP-02', 210, 126], ['WP-03', 365, 270], ['WP-04', 585, 87]].map(([label, x, y], index) => <g className="waypoint" key={label as string}><circle cx={x as number} cy={y as number} r="7" /><circle cx={x as number} cy={y as number} r="14" /><text x={(x as number) + 14} y={(y as number) - 12}>{label as string}</text><motion.circle cx={x as number} cy={y as number} r="20" fill="none" stroke="#477B2B" initial={{ opacity: 0 }} animate={{ opacity: [0, .7, 0], scale: [0.7, 1.25, 1.25] }} transition={{ duration: 2.4, delay: index * .45, repeat: Infinity }} /></g>)}
      <motion.g className="map-drone" animate={{ x: [0, 95, 245, 336, 473], y: [0, -88, 0, -39, -198] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}><path d="M-12 0 L0 -7 L18 0 L0 7Z" fill="#111513" /><circle cx="0" cy="0" r="3" fill="#477B2B" /></motion.g>
      <g className="map-label"><text x="34" y="35">AIRSPACE / DEMO ENVIRONMENT</text><text x="530" y="365">ALT RINGS / 124.6 m</text><text x="20" y="370">18° 32' 44.2" N</text></g>
    </svg>
    <div className="map-readout"><span><b className="live-dot" /> MISSION ACTIVE</span><strong>OPIP-2048</strong><small>SIMULATED ROUTE / NOT LIVE HARDWARE</small></div>
  </div>;
}

function MissionContract() {
  return <div className="mission-contract"><div className="contract-prompt"><span>OPERATOR REQUEST</span><strong>“Inspect sector 07<br />and return to base.”</strong></div><div className="contract-route"><span>MISSION GENERATED</span><b>OBJECTIVE <em>SECTOR INSPECTION</em></b><b>ROUTE <em>04 WAYPOINTS</em></b><b>CONSTRAINTS <em>GEOFENCE / RETURN</em></b><b>STATUS <em className="green">READY</em></b></div></div>;
}

function EnforcementChamber() {
  return <div className="enforcement-chamber"><div className="chamber-beam" /><div className="vault"><motion.div className="vault-door" animate={{ rotate: [0, 0, 90, 90, 0] }} transition={{ duration: 8, repeat: Infinity, times: [0, .25, .42, .7, 1], ease: 'easeInOut' }}><span /><span /><span /><span /></motion.div><div className="vault-core"><LockKeyhole size={19} /><b>ENFORCEMENT</b><small>LLM-FREE / DETERMINISTIC</small></div></div><div className="chamber-readout"><span>CHECKSUM / 7C-04-A9</span><b><i /> ONLY EXECUTION AUTHORITY</b><small>REQUEST → CHECK → ALLOW</small></div></div>;
}

function ConnectedStudios() {
  return <div className="studio-system"><div className="studio-rail"><motion.i animate={{ y: [0, 250] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} /></div><div className="studio-node core"><Mark /><span>DERYK CORE</span></div><div className="studio-node console"><Terminal size={16} /><span>CONSOLE<small>MISSION PLANNING</small></span></div><div className="studio-node connector"><Network size={16} /><span>CONNECTOR<small>MACHINE INTERFACE</small></span></div><div className="studio-node telemetry"><Radio size={16} /><span>TELEMETRY<small>LIVE SYSTEM STATE</small></span></div><div className="studio-node logbook"><Waves size={16} /><span>LOGBOOK<small>HISTORICAL RECORD</small></span></div><svg className="studio-lines" viewBox="0 0 700 340"><path d="M350 170H180M350 170H520M350 170L350 45M350 170L350 295" /></svg></div>;
}

function Logbook() {
  const events = [['09:41:02', 'MISSION START', 'Mission contract accepted'], ['09:41:08', 'WAYPOINT 01', 'Navigation route active'], ['09:41:31', 'POLICY CHECK', 'EnforcementGate / ALLOW'], ['09:42:04', 'WAYPOINT 02', 'Altitude 124.6 m'], ['09:43:12', 'RETURN', 'Return-to-base constraint'], ['09:44:02', 'MISSION COMPLETE', 'Record exported to logbook']];
  return <div className="logbook"><div className="logbook-head"><span>FLIGHT RECORD / OPIP-2048</span><b>REPLAY 01</b></div><div className="logbook-track"><motion.i animate={{ left: ['0%', '100%'] }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} /></div>{events.map(([time, label, detail], index) => <div className="log-event" key={label}><span>{time}</span><i className={label === 'POLICY CHECK' ? 'amber' : ''} /><div><b>{label}</b><small>{detail}</small></div><ArrowRight size={13} /></div>)}</div>;
}

function DerykPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const active = lifecycle[activeStage];
  const ActiveIcon = active.icon;
  const matrix = useMemo(() => Array.from({ length: 66 }, (_, index) => index), []);

  return <div className="mission-control" id="top">
    <header className="mission-nav"><a href="#top" aria-label="DERYK home"><Mark /><span>DERYK</span></a><span className="mission-nav-status"><i /> SYSTEM / DERYK-01</span><nav><a href="#lifecycle">Lifecycle</a><a href="#studios">Studios</a><a href="#safety">Safety</a><a href="#logbook">Logbook</a><a className="mission-nav-button" href="#connect">Enter mission control <ArrowRight size={13} /></a></nav></header>

    <main>
      <section className="mission-hero"><div className="hero-editorial"><span className="eyebrow">DERYK / AUTONOMOUS MISSION SYSTEM</span><h1>Autonomy,<br /><em>with receipts.</em></h1><p>A mission-control intelligence layer for planning, enforcing, executing and observing autonomous operations.</p><div className="hero-actions"><a className="mission-button primary" href="#lifecycle">Enter mission control <ArrowRight size={15} /></a><a className="mission-button text" href="#studios">Explore DERYK <ArrowDownRight size={15} /></a></div><div className="hero-footnote"><span>SIMULATED DEMO ENVIRONMENT</span><span>NO LIVE HARDWARE CONNECTED</span></div></div></section>

      <section className="mission-claim"><span>THE INVARIANT</span><h2>The AI proposes.<br /><em>The Gate decides.</em></h2><p>DERYK keeps intelligence expressive and execution accountable by placing deterministic authority between the request and the vehicle.</p></section>

      <section className="mission-section lifecycle-section" id="lifecycle"><div className="section-intro"><span className="eyebrow">01 / MISSION LIFECYCLE</span><h2>One mission.<br /><em>Five deliberate states.</em></h2><p>From the first sentence to the final record, DERYK makes the operating environment legible.</p></div><div className="lifecycle-layout"><div className="lifecycle-nav">{lifecycle.map((stage, index) => { const Icon = stage.icon; return <button className={activeStage === index ? 'active' : ''} key={stage.key} onClick={() => setActiveStage(index)}><span>0{index + 1}</span><Icon size={15} /><b>{stage.label}</b><i /></button>; })}</div><div className="lifecycle-stage"><AnimatePresence mode="wait"><motion.div key={active.key} initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }} transition={{ duration: .45 }}><div className="stage-heading"><ActiveIcon size={18} /><span>{active.label} / SYSTEM STATE</span></div><h3>{active.title}</h3><p>{active.copy}</p>{active.key === 'plan' && <MissionContract />}{active.key === 'validate' && <EnforcementChamber />}{active.key === 'execute' && <AirspaceMap compact />}{active.key === 'observe' && <TelemetryPanel />}{active.key === 'replay' && <Logbook />}</motion.div></AnimatePresence></div></div></section>

      <section className="mission-section studios-section" id="studios"><div className="section-intro split"><div><span className="eyebrow">02 / DERYK STUDIOS</span><h2>The parts are connected.<br /><em>The record is one.</em></h2></div><p>Console, Connector, Telemetry and Logbook are not features in a grid. They are the surfaces of one mission system.</p></div><ConnectedStudios /></section>

      <section className="mission-section safety-section" id="safety"><div className="section-intro"><span className="eyebrow">03 / SAFETY BOUNDARY</span><h2>Authority belongs<br /><em>in the system.</em></h2><p>The model may interpret. The judge may advise. Only the gate can enforce.</p></div><div className="safety-flow">{['REQUEST', 'INTERPRET', 'CHECK', 'ENFORCE', 'EXECUTE'].map((label, index) => <div className={label === 'ENFORCE' ? 'safety-step gate' : 'safety-step'} key={label}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b>{index < 4 && <ArrowRight size={14} />}</div>)}</div><div className="safety-quote"><LockKeyhole size={22} /><div><span>ENFORCEMENTGATE / DETERMINISTIC</span><strong>Every approved mission carries a decision that can be inspected.</strong></div><Check size={22} /></div></section>

      <section className="mission-section matrix-section"><div className="section-intro split"><div><span className="eyebrow">04 / CAPABILITY MASKS</span><h2>Measure what exists.<br /><em>Name what does not.</em></h2></div><p>A connector that cannot measure a field reports Not Measured. DERYK never turns absence into a fabricated zero.</p></div><div className="matrix-comparison">{[['CERTAINTY', 45], ['LIDAR SIMULATOR', 11]].map(([name, count]) => <div className="matrix-system" key={name as string}><header><span>{name as string}</span><b>{count} / 66</b></header><div>{matrix.map((cell) => <i className={cell < (count as number) ? 'on' : ''} key={cell} title={`Telemetry field ${cell + 1}`} />)}</div><small>{count === 45 ? 'MOTOR / PID / GPS / BATTERY' : 'POSITION / VELOCITY'} <em>{66 - (count as number)} NOT MEASURED</em></small></div>)}</div></section>

      <section className="mission-section" id="logbook"><div className="section-intro split"><div><span className="eyebrow">05 / OBSERVABILITY & LOGBOOK</span><h2>DERYK remembers<br /><em>what happened.</em></h2></div><p>Telemetry is exported best-effort to an analytics logbook. It never participates in the safety path.</p></div><Logbook /></section>

      <section className="mission-faq"><div><span className="eyebrow">06 / QUESTIONS, ANSWERED</span><h2>Precision over<br />promises.</h2></div><div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? 'open' : ''} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<ChevronDown size={16} /></button><p>{answer}</p></article>)}</div></section>
      <section className="mission-cta" id="connect"><span className="eyebrow">07 / START WITH PROOF</span><h2>Build autonomous systems<br /><em>you can prove safe.</em></h2><p>Bring your mission loop into focus. DERYK gives every proposal a boundary and every flight a record.</p><a className="mission-button primary" href="mailto:hello@deryk.ai">Enter mission control <ArrowRight size={15} /></a></section>
    </main>
    <footer className="mission-footer"><div><Mark /><strong>DERYK</strong><span>MISSION CONTROL DOCK / BUILD 0.1.0</span></div><div><i className="live-dot" /> SYSTEM NOMINAL <span>© 2026 DERYK SYSTEMS</span></div></footer>
  </div>;
}

function TelemetryPanel() { return <div className="telemetry-panel"><div className="telemetry-chart"><svg viewBox="0 0 600 180" preserveAspectRatio="none"><path d="M0 145 C50 125 75 150 115 92 S180 125 225 72 S285 105 335 48 S390 75 445 35 S530 65 600 18" /><path className="secondary" d="M0 100 C80 70 110 120 180 94 S280 130 350 82 S450 105 600 58" /></svg><span>ALTITUDE / METRES</span><b>124.6</b></div><div className="telemetry-values"><span>VELOCITY <b>18.4 m/s</b></span><span>GPS <b>18 SAT</b></span><span>BATTERY <b>87%</b></span><span>HDG <b>047°</b></span><span>SIGNAL <b>STRONG</b></span><span>LATENCY <b>018 ms</b></span></div></div>; }

export default DerykPage;
