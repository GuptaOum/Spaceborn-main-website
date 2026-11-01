'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RenderTileGrid.module.css';

// 6 columns x 5 rows grid = 30 cells
const COLS = 6;
const ROWS = 5;
const TOTAL_CELLS = COLS * ROWS;

// Tactical pixel patterns inspired by Render's cold-start pixel grid & Spaceborn autonomy telemetry
interface TileData {
  id: string;
  label: string;
  color: string;
  pattern: number[]; // 8x8 bitmap array (64 bits, 1 = colored pixel, 0 = transparent)
}

// 8x8 tactical patterns: 1=active pixel, 0=empty
const TILE_PRESETS: TileData[] = [
  {
    id: 't1',
    label: 'ANSA-HAL',
    color: '#8b5cf6', // Violet
    pattern: [
      0,0,0,1,1,0,0,0,
      0,0,1,1,1,1,0,0,
      0,1,1,0,0,1,1,0,
      1,1,0,1,1,0,1,1,
      1,1,0,1,1,0,1,1,
      1,1,1,1,1,1,1,1,
      1,0,1,1,1,1,0,1,
      1,0,1,0,0,1,0,1,
    ],
  },
  {
    id: 't2',
    label: 'SWARM-01',
    color: '#a855f7', // Purple
    pattern: [
      0,0,0,0,0,0,0,0,
      0,0,1,0,0,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,0,1,1,0,1,1,
      1,1,1,1,1,1,1,1,
      0,0,1,0,0,1,0,0,
      0,1,0,0,0,0,1,0,
      1,0,0,0,0,0,0,1,
    ],
  },
  {
    id: 't3',
    label: 'GATE-FPGA',
    color: '#ec4899', // Pink / Magenta (matches Render dot)
    pattern: [
      0,0,0,0,0,0,0,0,
      0,1,1,0,0,1,1,0,
      1,1,1,1,1,1,1,1,
      1,1,1,0,0,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0,
      0,0,0,1,1,0,0,0,
      0,0,0,0,0,0,0,0,
    ],
  },
  {
    id: 't4',
    label: 'LIDAR-CORE',
    color: '#10b981', // Emerald / Neon Green
    pattern: [
      1,0,0,0,0,0,0,1,
      0,1,0,0,0,0,1,0,
      0,0,1,1,1,1,0,0,
      0,0,1,0,0,1,0,0,
      0,0,1,0,0,1,0,0,
      0,0,1,1,1,1,0,0,
      0,1,0,0,0,0,1,0,
      1,0,0,0,0,0,0,1,
    ],
  },
  {
    id: 't5',
    label: 'DERYK-NET',
    color: '#06b6d4', // Cyan
    pattern: [
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,0,1,1,0,1,1,
      1,1,1,1,1,1,1,1,
      0,1,0,1,1,0,1,0,
      1,0,0,0,0,0,0,1,
      1,1,0,0,0,0,1,1,
      0,0,0,0,0,0,0,0,
    ],
  },
  {
    id: 't6',
    label: 'IMU-50HZ',
    color: '#8b5cf6',
    pattern: [
      0,0,0,1,0,0,0,0,
      0,0,1,1,0,0,0,0,
      0,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,0,
      0,1,1,1,1,1,1,1,
      0,0,1,1,0,0,0,0,
      0,0,0,1,0,0,0,0,
      0,0,0,0,0,0,0,0,
    ],
  },
  {
    id: 't7',
    label: 'RADAR-RF',
    color: '#d946ef', // Fuchsia
    pattern: [
      1,1,1,1,1,1,1,1,
      1,0,0,0,0,0,0,1,
      1,0,1,1,1,1,0,1,
      1,0,1,0,0,1,0,1,
      1,0,1,1,1,1,0,1,
      1,0,0,0,0,0,0,1,
      1,1,1,1,1,1,1,1,
      0,0,0,0,0,0,0,0,
    ],
  },
  {
    id: 't8',
    label: 'EDGE-COMP',
    color: '#6366f1', // Indigo
    pattern: [
      0,1,1,1,1,1,1,0,
      1,0,0,0,0,0,0,1,
      1,0,1,0,0,1,0,1,
      1,0,0,1,1,0,0,1,
      1,0,0,1,1,0,0,1,
      1,0,1,0,0,1,0,1,
      1,0,0,0,0,0,0,1,
      0,1,1,1,1,1,1,0,
    ],
  },
  {
    id: 't9',
    label: 'TERRAIN-MAP',
    color: '#10b981',
    pattern: [
      0,0,0,0,0,0,1,1,
      0,0,0,0,1,1,1,1,
      0,0,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      1,1,1,1,1,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0,
      0,0,0,1,1,0,0,0,
    ],
  },
  {
    id: 't10',
    label: 'SITL-SIM',
    color: '#a855f7',
    pattern: [
      1,1,0,0,0,0,1,1,
      1,1,1,0,0,1,1,1,
      0,1,1,1,1,1,1,0,
      0,0,1,1,1,1,0,0,
      0,1,1,1,1,1,1,0,
      1,1,1,0,0,1,1,1,
      1,1,0,0,0,0,1,1,
      0,0,0,0,0,0,0,0,
    ],
  },
];

