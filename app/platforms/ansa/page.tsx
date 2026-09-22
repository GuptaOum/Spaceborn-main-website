import CompanyPageLayout from '../../../components/CompanyPageLayout';

export const metadata = {
  title: 'ANSA | Spaceborn',
  description: 'The Autonomy Platform for Intelligent Machines',
};

const capabilities = [
  'Mission execution engine',
  'Hardware abstraction',
  'Navigation framework',
  'Real-time telemetry',
  'Fleet-ready architecture',
  'AI integration',
  'Safety management',
  'Developer APIs',
];

const applications = [
  'Autonomous drones',
  'Mobile robots',
  'Industrial automation',
  'Defense systems',
  'Aerospace platforms',
  'Research and education',
];

export default function AnsaPage() {
  return (
    <CompanyPageLayout
      title="ANSA"
      subtitle="The Autonomy Platform for Intelligent Machines"
      paragraphs={[
        "ANSA is Spaceborn's core autonomy platform designed to power intelligent machines operating in complex, dynamic environments. It provides the software foundation that enables drones, robots, autonomous vehicles, and future aerospace systems to perceive their surroundings, understand mission objectives, make decisions, and execute actions safely and reliably.",

        'Built with a simulation-first philosophy, ANSA allows developers to design, validate, and optimize autonomous behaviors before deployment to physical hardware. By separating high-level autonomy software from underlying hardware through a robust Hardware Abstraction Layer (HAL), ANSA enables applications to be deployed across multiple platforms without requiring extensive software modifications.',

        'The platform integrates mission execution, navigation, telemetry, safety systems, and AI-driven decision support into a unified architecture. Whether controlling a single drone or coordinating fleets of autonomous systems, ANSA provides a scalable and extensible environment for building next-generation autonomous technologies.',

        'As the foundation of the Spaceborn ecosystem, ANSA works seamlessly with Certanity for simulation, Mission Studio for planning, Fleet Manager for operations, and DERYK for AI-powered mission assistance, creating a complete development and deployment workflow.',
      ]}
      sections={[
        {
          title: 'Key Capabilities',
          items: capabilities,
        },
        {
          title: 'Applications',
          items: applications,
        },
      ]}
    />
  );
}