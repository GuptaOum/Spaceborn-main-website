import CompanyPageLayout from '../../../components/CompanyPageLayout';

export const metadata = {
  title: 'Certanity | Spaceborn',
  description: 'Develop. Simulate. Validate. Deploy.',
};

export default function CertanityPage() {
  return (
    <CompanyPageLayout
      title="CERTANITY"
      subtitle="Develop. Simulate. Validate. Deploy."
      paragraphs={[
        "Certanity is Spaceborn's autonomous systems development and simulation platform designed to accelerate the creation, testing, and validation of intelligent machines. It provides developers, researchers, and organizations with realistic virtual environments where autonomous software can be safely designed, evaluated, and optimized before deployment.",
        'Developing autonomous systems directly on physical hardware is expensive, time-consuming, and often risky. Certanity addresses these challenges by enabling engineers to simulate real-world environments, sensor behavior, environmental conditions, communication limitations, and system failures within a controlled digital environment.',
        'The platform supports the entire autonomy development lifecycle, including mission planning, simulation, testing, validation, analytics, and deployment preparation. By integrating with ANSA, developers can validate autonomy algorithms in simulation before transitioning to physical platforms.',
        'Certanity supports applications across robotics, drones, aerospace, industrial automation, research, and education while reducing development costs and accelerating innovation.',
      ]}
      sections={[
        {
          title: 'Key Capabilities',
          items: [
            'High-fidelity simulation',
            'Sensor visualization',
            'Mission testing',
            'AI validation',
            'Scenario generation',
            'Performance analytics',
            'Telemetry analysis',
            'Deployment preparation',
          ],
        },
        {
          title: 'Applications',
          items: [
            'Drone development',
            'Robotics testing',
            'Aerospace simulation',
            'Industrial automation',
            'Research laboratories',
            'Educational institutions',
          ],
        },
      ]}
    />
  );
}
