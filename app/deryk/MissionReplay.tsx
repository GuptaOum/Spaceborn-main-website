'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowDown, CircleDot } from 'lucide-react';

const events = [
  { time: 0, label: 'MISSION INITIALIZED', phase: 'OBSERVE' },
  { time: 10, label: 'MISSION STARTED', phase: 'ACT' },
  { time: 20, label: 'OBJECTS DETECTED', phase: 'OBSERVE' },
  { time: 30, label: 'WORLD MODEL UPDATED', phase: 'MODEL' },
  { time: 45, label: 'PATH BLOCKED', phase: 'OBSERVE' },
  { time: 50, label: 'POSSIBLE FUTURES MAPPED', phase: 'PREDICT' },
  { time: 60, label: 'SAFE ROUTE SELECTED', phase: 'DECIDE' },
  { time: 70, label: 'MANEUVER EXECUTED', phase: 'ACT' },
  { time: 80, label: 'WORLD STATE UPDATED', phase: 'OBSERVE' },
  { time: 120, label: 'TARGET REACHED', phase: 'ACT' },
] as const;

const phases = ['OBSERVE', 'MODEL', 'PREDICT', 'DECIDE', 'ACT'];

function addBuilding(scene: THREE.Scene, x: number, z: number, seed: number) {
  const width = 5 + (seed % 4) * 1.2;
  const depth = 5 + ((seed * 3) % 4) * 1.1;
  const height = 5 + ((seed * 7) % 9) * 1.6;
  const shellColors = ['#344753', '#414746', '#4b4b43', '#2e4352'];
  const roofColors = ['#718184', '#7b7667', '#68777a', '#586b73'];
  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: shellColors[seed % shellColors.length],
      roughness: 0.88,
      metalness: 0.12,
    }),
  );
  shell.position.set(x, height / 2, z);
  scene.add(shell);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.3, 0.25, depth + 0.3),
    new THREE.MeshStandardMaterial({ color: roofColors[seed % roofColors.length], roughness: 0.76 }),
  );
  roof.position.set(x, height + 0.1, z);
  scene.add(roof);

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.08, 0.16, 0.12),
    new THREE.MeshStandardMaterial({ color: seed % 2 === 0 ? '#bd8b55' : '#809b9d', roughness: 0.7, metalness: 0.35 }),
  );
  trim.position.set(x, Math.min(height - 0.8, 3.4), z + depth / 2 + 0.06);
  scene.add(trim);

  const windowColor = seed % 3 === 0 ? '#ffd29a' : '#a9dbe4';
  const windowMaterial = new THREE.MeshBasicMaterial({ color: windowColor, transparent: true, opacity: 0.72 });
  for (let floor = 1; floor < Math.min(4, Math.floor(height / 3)); floor += 1) {
    for (const side of [-1, 1]) {
      const window = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.5, 0.08), windowMaterial);
      window.position.set(x + side * width * 0.24, floor * 2.6, z + depth / 2 + 0.06);
      scene.add(window);
    }
  }

  const vent = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 0.65, 0.85),
    new THREE.MeshStandardMaterial({ color: '#626b69', roughness: 0.8, metalness: 0.25 }),
  );
  vent.position.set(x + width * 0.23, height + 0.53, z - depth * 0.2);
  scene.add(vent);
}

function addDrone(scene: THREE.Scene) {
  const drone = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: '#d9e2df', emissive: '#4a91aa', emissiveIntensity: 0.16, roughness: 0.3, metalness: 0.55 });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: '#27383c', roughness: 0.42, metalness: 0.58 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.38, 2.15), bodyMaterial);
  drone.add(body);

  const rotors: THREE.Group[] = [];
  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 1.75), darkMaterial);
      arm.position.set(x * 0.67, 0, z * 0.62);
      arm.rotation.y = x * z * -0.38;
      drone.add(arm);

      const rotor = new THREE.Group();
      rotor.position.set(x * 1.24, 0.16, z * 1.13);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.12, 12), bodyMaterial);
      rotor.add(hub);
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.035, 0.12), darkMaterial);
      blade.position.y = 0.08;
      rotor.add(blade);
      const secondBlade = blade.clone();
      secondBlade.rotation.y = Math.PI / 2;
      rotor.add(secondBlade);
      drone.add(rotor);
      rotors.push(rotor);
    }
  }

  const light = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 8),
    new THREE.MeshBasicMaterial({ color: '#65e4ef' }),
  );
  light.position.set(0, 0.25, -1.1);
  drone.add(light);
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 10, 8),
    new THREE.MeshBasicMaterial({ color: '#ffbd6c' }),
  );
  beacon.position.set(0, 0.25, 1.05);
  drone.add(beacon);
  const headlight = new THREE.PointLight('#83e8ff', 24, 18, 2);
  headlight.position.set(0, -0.05, -1.05);
  drone.add(headlight);
  drone.scale.setScalar(1.35);
  scene.add(drone);
  return { drone, rotors };
}

