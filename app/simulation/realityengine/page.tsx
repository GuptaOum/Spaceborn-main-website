"use client";

import React from "react";

const skills = [
  {
    title: "S01 — ANSA SITL Kernel",
    description:
      "Run production flight-control software in a fully virtualized environment, enabling realistic testing of autopilots, sensors, actuators, and failsafe behavior before deployment.",
  },
  {
    title: "S02 — Digital Twin",
    description:
      "Create a physically accurate virtual replica of your vehicle, modeling dynamics, motors, aerodynamics, mass distribution, and structural behavior.",
  },
  {
    title: "S03 — Fault & Failure Injector",
    description:
      "Test autonomy against realistic failures by injecting motor faults, sensor dropouts, actuator failures, structural damage, and communication issues.",
  },
  {
    title: "S04 — GPS-Denied Navigation",
    description:
      "Evaluate autonomous navigation when GPS is unavailable or unreliable using visual-inertial odometry, LiDAR localization, and dead-reckoning systems.",
  },
  {
    title: "S05 — Swarm & Fleet Coordinator",
    description:
      "Simulate and coordinate fleets of autonomous vehicles with distributed task allocation, formation control, collision avoidance, and realistic communication constraints.",
  },
  {
    title: "S06 — LiDAR & Depth Perception",
    description:
      "Generate realistic LiDAR point clouds with sensor noise, occlusion, weather effects, and signal attenuation for testing perception, SLAM, and obstacle avoidance.",
  },
  {
    title: "S07 — Khonsu Space Simulator",
    description:
      "Simulate orbital missions, satellite constellations, ground-station interactions, and space-to-ground communications in a dedicated space-domain environment.",
  },
  {
    title: "S08 — Telemetry Anomaly Engine",
    description:
      "Record, replay, and stress-test mission telemetry by introducing realistic corruption, delays, dropouts, and timing anomalies.",
  },
  {
    title: "S09 — HAL Portability Emulator",
    description:
      "Virtualize embedded hardware and driver interfaces to run and validate flight software against hardware-compatible environments without physical flight controllers.",
  },
  {
    title: "S10 — Mission Intelligence Simulator",
    description:
      "Turn mission objectives into executable flight plans and dynamically replan autonomous missions as conditions, risks, and priorities change.",
  },
  {
    title: "S11 — Communication & Network Simulator",
    description:
      "Model real-world communication networks across MAVLink, ROS 2, LTE, 5G, mesh, LoRa, and satellite links under latency, packet loss, jamming, and network failures.",
  },
  {
    title: "S12 — Environment & Weather Simulator",
    description:
      "Recreate challenging environmental conditions including wind, rain, fog, dust, snow, temperature, glare, and electromagnetic interference.",
  },
  {
    title: "S13 — Power & Battery Simulator",
    description:
      "Model battery aging, voltage sag, thermal behavior, current spikes, and power failures to validate endurance, failsafes, and power-management systems.",
  },
  {
    title: "S14 — Vision & Camera Simulator",
    description:
      "Generate realistic RGB, thermal, infrared, stereo, and event-camera imagery with lens effects, motion blur, and environmental visibility changes.",
  },
  {
    title: "S15 — Cybersecurity Simulator",
    description:
      "Stress-test autonomous systems against GPS spoofing, telemetry injection, protocol attacks, replay attacks, and unauthorized commands in a controlled environment.",
  },
  {
    title: "S16 — Manufacturing & Factory Simulator",
    description:
      "Digitally simulate manufacturing workflows, PCB assembly, testing, calibration, and production lines to validate manufacturing readiness before physical production.",
  },
  {
    title: "S17 — Human Operator Simulator",
    description:
      "Model human behavior in the loop, including delayed reactions, incorrect commands, fatigue, and stress, to improve human-autonomy interaction and AI assistance.",
  },
  {
    title: "S18 — Dataset Generation Engine",
    description:
      "Automatically generate large-scale, labeled synthetic datasets across vision, LiDAR, GPS, IMU, telemetry, faults, and SLAM for AI training and research.",
  },
  {
    title: "S19 — Digital Earth Simulator",
    description:
      "Recreate real-world locations using terrain, buildings, cities, forests, rivers, and geographic data to rehearse autonomous missions anywhere on Earth.",
  },
  {
    title: "S20 — Reality Validation Engine",
    description:
      "Quantify simulation fidelity by comparing simulated and real-world hardware behavior across sensors, control systems, and flight dynamics to produce a measurable Reality Score.",
  },
  {
    title: "S21 — Multi-Domain Simulator",
    description:
      "Coordinate complex missions across air, ground, space, and marine vehicles, enabling unified simulation of multi-domain autonomous operations.",
  },
  {
    title: "S22 — DERYK Cognitive Simulator",
    description:
      "Evaluate DERYK's reasoning, memory, planning, tool use, and failure recovery through challenging synthetic missions without requiring physical hardware.",
  },
  {
    title: "S23 — PointCloud → LaserScan Simulator",
    description:
      "Convert 3D LiDAR point clouds into 2D laser scans for seamless testing of existing SLAM, navigation, and obstacle-avoidance systems.",
  },
  {
    title: "S24 — Zero Sensor Simulator",
    description:
      "Provide lightweight virtual sensor interfaces for rapidly testing autopilot, telemetry, and mission software without requiring fully modeled sensors.",
  },
];

