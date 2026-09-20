'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownRight, ArrowRight, Bot, BrainCircuit, Check, ChevronDown, CircleDot, Database, Gamepad2, Globe2, Layers3, LockKeyhole, Network, Radio, ShieldCheck, Sparkles, Terminal, Waves, Zap } from 'lucide-react';
import './mission-control.css';

const lifecycle = [
  { key: 'plan', label: 'PLAN', title: 'Turn intent into a mission.', copy: 'An operator describes the objective. DERYK structures the request into a mission contract without touching a vehicle.', icon: Terminal },
  { key: 'validate', label: 'VALIDATE', title: 'Make the boundary explicit.', copy: 'The proposed route is checked against declared constraints. The Safety Judge can advise; the EnforcementGate decides.', icon: ShieldCheck },
  { key: 'execute', label: 'EXECUTE', title: 'Carry the approved contract.', copy: 'The execution backend receives only what the deterministic gate allowed. Simulator first, compatible hardware later.', icon: Zap },
  { key: 'observe', label: 'OBSERVE', title: 'Keep the signal honest.', copy: 'Telemetry moves to the analytics logbook. Measured values stay distinct from fields the connector cannot report.', icon: Radio },
  { key: 'replay', label: 'REPLAY', title: 'Remember what happened.', copy: 'Every mission becomes a queryable record: decisions, events, durations, and the signals that actually existed.', icon: Waves },
] as const;

const faqs = [
  ['What is DERYK?', 'DERYK is intelligence infrastructure that connects AI models to dynamic environments so intelligent systems can understand, predict, decide, act, and evaluate.'],
  ['Is DERYK another AI model?', 'No. DERYK is the operating layer around models and environments rather than a new general-purpose foundation model.'],
  ['What environments does DERYK target?', 'Physical systems, simulations, games, and selected digital or enterprise environments.'],
  ['Who is DERYK for?', 'Developers and organizations building robotics, autonomous systems, simulations, games, and environment-aware AI applications.'],
  ['Does DERYK work with one model only?', 'The platform is designed to integrate with multiple AI models and services.'],
];

const loop = [
  { label: 'CONTEXT', detail: 'What is happening now?', icon: Globe2 },
  { label: 'MEMORY', detail: 'What happened before?', icon: Database },
  { label: 'UNDERSTAND', detail: 'What does the world mean?', icon: BrainCircuit },
  { label: 'PREDICT', detail: 'What may happen next?', icon: Sparkles },
  { label: 'REASON', detail: 'What should happen?', icon: Bot },
  { label: 'ACT', detail: 'Interact with the environment.', icon: Zap },
  { label: 'EVALUATE', detail: 'Did it work as intended?', icon: Check },
  { label: 'SAFETY', detail: 'Keep action governed.', icon: ShieldCheck },
];

const environments = [
  { label: 'PHYSICAL', title: 'Robots, drones, and machines.', copy: 'Connect intelligence to sensors, actuators, and real-world systems that change over time.', icon: Bot },
  { label: 'DIGITAL', title: 'Software and enterprise systems.', copy: 'Give AI a durable view of operational state, workflows, and system actions.', icon: Layers3 },
  { label: 'GAMES', title: 'Interactive worlds and agents.', copy: 'Build characters and opponents with memory, perception, telemetry, and adaptive behaviour.', icon: Gamepad2 },
  { label: 'SIMULATION', title: 'Virtual spaces for validation.', copy: 'Develop and evaluate intelligent behaviour before it reaches the physical world.', icon: Globe2 },
];

const productAreas = [
  { label: '01 / PHYSICAL AI', title: 'Intelligence for systems that move.', copy: 'World understanding, prediction, runtime infrastructure, SDKs, and studio workflows for autonomous machines.', products: ['World Intelligence Engine', 'Autonomous Environment Intelligence', 'Physical Intelligence Runtime', 'Physical Intelligence SDK', 'Physical AI Studio'] },
  { label: '02 / PLATFORM AI', title: 'The shared foundation underneath.', copy: 'APIs, services, identity, model integrations, memory, and serving infrastructure for environment-aware intelligence.', products: ['AI Platform', 'AI Services', 'AI Runtime', 'Environment Interface Layer'] },
  { label: '03 / GAMING AI', title: 'World-aware game intelligence.', copy: 'Persistent, state-aware, perceptive agents that respond to players and evolving game worlds.', products: ['NPC Intelligence SDK', 'Adaptive Opponent', 'Gaming Intelligence SDK'] },
];

