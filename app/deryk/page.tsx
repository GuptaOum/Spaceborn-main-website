'use client';

import { useState } from 'react';
import { ArrowRight, BarChart3, Check, ChevronDown, Database, LockKeyhole, Network, Radar, ShieldCheck, Sparkles, Terminal, Zap } from 'lucide-react';
import './deryk.css';

const architecture = [
  ['Operator', 'Plain-language intent', Terminal],
  ['Mission planning', 'LLM proposes an OPIP', Sparkles],
  ['Safety judge', 'Advisory recommendation', ShieldCheck],
  ['EnforcementGate', 'Deterministic allow / block', LockKeyhole],
  ['Execution backend', 'Connector contract', Network],
  ['Simulator / hardware', 'Vehicle motion', Radar],
] as const;

const faqs = [
  ['Why is the LLM read-only?', 'The model can reason about intent without being trusted with vehicle motion. Every action still passes through the deterministic gate.'],
  ['What is EnforcementGate?', 'It is the LLM-free decision boundary between a proposed mission and execution. It returns an explicit allow or block.'],
  ['What are capability masks?', 'Connectors declare the fields they genuinely measure. DERYK reports the rest as Not Measured instead of fabricating zeroes.'],
  ['Can DERYK control real drones?', 'The same mission loop can target a simulator today and hardware through a compatible execution backend.'],
  ['How is telemetry stored?', 'Completed flights are exported to an auditable analytics logbook, tagged by source and kept outside the safety path.'],
];

function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="deryk-heading"><span>{eyebrow}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

function Brand() {
  return <span className="deryk-brand"><i /><i /><i /><b>DERYK</b><small>MVP-1</small></span>;
}