export default function RealityEnginePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "60px 40px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      
    >
        <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap');
    `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div style={{ marginBottom: "45px" }}>
       <h1
  style={{
    margin: 0,
    marginBottom: "10px",
    fontSize: "48px",
    lineHeight: "1",
    fontWeight: 900,
    letterSpacing: "1px",
    fontFamily: "Ethnocentric",
    textTransform: "uppercase",
  }}
>
  REALITY ENGINE
</h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "white"
            }}
          >
            Test Reality Before Reality.
          </p>
        </div>

        {/* INTRODUCTION */}

        <section style={{ marginBottom: "55px" }}>
          <p
            style={{
              margin: "0 0 25px 0",
              fontSize: "18px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Reality Engine is Spaceborn&apos;s high-fidelity simulation
            environment designed to recreate the physical world with exceptional
            realism for autonomous systems development. It serves as the foundation
            upon which developers can safely design, test, validate, and optimize
            intelligent machines before they are deployed into real-world
            environments. By accurately simulating physics, terrain, weather,
            lighting, and sensor behavior, Reality Engine enables organizations to
            reduce development risks while accelerating innovation.
          </p>

          <p
            style={{
              margin: "0 0 25px 0",
              fontSize: "18px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Developing autonomous systems requires extensive testing under
            countless operating conditions, many of which are difficult, expensive,
            or unsafe to reproduce in reality. Reality Engine bridges this gap by
            creating digital environments that closely mimic real-world scenarios.
            Whether simulating dense urban landscapes, remote industrial
            facilities, forests, deserts, airports, or disaster zones, the platform
            provides a realistic environment where autonomous machines can safely
            learn, adapt, and improve their performance.
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            At its core, Reality Engine combines advanced physics simulation with
            highly accurate environmental modeling to ensure that every interaction
            behaves as expected. Vehicles respond to terrain conditions, sensors
            experience realistic noise and interference, weather affects visibility
            and navigation, and environmental objects interact according to
            physical laws. This level of fidelity allows developers to confidently
            evaluate navigation algorithms, perception systems, mission planning
            strategies, and autonomous decision-making before any hardware leaves
            the laboratory.
          </p>
        </section>

        {/* ================================
            24 CARDS
        ================================= */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            width: "100%",
          }}
        >
          {skills.map((skill, index) => (
            <div
              key={index}
              style={{
                minHeight: "210px",
                padding: "25px",
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "#000",
                display: "flex",
                flexDirection: "column",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.035)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#000";
              }}
            >
              {/* CARD TITLE */}

              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "24px",
                  lineHeight: 1.4,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {skill.title}
              </h2>

              {/* CARD DESCRIPTION */}

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.68)",
                }}
              >
                {skill.description}
              </p>

              {/* CARD LINK */}

              <span
                style={{
                  marginTop: "auto",
                  paddingTop: "25px",
                  fontSize: "13px",
                  color: "#fff",
                }}
              >
                Use Skill →
              </span>
            </div>
          ))}
        </section>

        {/* LOWER CONTENT */}

        <section style={{ marginTop: "55px" }}>
          <p
            style={{
              margin: "0 0 25px 0",
              fontSize: "18px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Reality Engine is fully integrated into the Spaceborn ecosystem.
            Developers can import missions created in Mission Studio, execute
            autonomy software powered by ANSA, validate AI models developed with
            DERYK, and monitor performance through Fleet Manager. This seamless
            integration creates a continuous development workflow where software
            can move from simulation to deployment with minimal modification.
          </p>

          <p
            style={{
              margin: "0 0 25px 0",
              fontSize: "18px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Designed for scalability, Reality Engine supports everything from
            single autonomous vehicles to large fleets operating simultaneously
            in complex environments. It is equally suited for research
            institutions, industrial automation, defense applications, aerospace
            development, robotics companies, and educational organizations
            seeking a reliable simulation platform for intelligent systems.
          </p>

          <p
            style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            By allowing engineers to &quot;test reality before reality,&quot;
            Reality Engine significantly reduces operational costs, shortens
            development cycles, improves system reliability, and enables safer
            deployment of autonomous technologies across a wide range of
            industries.
          </p>
        </section>

        {/* BOTTOM INFORMATION */}

        <section
          style={{
            marginTop: "55px",
            paddingTop: "30px",
            borderTop: "1px solid rgba(255,255,255,0.18)",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }}
        >
          <div
            style={{
              paddingRight: "30px",
              borderRight: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <h3
              style={{
                margin: "0 0 18px 0",
                fontSize: "18px",
              }}
            >
              Key Capabilities
            </h3>

            {[
              "High-fidelity physics simulation",
              "Dynamic weather systems",
              "Realistic terrain generation",
              "Environmental lighting simulation",
              "Sensor modeling and simulation",
              "Digital Twin integration",
              "Mission replay and debugging",
              "Multi-vehicle simulation",
              "Real-time visualization",
              "Performance analytics",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: "9px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                — {item}
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "0 30px",
              borderRight: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <h3
              style={{
                margin: "0 0 18px 0",
                fontSize: "24px",
              }}
            >
              Applications
            </h3>

            {[
              "Autonomous drone testing",
              "Robotics development",
              "Defense mission validation",
              "Aerospace system simulation",
              "Industrial automation",
              "Digital Twin environments",
              "AI model training",
              "Academic research",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: "9px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                — {item}
              </div>
            ))}
          </div>

          <div style={{ paddingLeft: "30px" }}>
            <h3
              style={{
                margin: "0 0 18px 0",
                fontSize: "18px",
              }}
            >
              Related Platforms
            </h3>

            {[
              "Certanity",
              "ANSA",
              "Mission Studio",
              "DERYK",
              "Fleet Manager",
            ].map((item) => (
              <div
                key={item}
                style={{
                  marginBottom: "9px",
                  fontSize: "15px",
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                — {item}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RESPONSIVE CSS */}

      <style jsx>{`
        @media (max-width: 900px) {
          main {
            padding: 40px 25px !important;
          }

          section[style*="repeat(3"] {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 600px) {
          main {
            padding: 30px 18px !important;
          }

          section[style*="repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}