function Mark() { return <img className="mc-logo" src="/images/deryk-logo.jpeg" alt="DERYK" />; }

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
    <header className="mission-nav"><a href="#top" aria-label="DERYK home"><Mark /></a><span className="mission-nav-status"><i /> SYSTEM / DERYK-01</span><nav><a href="#architecture">Architecture</a><a href="#worlds">Worlds</a><a href="#capabilities">Capabilities</a><a href="#careers">Careers</a><a className="mission-nav-button" href="#architecture">Explore DERYK <ArrowRight size={13} /></a></nav></header>

    <main>
      <section className="mission-hero"><div className="hero-editorial"><span className="eyebrow">DERYK / AUTONOMOUS MISSION SYSTEM</span><h1>Autonomy,<br /><em>with receipts.</em></h1><p>A mission-control intelligence layer for planning, enforcing, executing and observing autonomous operations.</p><div className="hero-actions"><a className="mission-button primary" href="#architecture">Explore the architecture <ArrowRight size={15} /></a><a className="mission-button text" href="#worlds">Explore DERYK <ArrowDownRight size={15} /></a></div><div className="hero-footnote"><span>SIMULATED DEMO ENVIRONMENT</span><span>NO LIVE HARDWARE CONNECTED</span></div></div></section>

      <section className="mission-claim"><span>THE INVARIANT</span><h2>The AI proposes.<br /><em>The Gate decides.</em></h2><p>DERYK keeps intelligence expressive and execution accountable by placing deterministic authority between the request and the vehicle.</p></section>

      <section className="mission-section lifecycle-section" id="lifecycle"><div className="section-intro"><span className="eyebrow">01 / MISSION LIFECYCLE</span><h2>One mission.<br /><em>Five deliberate states.</em></h2><p>From the first sentence to the final record, DERYK makes the operating environment legible.</p></div><div className="lifecycle-layout"><div className="lifecycle-nav">{lifecycle.map((stage, index) => { const Icon = stage.icon; return <button className={activeStage === index ? 'active' : ''} key={stage.key} onClick={() => setActiveStage(index)}><span>0{index + 1}</span><Icon size={15} /><b>{stage.label}</b><i /></button>; })}</div><div className="lifecycle-stage"><AnimatePresence mode="wait"><motion.div key={active.key} initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0)' }} exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }} transition={{ duration: .45 }}><div className="stage-heading"><ActiveIcon size={18} /><span>{active.label} / SYSTEM STATE</span></div><h3>{active.title}</h3><p>{active.copy}</p>{active.key === 'plan' && <MissionContract />}{active.key === 'validate' && <EnforcementChamber />}{active.key === 'execute' && <AirspaceMap compact />}{active.key === 'observe' && <TelemetryPanel />}{active.key === 'replay' && <Logbook />}</motion.div></AnimatePresence></div></div></section>

      <section className="mission-section studios-section" id="studios"><div className="section-intro split"><div><span className="eyebrow">02 / DERYK STUDIOS</span><h2>The parts are connected.<br /><em>The record is one.</em></h2></div><p>Console, Connector, Telemetry and Logbook are not features in a grid. They are the surfaces of one mission system.</p></div><ConnectedStudios /></section>

      <section className="mission-section safety-section" id="safety"><div className="section-intro"><span className="eyebrow">03 / SAFETY BOUNDARY</span><h2>Authority belongs<br /><em>in the system.</em></h2><p>The model may interpret. The judge may advise. Only the gate can enforce.</p></div><div className="safety-flow">{['REQUEST', 'INTERPRET', 'CHECK', 'ENFORCE', 'EXECUTE'].map((label, index) => <div className={label === 'ENFORCE' ? 'safety-step gate' : 'safety-step'} key={label}><span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b>{index < 4 && <ArrowRight size={14} />}</div>)}</div><div className="safety-quote"><LockKeyhole size={22} /><div><span>ENFORCEMENTGATE / DETERMINISTIC</span><strong>Every approved mission carries a decision that can be inspected.</strong></div><Check size={22} /></div></section>

      <section className="mission-section matrix-section"><div className="section-intro split"><div><span className="eyebrow">04 / CAPABILITY MASKS</span><h2>Measure what exists.<br /><em>Name what does not.</em></h2></div><p>A connector that cannot measure a field reports Not Measured. DERYK never turns absence into a fabricated zero.</p></div><div className="matrix-comparison">{[['CERTAINTY', 45], ['LIDAR SIMULATOR', 11]].map(([name, count]) => <div className="matrix-system" key={name as string}><header><span>{name as string}</span><b>{count} / 66</b></header><div>{matrix.map((cell) => <i className={cell < (count as number) ? 'on' : ''} key={cell} title={`Telemetry field ${cell + 1}`} />)}</div><small>{count === 45 ? 'MOTOR / PID / GPS / BATTERY' : 'POSITION / VELOCITY'} <em>{66 - (count as number)} NOT MEASURED</em></small></div>)}</div></section>

      <section className="mission-section" id="logbook"><div className="section-intro split"><div><span className="eyebrow">05 / OBSERVABILITY & LOGBOOK</span><h2>DERYK remembers<br /><em>what happened.</em></h2></div><p>Telemetry is exported best-effort to an analytics logbook. It never participates in the safety path.</p></div><Logbook /></section>

      <section className="mission-faq"><div><span className="eyebrow">06 / QUESTIONS, ANSWERED</span><h2>Precision over<br />promises.</h2></div><div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? 'open' : ''} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<ChevronDown size={16} /></button><p>{answer}</p></article>)}</div></section>
      <section className="mission-cta" id="connect"><span className="eyebrow">07 / START WITH PROOF</span><h2>Build autonomous systems<br /><em>you can prove safe.</em></h2><p>Bring your mission loop into focus. DERYK gives every proposal a boundary and every flight a record.</p><a className="mission-button primary" href="mailto:hello@deryk.ai">Enter mission control <ArrowRight size={15} /></a></section>
      <ReferenceSections />
    </main>
    <footer className="mission-footer"><div><Mark /><span>INTELLIGENCE INFRASTRUCTURE FOR AUTONOMOUS WORLDS</span></div><div><i className="live-dot" /> SYSTEM NOMINAL <span>© 2026 DERYK SYSTEMS</span></div></footer>
  </div>;
}

function IntelligencePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return <div className="mission-control intelligence-page" id="top">
    <header className="mission-nav"><a href="#top" aria-label="DERYK home"><Mark /></a><span className="mission-nav-status"><i /> INTELLIGENCE / DERYK-01</span><nav><a href="#loop">The loop</a><a href="#products">Products</a><a href="#worlds">Worlds</a><a href="#faq">FAQ</a><a className="mission-nav-button" href="#connect">Talk to DERYK <ArrowRight size={13} /></a></nav></header>

    <main>
      <section className="intelligence-hero"><div className="hero-editorial"><span className="eyebrow">DERYK / INTELLIGENCE INFRASTRUCTURE</span><h1>Intelligence<br /><em>for autonomous worlds.</em></h1><p>DERYK connects AI models to dynamic environments so they can understand context, maintain state, predict change, make decisions, take actions, and evaluate outcomes.</p><div className="hero-actions"><a className="mission-button primary" href="#loop">Explore the system <ArrowRight size={15} /></a><a className="mission-button text" href="#products">View product areas <ArrowDownRight size={15} /></a></div><div className="hero-footnote"><span>PHYSICAL / DIGITAL / GAMES / SIMULATION</span><span>FROM PERCEPTION TO EVALUATION</span></div></div><div className="hero-orbit"><div className="orbit-ring ring-a" /><div className="orbit-ring ring-b" /><div className="orbit-ring ring-c" /><div className="orbit-core"><Mark /><span>WORLD STATE</span><b>ONLINE</b></div><div className="orbit-node node-top">CONTEXT</div><div className="orbit-node node-right">PREDICT</div><div className="orbit-node node-bottom">ACTION</div><div className="orbit-node node-left">MEMORY</div></div></section>

      <section className="positioning-band"><span>THE MISSING OPERATING LAYER</span><h2>AI intelligence for worlds,<br /><em>not just prompts.</em></h2><p>Capable models still need a connected loop to operate continuously inside changing environments. DERYK builds that layer around them.</p></section>

      <section className="mission-section loop-section" id="loop"><div className="section-intro split"><div><span className="eyebrow">01 / THE INTELLIGENCE LOOP</span><h2>From isolated reasoning<br /><em>to continuous interaction.</em></h2></div><p>DERYK keeps the system grounded in the world around it: what has happened, what is changing, what could happen next, and what action is safe to take.</p></div><div className="loop-grid">{loop.map(({ label, detail, icon: Icon }, index) => <div className={`loop-step ${index === 5 ? 'active' : ''}`} key={label}><span>0{index + 1}</span><Icon size={18} /><b>{label}</b><small>{detail}</small>{index < loop.length - 1 && <ArrowRight size={13} />}</div>)}</div></section>

      <section className="mission-section worlds-section" id="worlds"><div className="section-intro"><span className="eyebrow">02 / ONE FOUNDATION, MANY WORLDS</span><h2>Meet intelligence<br /><em>where it operates.</em></h2><p>The same high-level intelligence concepts can move across physical, simulated, gaming, and digital environments.</p></div><div className="world-grid">{environments.map(({ label, title, copy, icon: Icon }) => <article className="world-card" key={label}><div><Icon size={20} /><span>{label}</span></div><h3>{title}</h3><p>{copy}</p><ArrowDownRight size={18} /></article>)}</div></section>

      <section className="mission-section products-section" id="products"><div className="section-intro split"><div><span className="eyebrow">03 / DERYK PRODUCT AREAS</span><h2>Infrastructure that<br /><em>meets the world.</em></h2></div><p>Three product areas share one intelligence foundation, so teams can build for the environment in front of them without starting from zero.</p></div><div className="product-grid">{productAreas.map((area, index) => <article className={`product-area area-${index + 1}`} key={area.label}><span>{area.label}</span><h3>{area.title}</h3><p>{area.copy}</p><div className="product-list">{area.products.map((product) => <div key={product}><Check size={14} /> {product}</div>)}</div><a href="#connect">Explore area <ArrowRight size={14} /></a></article>)}</div></section>

      <section className="mission-section capability-section"><div className="capability-copy"><span className="eyebrow">04 / SHARED CAPABILITIES</span><h2>Built around<br /><em>the whole loop.</em></h2><p>DERYK is model-agnostic infrastructure for systems that need more than inference: persistent state, temporal understanding, environment interaction, evaluation, and controlled execution.</p><a className="mission-button primary" href="#connect">Build with DERYK <ArrowRight size={15} /></a></div><div className="capability-panel"><div className="capability-panel-head"><span>INTELLIGENCE FOUNDATION</span><b>8 CONNECTED LAYERS</b></div>{['Multimodal perception & scene understanding', 'Persistent memory & state management', 'Temporal reasoning & world-state tracking', 'Prediction & outcome modelling', 'Decision and action interfaces', 'Simulation, evaluation & safety'].map((item, index) => <div className="capability-row" key={item}><span>0{index + 1}</span><b>{item}</b><ArrowRight size={14} /></div>)}</div></section>

      <section className="mission-section proof-section"><div className="proof-mark"><Mark /><span>WORLD STATE / 24:07:18</span></div><div><span className="eyebrow">05 / A PRACTICAL STARTING POINT</span><h2>Give your AI<br /><em>a world to work in.</em></h2><p>From robotics and drones to games, simulation, and enterprise workflows, DERYK helps intelligent systems move from understanding to accountable action.</p></div></section>

      <section className="mission-faq" id="faq"><div><span className="eyebrow">06 / QUESTIONS, ANSWERED</span><h2>Precision over<br />promises.</h2></div><div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? 'open' : ''} key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>{question}<ChevronDown size={16} /></button><p>{answer}</p></article>)}</div></section>
      <section className="mission-cta" id="connect"><span className="eyebrow">07 / START WITH THE WORLD</span><h2>Build systems that<br /><em>can keep up.</em></h2><p>Tell us what your intelligent system needs to understand, remember, predict, and do.</p><a className="mission-button primary" href="mailto:hello@deryk.ai">Talk to DERYK <ArrowRight size={15} /></a></section>
    </main>
    <footer className="mission-footer"><div><Mark /><span>INTELLIGENCE INFRASTRUCTURE FOR AUTONOMOUS WORLDS</span></div><div><i className="live-dot" /> SYSTEM NOMINAL <span>© 2026 DERYK SYSTEMS</span></div></footer>
  </div>;
}