export default function DerykPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return <div className="deryk-page" id="top">
    <header className="deryk-nav"><a href="#top" aria-label="DERYK home"><Brand /></a><nav><a href="#architecture">Architecture</a><a href="#studios">Studios</a><a href="#observability">Observability</a><a href="#safety">Safety</a><a className="deryk-nav-cta" href="#connect">Request access <ArrowRight size={14} /></a></nav></header>

    <main>
      <section className="deryk-hero">
        <div className="deryk-hero-copy"><span className="deryk-pill"><b /> AUTONOMY, WITH RECEIPTS</span><h1>Provable AI copilot for <em>autonomous drones.</em></h1><p>Natural-language mission planning with deterministic safety enforcement, connector-based execution, and an auditable telemetry logbook.</p><div className="deryk-actions"><a className="deryk-button primary" href="#studios">Launch console <ArrowRight size={16} /></a><a className="deryk-button secondary" href="#architecture">See how it works</a></div><div className="deryk-proof"><span><Check size={14} /> LLM-free safety boundary</span><span><Check size={14} /> Simulator-ready connectors</span></div></div>
        <div className="deryk-radar" aria-label="Live mission safety telemetry visualization"><div className="radar-ring one" /><div className="radar-ring two" /><div className="radar-ring three" /><div className="radar-sweep" /><div className="drone-mark" /><div className="deryk-signal top"><b /> GATE / READY <strong>99.98%</strong></div><div className="deryk-signal bottom"><small>ACTIVE MISSION</small><strong>OPIP-2048</strong><span>ALT <b>124.6 m</b></span></div></div>
      </section>

      <div className="deryk-trust"><span>Designed for teams shipping autonomy</span><b>SIMULATION</b><b>ROBOTICS</b><b>AEROSPACE</b><b>MISSION OPS</b></div>

      <section className="deryk-section" id="architecture"><SectionHeading eyebrow="01 / Architecture" title="The model proposes. The gate disposes." copy="DERYK separates intelligence from authority. Every mission follows one visible path from operator intent to vehicle motion." /><div className="deryk-flow">{architecture.map(([label, detail, Icon], index) => <div className="deryk-flow-item" key={label}><div className={`deryk-flow-node ${label === 'EnforcementGate' ? 'gate' : ''}`}><Icon size={18} /><span><strong>{label}</strong><small>{detail}</small></span>{label === 'EnforcementGate' && <b className="only-blocker">ONLY BLOCKER</b>}</div>{index < architecture.length - 1 && <i className="deryk-flow-line" />}</div>)}</div><div className="deryk-note">The language model has no path to vehicle motion. The gate is the only authority that can approve or block an OPIP contract.</div></section>

      <section className="deryk-section" id="studios"><SectionHeading eyebrow="02 / Platform studios" title="One control plane. Every flight signal." copy="A focused workspace for the whole mission loop, from a first sentence to a defensible flight record." /><div className="deryk-studios">{[['Console Studio', 'Fly missions using natural language', Terminal], ['Connector Studio', 'Connect drones and capability masks', Network], ['Telemetry Studio', 'Live charts and sensor visibility', BarChart3], ['Flight Records', 'Replay missions and audit trails', Database]].map(([title, copy, Icon]) => <article key={title as string}><Icon size={22} /><small>DERYK STUDIO</small><h3>{title as string}</h3><p>{copy as string}</p><div className="deryk-preview"><span>{title === 'Console Studio' ? '> fly a perimeter around sector 04' : title === 'Connector Studio' ? 'CERTAINTY 45 / 66' : title === 'Telemetry Studio' ? 'ALTITUDE 124.6 m' : 'OPIP-2048 / GATE VERIFIED'}</span><b><i /> READY</b></div><a href="#observability">Open studio <ArrowRight size={14} /></a></article>)}</div></section>

      <section className="deryk-section deryk-observe" id="observability"><SectionHeading eyebrow="03 / Mission observability" title="Every flight leaves a readable trail." copy="A live operational view that never pretends to know more than the connector measured." /><div className="deryk-dashboard"><aside><Brand /><small>WORKSPACE</small><b>Overview</b><span>Missions</span><span>Connectors</span><span>Telemetry</span><em>● system nominal</em></aside><div><header><small>MISSION OBSERVABILITY</small><h3>Flight overview <span>LIVE LOGBOOK</span></h3></header><div className="deryk-metrics"><b><small>ACTIVE MISSIONS</small>08</b><b><small>FLIGHT DURATION</small>04:28:19</b><b><small>GATE SUCCESS RATE</small>99.98%</b></div><svg className="deryk-chart" viewBox="0 0 600 180" preserveAspectRatio="none"><path d="M0 145 C45 125 65 148 105 110 S165 128 215 83 S280 110 325 62 S395 88 445 42 S535 71 600 24" /><path className="faint" d="M0 160 C65 145 96 125 145 135 S220 89 280 100 S360 58 410 75 S510 30 600 45" /></svg><div className="deryk-log"><span>GATE VERIFIED MISSION OPIP-2048 <b>14:31:42</b></span><span>TELEMETRY EXPORTED <b>14:38:19</b></span></div></div></div></section>

      <section className="deryk-section" id="safety"><SectionHeading eyebrow="04 / Safety boundaries" title="Deliberate constraints are a feature." copy="The strongest safety claim is the one you can inspect. DERYK makes the invariant visible at every layer." /><div className="deryk-boundaries">{[['AI has read-only tools', 'The model can query history and capabilities, but it has no vehicle command.', LockKeyhole], ['Safety judge is advisory', 'The judge can recommend. Only the deterministic gate can block.', ShieldCheck], ['EnforcementGate is the only blocker', 'Every proposed action meets the same explicit, testable rules.', Zap], ['Telemetry never affects safety', 'Analytics export is isolated, so an outage cannot disturb a flight.', BarChart3]].map(([title, copy, Icon], index) => <article className={index === 2 ? 'featured' : ''} key={title as string}><Icon size={20} /><small>0{index + 1}</small><h3>{title as string}</h3><p>{copy as string}</p></article>)}</div><div className="deryk-principle">“ <strong>The AI proposes. The EnforcementGate decides.</strong><ShieldCheck size={30} /></div></section>

      <section className="deryk-section deryk-masks"><div><SectionHeading eyebrow="05 / Telemetry & capability masks" title="Missing is a valid signal." copy="Different connectors expose different sensors. DERYK reports reality as it is, including what a machine cannot measure." /><div className="not-measured"><b>—</b><span><strong>Not Measured</strong><small>No fabricated zeroes. No false confidence.</small></span></div></div><div className="coverage"><header>FIELD COVERAGE <span>66 TOTAL FIELDS</span></header><label>Certainty <b>45 / 66 fields</b><i><em style={{ width: '68%' }} /></i></label><label>Lidar Simulator <b>11 / 66 fields</b><i><em className="dim" style={{ width: '17%' }} /></i></label><small>● measured &nbsp;&nbsp; ○ not measured</small></div></section>

      <section className="deryk-section deryk-workflow"><SectionHeading eyebrow="06 / Mission loop" title="From intent to evidence." /><div>{['Type mission', 'AI plan', 'Gate verification', 'Execute', 'Export telemetry', 'Replay & audit'].map((step, index) => <span key={step}><b className={index === 2 ? 'gate-dot' : ''}>{String(index + 1).padStart(2, '0')}</b>{step}</span>)}</div></section>

      <section className="deryk-section deryk-faq" id="faq"><SectionHeading eyebrow="07 / Questions, answered" title="The short version." copy="Precise answers for teams evaluating the flight layer." /><div>{faqs.map(([question, answer], index) => <article className={openFaq === index ? 'open' : ''} key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}>{question}<ChevronDown size={17} /></button><p>{answer}</p></article>)}</div></section>

      <section className="deryk-cta" id="connect"><span>08 / START WITH PROOF</span><h2>Build autonomous systems<br /><em>you can prove safe.</em></h2><p>Bring your mission loop into focus. DERYK gives every proposal a boundary and every flight a record.</p><a className="deryk-button primary" href="mailto:hello@deryk.ai">Get started <ArrowRight size={16} /></a></section>
    </main>
    <footer className="deryk-footer"><Brand /><span>PROVABLE AUTONOMY FOR THE REAL WORLD</span><span>© 2026 DERYK SYSTEMS</span></footer>
  </div>;
}