function makeRoute(points: THREE.Vector3[], color: string, radius: number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 180, radius, 8, false);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.88 });
  return { curve, mesh: new THREE.Mesh(geometry, material) };
}

export default function MissionReplay() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [replayTime, setReplayTime] = useState(0);
  const replayEvent = [...events].reverse().find((event) => replayTime >= event.time) ?? events[0];
  const obstacleVisible = replayTime >= 45 && replayTime < 80;
  const droneAltitude = replayTime < 10 ? '0.0' : replayTime >= 70 ? '14.1' : '12.4';

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
        const progress = THREE.MathUtils.clamp(-section.getBoundingClientRect().top / travel, 0, 1);
        progressRef.current = progress;
        section.style.setProperty('--flight-progress', `${progress * 100}%`);
        setReplayTime((current) => {
          const next = Math.round(progress * 120);
          return current === next ? current : next;
        });
      });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  useEffect(() => {
    const canvasHost = canvasHostRef.current;
    const section = sectionRef.current;
    if (!canvasHost || !section) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-label', 'Three-dimensional autonomous drone mission replay');
    canvasHost.replaceChildren(canvas);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    } catch {
      canvasHost.dataset.webgl = 'unavailable';
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#829095');
    scene.fog = new THREE.FogExp2('#829095', 0.0065);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 260);
    camera.position.set(-48, 28, 53);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    scene.add(new THREE.HemisphereLight('#ffe0b2', '#34443f', 2.7));
    const keyLight = new THREE.DirectionalLight('#ffd19a', 4.2);
    keyLight.position.set(-28, 52, 36);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight('#9ac9e1', 2.1);
    fillLight.position.set(42, 24, -34);
    scene.add(fillLight);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(180, 150),
      new THREE.MeshStandardMaterial({ color: '#303b3a', roughness: 0.94, metalness: 0.04 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    scene.add(ground);
    const grid = new THREE.GridHelper(160, 40, '#52718c', '#294158');
    grid.position.y = 0.02;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.24;
    scene.add(grid);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: '#394443', roughness: 0.92, metalness: 0.02 });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(150, 5.5), roadMaterial);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.03, 0);
    scene.add(road);
    for (let index = -8; index <= 8; index += 1) {
      const marking = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.13), new THREE.MeshBasicMaterial({ color: '#93a9b6' }));
      marking.rotation.x = -Math.PI / 2;
      marking.position.set(index * 9, 0.06, 0);
      scene.add(marking);
    }

    let seed = 11;
    for (const x of [-54, -40, -26, 26, 40, 54]) {
      for (const z of [-48, -34, -20, 20, 34, 48]) {
        const entryLane = x <= -40 && z >= 34;
        if (entryLane || Math.abs(x + z) < 18) continue;
        addBuilding(scene, x, z, seed++);
      }
    }

    const route = makeRoute([
      new THREE.Vector3(-48, 5, 36),
      new THREE.Vector3(-35, 8, 28),
      new THREE.Vector3(-22, 11, 20),
      new THREE.Vector3(-9, 12, 15),
      new THREE.Vector3(1, 13, 11),
      new THREE.Vector3(13, 15, 5),
      new THREE.Vector3(23, 16, -5),
      new THREE.Vector3(32, 14, -19),
      new THREE.Vector3(42, 7, -36),
    ], '#64cad7', 0.085);
    (route.mesh.material as THREE.MeshBasicMaterial).opacity = 0.68;
    scene.add(route.mesh);

    const plannedRoute = makeRoute([
      new THREE.Vector3(-48, 2, 36),
      new THREE.Vector3(-10, 2, 14),
      new THREE.Vector3(5, 2, 3),
      new THREE.Vector3(42, 2, -36),
    ], '#b9c6bb', 0.028);
    (plannedRoute.mesh.material as THREE.MeshBasicMaterial).opacity = 0.28;
    scene.add(plannedRoute.mesh);

    const forecastMaterial = new THREE.MeshBasicMaterial({ color: '#92b9ea', transparent: true, opacity: 0.24 });
    const forecastRoutes = [
      [[-7, 13, 16], [1, 18, -4], [17, 15, -19], [42, 7, -36]],
      [[-7, 13, 16], [8, 9, 22], [25, 9, 1], [42, 7, -36]],
    ].map((points) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points.map((point) => new THREE.Vector3(point[0], point[1], point[2]))),
        forecastMaterial.clone(),
      );
      scene.add(line);
      return line;
    });

    const hazard = new THREE.Group();
    const hazardMaterial = new THREE.MeshStandardMaterial({ color: '#d79539', emissive: '#7d3c11', emissiveIntensity: 0.65, roughness: 0.58 });
    const craneMast = new THREE.Mesh(new THREE.BoxGeometry(0.55, 15, 0.55), hazardMaterial);
    craneMast.position.y = 7.5;
    hazard.add(craneMast);
    const craneBoom = new THREE.Mesh(new THREE.BoxGeometry(18, 0.52, 0.55), hazardMaterial);
    craneBoom.position.set(6, 14, 0);
    hazard.add(craneBoom);
    const hazardBounds = new THREE.Mesh(
      new THREE.BoxGeometry(16, 0.08, 12),
      new THREE.MeshBasicMaterial({ color: '#eaa348', wireframe: true, transparent: true, opacity: 0.55 }),
    );
    hazardBounds.position.set(5, 0.3, 2);
    hazard.add(hazardBounds);
    scene.add(hazard);

    const target = new THREE.Group();
    const targetRing = new THREE.Mesh(
      new THREE.TorusGeometry(5, 0.17, 8, 56),
      new THREE.MeshBasicMaterial({ color: '#7ee7cb' }),
    );
    targetRing.rotation.x = Math.PI / 2;
    targetRing.position.y = 0.35;
    target.add(targetRing);
    const targetBeacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 9, 10),
      new THREE.MeshBasicMaterial({ color: '#6ecfbf', transparent: true, opacity: 0.34 }),
    );
    targetBeacon.position.y = 4.5;
    target.add(targetBeacon);
    target.position.set(42, 0, -36);
    scene.add(target);

    const { drone, rotors } = addDrone(scene);
    const droneShadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 24),
      new THREE.MeshBasicMaterial({ color: '#02070c', transparent: true, opacity: 0.5 }),
    );
    droneShadow.rotation.x = -Math.PI / 2;
    droneShadow.position.y = 0.12;
    scene.add(droneShadow);

    const resize = () => {
      const width = section.clientWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(section);
    resize();

    let animationFrame = 0;
    const cameraGoal = new THREE.Vector3();
    const lookGoal = new THREE.Vector3();
    const smoothLook = new THREE.Vector3();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let renderedProgress = progressRef.current;
    let previousFrameTime = performance.now();
    let elapsedTime = 0;
    let cameraInitialized = false;
    const animate = () => {
      animationFrame = requestAnimationFrame(animate);
      const frameTime = performance.now();
      const delta = Math.min((frameTime - previousFrameTime) / 1000, 0.05);
      previousFrameTime = frameTime;
      elapsedTime += delta;
      const targetProgress = progressRef.current;
      renderedProgress = reducedMotion.matches
        ? targetProgress
        : THREE.MathUtils.damp(renderedProgress, targetProgress, 8, delta);
      const progress = renderedProgress;
      const position = route.curve.getPointAt(progress);
      const tangent = route.curve.getTangentAt(progress).normalize();
      drone.position.copy(position);
      drone.rotation.y = Math.atan2(tangent.x, tangent.z);
      drone.rotation.z = -tangent.y * 0.7;
      rotors.forEach((rotor, index) => { rotor.rotation.y += (index % 2 === 0 ? 1 : -1) * delta * 24; });
      droneShadow.position.x = position.x;
      droneShadow.position.z = position.z;
      droneShadow.scale.setScalar(1 + position.y * 0.035);

      cameraGoal.set(position.x - tangent.x * 13, position.y + 9 + progress * 3, position.z - tangent.z * 13);
      lookGoal.copy(position).addScaledVector(tangent, 5);
      if (cameraInitialized) {
        const follow = 1 - Math.exp(-delta * 7);
        camera.position.lerp(cameraGoal, follow);
        smoothLook.lerp(lookGoal, follow);
      } else {
        camera.position.copy(cameraGoal);
        smoothLook.copy(lookGoal);
        cameraInitialized = true;
      }
      camera.lookAt(smoothLook);

      const danger = progress >= 0.36 && progress < 0.67;
      hazard.visible = danger;
      forecastRoutes.forEach((line) => { line.visible = progress >= 0.42 && progress < 0.61; });
      targetRing.scale.setScalar(1 + Math.sin(elapsedTime * 1.4) * 0.08);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      scene.traverse((object: any) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material: any) => material.dispose());
        }
      });
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  const jumpTo = (time: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const progress = time / 120;
    const travel = section.offsetHeight - window.innerHeight;
    window.scrollTo({ top: window.scrollY + section.getBoundingClientRect().top + progress * travel, behavior: 'smooth' });
  };

  return <section className={`mission-replay${obstacleVisible ? ' is-blocked' : ''}`} id="replay" ref={sectionRef}>
    <div className="replay-pin">
      <div className="replay-canvas" ref={canvasHostRef} />
      <div className="replay-atmosphere" />
      <header className="replay-topbar">
        <a href="#top" className="replay-brand">DERYK <span>/ FIELD SIMULATION</span></a>
        <span className="replay-sector"><i /> SECTOR 04 / INDUSTRIAL INSPECTION</span>
        <span className="replay-clock">{String(Math.floor(replayTime / 60)).padStart(2, '0')}:{String(replayTime % 60).padStart(2, '0')} <small>SIM TIME</small></span>
      </header>

      <div className="replay-copy">
        <span className="replay-eyebrow">MISSION REPLAY / OPIP-2048</span>
        <h2>See the world.<br /><em>Change the plan.</em></h2>
        <div className="replay-event" key={replayEvent.label}>
          <span>{replayEvent.phase} / WORLD STATE {replayTime >= 30 ? 'KNOWN' : 'FORMING'}</span>
          <strong>{replayEvent.label}</strong>
        </div>
      </div>

      <aside className="replay-hud">
        <div className="replay-hud-heading"><span>MISSION STATE</span><i className={obstacleVisible ? 'warning' : ''} /></div>
        <div className="replay-stat"><span>STATUS</span><b>{obstacleVisible ? 'REROUTING' : replayTime >= 120 ? 'COMPLETE' : replayTime >= 10 ? 'IN FLIGHT' : 'STANDBY'}</b></div>
        <div className="replay-stat"><span>ALTITUDE</span><b>{droneAltitude} m</b></div>
        <div className="replay-stat"><span>VELOCITY</span><b>{replayTime >= 70 ? '5.1' : replayTime >= 10 ? '4.2' : '0.0'} m/s</b></div>
        <div className="replay-stat"><span>TRACKED</span><b>{replayTime >= 20 ? '07' : '00'}</b></div>
        <div className="replay-safety"><CircleDot size={13} /><span>{obstacleVisible ? 'CRANE DETECTED / SAFE ROUTE SELECTED' : 'SIMULATED ENVIRONMENT / NO LIVE HARDWARE'}</span></div>
      </aside>

      <div className="replay-bottom">
        <div className="replay-scroll-label"><ArrowDown size={14} /><span>SCROLL TO FLY</span><small>THE MISSION UNFOLDS WITH YOU</small></div>
        <div className="replay-timeline">
          <div className="replay-timeline-track"><i />{events.map((event) => <button key={event.time} type="button" style={{ left: `${(event.time / 120) * 100}%` }} className={replayTime >= event.time ? 'active' : ''} onClick={() => jumpTo(event.time)} aria-label={`Jump to ${event.label}`}><i /><span>{event.label}</span></button>)}</div>
          <div className="replay-phases">{phases.map((phase) => <span className={replayEvent.phase === phase ? 'active' : ''} key={phase}>{phase}</span>)}</div>
        </div>
        <span className="replay-progress-text">{String(Math.floor(replayTime / 60)).padStart(2, '0')}:{String(replayTime % 60).padStart(2, '0')} <i>/ 02:00</i></span>
      </div>
    </div>
  </section>;
}