function TelemetryPanel() { return <div className="telemetry-panel"><div className="telemetry-chart"><svg viewBox="0 0 600 180" preserveAspectRatio="none"><path d="M0 145 C50 125 75 150 115 92 S180 125 225 72 S285 105 335 48 S390 75 445 35 S530 65 600 18" /><path className="secondary" d="M0 100 C80 70 110 120 180 94 S280 130 350 82 S450 105 600 58" /></svg><span>ALTITUDE / METRES</span><b>124.6</b></div><div className="telemetry-values"><span>VELOCITY <b>18.4 m/s</b></span><span>GPS <b>18 SAT</b></span><span>BATTERY <b>87%</b></span><span>HDG <b>047°</b></span><span>SIGNAL <b>STRONG</b></span><span>LATENCY <b>018 ms</b></span></div></div>; }

function ReferenceSections() {
  const stack = ['Perception', 'Representation', 'World Model', 'Prediction', 'Action Model', 'Planning', 'Safety', 'Execution'];
  const areas = [
    ['AGI', 'Systems that reason, plan, coordinate, and act across time.'],
    ['PHYSICAL', 'AI for the real world: perception, prediction, and safe action.'],
    ['NEURAL', 'Reusable learning systems for multimodal intelligence.'],
    ['GAMING', 'Agents that understand, adapt, and bring worlds to life.'],
    ['PLATFORM', 'The infrastructure connecting intelligence to everything.'],
  ];
  return <>
    <section className="reference-principles"><div><span className="reference-kicker">TRUSTED ENGINEERING PRINCIPLES</span><h2>Built across<br />the autonomy stack.</h2></div><p>From foundational models to real-world applications, DERYK builds the technology infrastructure and environments for a more capable and beneficial future.</p><div className="principle-tags">{['AI SYSTEMS', 'WORLD MODELS', 'AGENTS', 'SIMULATION', 'ROBOTICS', 'SAFETY', 'EVALUATION', 'MEMORY'].map((item) => <span key={item}><CircleDot size={13} />{item}</span>)}</div></section>
    <section className="reference-thesis"><div><span className="reference-kicker">OUR THESIS</span><h2>AI has learned<br />to generate.<br /><em>The next step is<br />to understand and act.</em></h2></div><div className="thesis-copy"><p>The world is dynamic, complex, and physical. True intelligence requires more than language. It requires an understanding of the world, the ability to predict what happens next, and the capability to choose and execute actions safely.</p><a className="reference-link" href="#architecture">Our vision <ArrowRight size={14} /></a></div><div className="world-loop"><div className="loop-globe"><Mark /><small>INTELLIGENCE LOOP</small></div>{['OBSERVE', 'MODEL', 'DECIDE', 'LEARN', 'ACT', 'PREDICT'].map((item, index) => <span className={`world-loop-label label-${index}`} key={item}>{item}<small>{['Multimodal perception', 'World representation', 'Action intelligence', 'Continuous improvement', 'Safe execution', 'Possible futures'][index]}</small></span>)}</div></section>
    <section className="reference-architecture" id="architecture"><div className="reference-heading"><span className="reference-kicker">OUR ARCHITECTURE</span><h2>The intelligence stack</h2><span>A unified architecture from perception to action.</span></div><div className="stack-layout"><div className="stack-worlds"><span>REAL-TIME<br />ENVIRONMENTS</span><i />PHYSICAL WORLD<br /><small>Robots, drones, machines</small><i />VIRTUAL WORLDS<br /><small>Simulation, games</small><i />COGNITIVE SYSTEMS<br /><small>Agents, tools, workflows</small></div><div className="stack-layers">{stack.map((item, index) => <div key={item} style={{ '--layer': index } as React.CSSProperties}><span>0{index + 1}</span><b>{item}</b><small>{['Multimodal inputs', 'Unified state', 'Understanding dynamics', 'Possible futures', 'What can we do', 'The best path', 'Validation and constraints', 'Request-ready action'][index]}</small></div>)}</div><div className="stack-result">ONE<br /><b>CONTINUOUS<br />LEARNING LOOP</b><ArrowRight size={18} /></div></div></section>
    <section className="reference-areas" id="worlds"><div className="reference-heading"><span className="reference-kicker">OUR INTELLIGENCE AREAS</span><h2>One architecture. Many worlds.</h2><span>Explore all areas <ArrowRight size={13} /></span></div><div className="area-cards">{areas.map(([name, copy], index) => <article key={name} className={`area-card area-image-${index}`}><div className="area-art" /><h3>{name}</h3><p>{copy}</p><ArrowRight size={15} /></article>)}</div></section>
    <section className="reference-action" id="capabilities"><div className="reference-heading"><span className="reference-kicker">FROM SENSORS TO ACTION</span><h2>From perception to real-world impact.</h2><span>Learn more <ArrowRight size={13} /></span></div><div className="action-steps">{['Sense', 'Understand', 'Predict', 'Decide', 'Execute'].map((item, index) => <div key={item}><span>0{index + 1}</span><div className={`action-art action-art-${index}`} /><h3>{item}</h3><p>{['Cameras, radar, LiDAR, GPS, telemetry', 'World models that create context', 'Future states, risks, and outcomes', 'Action models & planning', 'Rules, safety, deployment'][index]}</p></div>)}</div></section>
    <section className="reference-careers" id="careers"><div><span className="reference-kicker">CAREERS</span><h2>Build intelligence<br />for the real world.</h2><p>Join a team of researchers, engineers, and builders working on some of the most important challenges of our time.</p><div><a className="reference-button" href="mailto:hello@deryk.ai">View open roles <ArrowRight size={13} /></a><a className="reference-text-link" href="#top">Life at DERYK</a></div></div></section>
  </>;
}

export default DerykPage;