// Initial placement: placed on the right-hand columns (cols 3, 4, 5) just like Render's layout
const INITIAL_GRID: (string | null)[] = [
  null, null, null, null, null, null,
  null, null, null, 't1', 't2', null,
  null, null, null, 't3', 't4', 't5',
  null, null, null, 't6', 't7', 't8',
  null, null, null, 't9', 't10', null,
];

export default function RenderTileGrid() {
  const [grid, setGrid] = useState<(string | null)[]>(INITIAL_GRID);
  const [activeLogs, setActiveLogs] = useState<string[]>([
    '00:00:12 INCOMING TELEMETRY DETECTED ...',
    '00:00:14 HARDWARE KERNEL WAKING UP ...',
    '00:00:16 ALLOCATING COMPUTE NODES ...',
  ]);
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  const [moveCount, setMoveCount] = useState(0);

  // Map tile ID to metadata
  const tileMap = useMemo(() => {
    const map = new Map<string, TileData>();
    TILE_PRESETS.forEach((t) => map.set(t.id, t));
    return map;
  }, []);

  // Check if two cells are adjacent (up, down, left, right)
  const isAdjacent = useCallback((idx1: number, idx2: number) => {
    const r1 = Math.floor(idx1 / COLS);
    const c1 = idx1 % COLS;
    const r2 = Math.floor(idx2 / COLS);
    const c2 = idx2 % COLS;
    return (Math.abs(r1 - r2) + Math.abs(c1 - c2)) === 1;
  }, []);

  // Slide a tile to an adjacent empty spot
  const slideTile = useCallback((fromIndex: number, toIndex: number) => {
    setGrid((prev) => {
      if (prev[toIndex] !== null || prev[fromIndex] === null) return prev;
      const next = [...prev];
      next[toIndex] = next[fromIndex];
      next[fromIndex] = null;
      return next;
    });
    setMoveCount((c) => c + 1);
  }, []);

  // When hovering or clicking an empty cell, check if an adjacent cell has a tile to slide in
  const handleCellHover = useCallback((cellIndex: number) => {
    // If the cell is empty, find an adjacent tile and slide it in!
    setGrid((current) => {
      if (current[cellIndex] !== null) return current;

      // Find adjacent filled neighbor
      const neighbors = [
        cellIndex - 1 >= 0 && cellIndex % COLS !== 0 ? cellIndex - 1 : -1,
        cellIndex + 1 < TOTAL_CELLS && (cellIndex + 1) % COLS !== 0 ? cellIndex + 1 : -1,
        cellIndex - COLS >= 0 ? cellIndex - COLS : -1,
        cellIndex + COLS < TOTAL_CELLS ? cellIndex + COLS : -1,
      ].filter((n) => n >= 0 && current[n] !== null);

      if (neighbors.length > 0) {
        // Slide the first adjacent tile into this empty cell
        const fromIndex = neighbors[Math.floor(Math.random() * neighbors.length)];
        const tileId = current[fromIndex];
        const next = [...current];
        next[cellIndex] = tileId;
        next[fromIndex] = null;
        setMoveCount((c) => c + 1);
        return next;
      }
      return current;
    });
  }, []);

  // Click on a tile to slide it into any adjacent empty cell
  const handleTileClick = useCallback((index: number) => {
    const tileId = grid[index];
    if (!tileId) return;

    const neighbors = [
      index - 1 >= 0 && index % COLS !== 0 ? index - 1 : -1,
      index + 1 < TOTAL_CELLS && (index + 1) % COLS !== 0 ? index + 1 : -1,
      index - COLS >= 0 ? index - COLS : -1,
      index + COLS < TOTAL_CELLS ? index + COLS : -1,
    ].filter((n) => n >= 0 && grid[n] === null);

    if (neighbors.length > 0) {
      slideTile(index, neighbors[0]);
    }
  }, [grid, slideTile]);

  // Reset grid
  const handleReset = useCallback(() => {
    setGrid(INITIAL_GRID);
    setMoveCount(0);
    setActiveLogs([
      '00:00:12 INCOMING TELEMETRY DETECTED ...',
      '00:00:14 HARDWARE KERNEL WAKING UP ...',
      '00:00:16 ALLOCATING COMPUTE NODES ...',
      '00:00:19 RECONFIGURED GRID TO DEFAULT STATE',
    ]);
  }, []);

  // Auto-scramble / autonomous solve effect
  const handleRandomize = useCallback(() => {
    setGrid((prev) => {
      const tiles = prev.filter(Boolean) as string[];
      // Fill random indices
      const indices = Array.from({ length: TOTAL_CELLS }, (_, i) => i);
      // Shuffle indices
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const next = new Array(TOTAL_CELLS).fill(null);
      tiles.forEach((t, i) => {
        next[indices[i]] = t;
      });
      return next;
    });
    setMoveCount((c) => c + 10);
    setActiveLogs((prev) => [
      ...prev.slice(-3),
      `00:00:${20 + Math.floor(Math.random() * 30)} DYNAMIC COMPUTE BALANCING COMPLETE`,
    ]);
  }, []);

  // Periodic log tick
  useEffect(() => {
    const timer = setInterval(() => {
      const msgs = [
        '50 HZ STATE ESTIMATION NOMINAL',
        'LIDAR POINT CLUSTER SYNCHRONIZED',
        'SWARM HEARTBEAT ACKNOWLEDGED',
        'STM32H7 DIRECT DMA BUFFER STREAMING',
        'THERMAL MARGIN NOMINAL (+38.4C)',
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      const sec = String(Math.floor(Date.now() / 1000) % 60).padStart(2, '0');
      setActiveLogs((prev) => [...prev.slice(-4), `00:00:${sec} ${randomMsg}`]);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.section} id="telemetry-matrix">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowPulse} />
            04 REAL-TIME TELEMETRY MATRIX
          </div>
          <h2 className={styles.title}>AUTONOMOUS COLD-START RECONFIGURATION.</h2>
          <p className={styles.lede}>
            Inspired by Render&apos;s dynamic wake-up tile architecture. Interactive edge compute matrix where sensor fusion nodes and kernel threads slide seamlessly across the physical instance fabric. Hover or click tiles to route telemetry in real time.
          </p>
        </div>

        {/* The Dual-Pane Console & Interactive Grid Container */}
        <div className={styles.consoleCard}>
          {/* Left Panel: Terminal & ASCII Banner */}
          <div className={styles.terminalPanel}>
            <div className={styles.terminalHeader}>
              <div className={styles.terminalBrand}>
                <svg className={styles.terminalIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 17L10 11L4 5M12 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={styles.terminalTitle}>SPACEBORN TELEMETRY DAEMON</span>
              </div>
              <span className={styles.terminalStatus}>[SYS_ACTIVE]</span>
            </div>

            {/* ASCII Banner Box */}
            <div className={styles.asciiBox}>
              <pre className={styles.asciiText}>
{`+--------------------------------------+
|       SPACEBORN EDGE RUNTIME         |
|      ANSA AUTONOMY KERNEL V2.4       |
+--------------------------------------+`}
              </pre>
            </div>

            {/* Terminal Logs */}
            <div className={styles.logsList}>
              {activeLogs.map((log, i) => (
                <div key={i} className={styles.logLine}>
                  <span className={styles.logTimestamp}>{log.slice(0, 8)}</span>
                  <span className={styles.logContent}>{log.slice(8)}</span>
                </div>
              ))}
              <div className={styles.terminalPrompt}>
                <span className={styles.promptSymbol}>&gt;</span>
                <span className={styles.promptCursor} />
              </div>
            </div>

            {/* Tactical Metrics & Interactive Controls */}
            <div className={styles.terminalFooter}>
              <div className={styles.metricsRow}>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>ACTIVE NODES</span>
                  <span className={styles.metricValue}>10 / 30</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>ROUTED HOVERS</span>
                  <span className={styles.metricValue}>{moveCount}</span>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricLabel}>LATENCY</span>
                  <span className={styles.metricValue}>&lt; 1.2 MS</span>
                </div>
              </div>

              <div className={styles.controlButtons}>
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={handleRandomize}
                >
                  BALANCE CLUSTER
                </button>
                <button
                  type="button"
                  className={styles.btnGhost}
                  onClick={handleReset}
                >
                  DEFAULT SEED
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: The Sliding Tile Matrix Grid */}
          <div className={styles.gridPanel}>
            <div className={styles.gridHeader}>
              <span className={styles.gridLabel}>PHYSICAL COMPUTE FABRIC</span>
              <span className={styles.gridCoordinates}>GRID 6x5 :: 50HZ BUS</span>
            </div>

            <div className={styles.tileGrid}>
              {grid.map((tileId, idx) => {
                const tile = tileId ? tileMap.get(tileId) : null;
                const isHovered = hoveredTile === tileId;

                return (
                  <div
                    key={idx}
                    className={`${styles.gridCell} ${tile ? styles.cellOccupied : styles.cellEmpty}`}
                    onPointerEnter={() => handleCellHover(idx)}
                    onClick={() => tile && handleTileClick(idx)}
                  >
                    {tile && (
                      <motion.div
                        layoutId={`tile-${tile.id}`}
                        layout
                        className={styles.tileBlock}
                        style={{
                          backgroundColor: '#0a0a0c',
                          borderColor: tile.color,
                        }}
                        onPointerEnter={() => setHoveredTile(tile.id)}
                        onPointerLeave={() => setHoveredTile(null)}
                        transition={{
                          type: 'spring',
                          stiffness: 320,
                          damping: 26,
                          mass: 0.8,
                        }}
                        whileHover={{
                          scale: 1.04,
                          boxShadow: `0 0 16px ${tile.color}40`,
                        }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {/* 8x8 Pixel Art Matrix (Render-style pixel graphics) */}
                        <div className={styles.pixelMatrix}>
                          {tile.pattern.map((active, pIdx) => (
                            <span
                              key={pIdx}
                              className={styles.pixel}
                              style={{
                                backgroundColor: active ? (pIdx === 20 ? '#ffffff' : tile.color) : 'transparent',
                                opacity: active ? 1 : 0.05,
                              }}
                            />
                          ))}
                        </div>

                        {/* Tactical Tile Header / Label */}
                        <div className={styles.tileFooter}>
                          <span className={styles.tileId}>{tile.label}</span>
                          <span
                            className={styles.tileDot}
                            style={{ backgroundColor: tile.color }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Instruction tooltip */}
            <div className={styles.gridHint}>
              <svg className={styles.hintIcon} viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
              </svg>
              <span>Hover over adjacent empty cells to slide tiles. Click any tile to shift it into open memory slots.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
