import CompanyPageLayout from '../../../components/CompanyPageLayout';

export const metadata = {
  title: 'Fleet Manager | Spaceborn',
  description: 'Operate Every Machine From One Platform.',
};

export default function FleetManagerPage() {
  return (
    <CompanyPageLayout
    
      title="FLEET MANAGER"
      subtitle="Operate Every Machine From One Platform."
      paragraphs={[
        'Fleet Manager is Spaceborn\'s centralized command and fleet management platform, built to monitor, control, and coordinate autonomous systems operating across multiple locations and missions. Whether managing a handful of robots or thousands of autonomous platforms, Fleet Manager provides operators with complete visibility into the health, status, and performance of every connected system from a single interface.',
        'As autonomous deployments continue to scale, organizations require more than individual vehicle control. They need a unified operational platform capable of tracking missions in real time, distributing tasks across fleets, monitoring system health, and responding quickly to changing operational conditions. Fleet Manager addresses this challenge by bringing together mission management, telemetry, diagnostics, analytics, and fleet-wide coordination into a single operational environment.',
        'The platform continuously receives telemetry from connected autonomous systems, allowing operators to visualize vehicle locations, monitor battery status, inspect sensor health, review communication quality, and identify potential failures before they impact operations. Fleet Manager also supports remote mission assignment, enabling new objectives or updated routes to be securely transmitted to autonomous platforms without interrupting ongoing operations.',
        'Designed to integrate seamlessly with the Spaceborn ecosystem, Fleet Manager works alongside ANSA for mission execution, Mission Studio for planning, Certanity for simulation-based validation, and DERYK for AI-assisted operational insights. This enables organizations to move from mission planning to live fleet operations while maintaining complete situational awareness throughout every stage of deployment.',
        'Fleet Manager is suitable for organizations operating autonomous drones, robotic inspection systems, industrial vehicles, defense platforms, research fleets, and future aerospace missions. Its scalable architecture supports everything from small operational teams to enterprise deployments managing hundreds or thousands of autonomous machines simultaneously.',
      ]}
      sections={[
        {
          title: 'Key Capabilities',
          items: [
            'Centralized Fleet Monitoring',
            'Real-Time Telemetry',
            'Live Mission Tracking',
            'Remote Mission Assignment',
            'Fleet Health Monitoring',
            'Remote Software & Firmware Updates',
            'Operational Analytics',
            'Alert & Notification System',
            'Multi-User Access Control',
            'Fleet Performance Reporting',
          ],
        },
        {
          title: 'Applications',
          items: [
            'Drone fleet operations',
            'Industrial inspection fleets',
            'Infrastructure monitoring',
            'Defense and security operations',
            'Warehouse robotics',
            'Agricultural automation',
            'Disaster response coordination',
            'Research and testing programs',
          ],
        },
        {
          title: 'Related Platforms',
          items: [
            'ANSA',
            'Mission Studio',
            'Certanity',
            'DERYK',
            'Reality Engine',
          ],
        },
      ]}
    />
  );
}
