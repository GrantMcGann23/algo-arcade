/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />

import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';

interface Node {
  id: number;
  x: number;
  z: number;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
}

// Generate a small 9-node grid-like graph with *randomized* weights
function generateCustomGraph() {
  // Fixed node positions
  const nodes: Node[] = [
    { id: 0, x: 0,   z: 0 },
    { id: 1, x: 10,  z: 0 },
    { id: 2, x: 20,  z: 0 },
    { id: 3, x: 0,   z: 10 },
    { id: 4, x: 10,  z: 10 },
    { id: 5, x: 20,  z: 10 },
    { id: 6, x: 0,   z: 20 },
    { id: 7, x: 10,  z: 20 },
    { id: 8, x: 20,  z: 20 },
  ];

  // We keep the same structure but randomize the weights
  const edges: Edge[] = [
    { from: 0, to: 1, weight: randWeight() },
    { from: 1, to: 2, weight: randWeight() },
    { from: 0, to: 3, weight: randWeight() },
    { from: 1, to: 4, weight: randWeight() },
    { from: 2, to: 5, weight: randWeight() },
    { from: 3, to: 4, weight: randWeight() },
    { from: 4, to: 5, weight: randWeight() },
    { from: 3, to: 6, weight: randWeight() },
    { from: 4, to: 7, weight: randWeight() },
    { from: 5, to: 8, weight: randWeight() },
    { from: 6, to: 7, weight: randWeight() },
    { from: 7, to: 8, weight: randWeight() },
    { from: 2, to: 4, weight: randWeight() },
    { from: 4, to: 6, weight: randWeight() },
  ];

  return { nodes, edges };
}

// Random weight in [1..9]
function randWeight() {
  return 1 + Math.floor(Math.random() * 9);
}

/* ------------------ Dijkstra ------------------ */
function dijkstra(nodes: Node[], edges: Edge[], startId: number, targetId: number): number[] {
  const dist: Record<number, number> = {};
  const prev: Record<number, number | null> = {};
  nodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[startId] = 0;
  const unvisited = new Set(nodes.map(n => n.id));

  while (unvisited.size > 0) {
    let current: number | null = null;
    let minDist = Infinity;
    for (const id of unvisited) {
      if (dist[id] < minDist) {
        minDist = dist[id];
        current = id;
      }
    }
    if (current === null) break;
    if (current === targetId) break;

    unvisited.delete(current);

    for (const e of edges) {
      if (e.from === current || e.to === current) {
        const neighbor = (e.from === current) ? e.to : e.from;
        if (unvisited.has(neighbor)) {
          const alt = dist[current] + e.weight;
          if (alt < dist[neighbor]) {
            dist[neighbor] = alt;
            prev[neighbor] = current;
          }
        }
      }
    }
  }

  if (dist[targetId] === Infinity) return [];
  const path: number[] = [];
  let cur: number | null = targetId;
  while (cur !== null) {
    path.push(cur);
    cur = prev[cur]!;
  }
  return path.reverse();
}

/* ------------------ Bellman-Ford ------------------ */
function bellmanFord(nodes: Node[], edges: Edge[], startId: number, targetId: number): number[] {
  const dist: Record<number, number> = {};
  const prev: Record<number, number | null> = {};
  const n = nodes.length;

  nodes.forEach(n => {
    dist[n.id] = Infinity;
    prev[n.id] = null;
  });
  dist[startId] = 0;

  // Relax edges up to n-1 times
  for (let i = 0; i < n - 1; i++) {
    for (const e of edges) {
      const { from: u, to: v, weight: w } = e;
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
      if (dist[v] + w < dist[u]) {
        dist[u] = dist[v] + w;
        prev[u] = v;
      }
    }
  }

  if (dist[targetId] === Infinity) return [];
  const path: number[] = [];
  let cur: number | null = targetId;
  while (cur !== null) {
    path.push(cur);
    cur = prev[cur]!;
  }
  return path.reverse();
}

/* ------------------ A* ------------------ */
function aStar(nodes: Node[], edges: Edge[], startId: number, targetId: number): number[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  function heuristic(a: number, b: number) {
    const na = nodeMap.get(a)!;
    const nb = nodeMap.get(b)!;
    const dx = na.x - nb.x;
    const dz = na.z - nb.z;
    return Math.sqrt(dx * dx + dz * dz); // Euclidean
  }

  const openSet = new Set<number>([startId]);
  const cameFrom: Record<number, number | null> = {};
  const gScore: Record<number, number> = {};
  const fScore: Record<number, number> = {};

  nodes.forEach(n => {
    gScore[n.id] = Infinity;
    fScore[n.id] = Infinity;
    cameFrom[n.id] = null;
  });
  gScore[startId] = 0;
  fScore[startId] = heuristic(startId, targetId);

  while (openSet.size > 0) {
    let current: number | null = null;
    let minF = Infinity;
    for (const id of openSet) {
      if (fScore[id] < minF) {
        minF = fScore[id];
        current = id;
      }
    }

    if (current === targetId) {
      const path: number[] = [];
      let cur: number | null = targetId;
      while (cur !== null) {
        path.push(cur);
        cur = cameFrom[cur]!;
      }
      return path.reverse();
    }

    openSet.delete(current!);

    // Gather neighbors
    const neighbors: number[] = [];
    for (const e of edges) {
      if (e.from === current) neighbors.push(e.to);
      else if (e.to === current) neighbors.push(e.from);
    }

    for (const neighbor of neighbors) {
      const edge = edges.find(e => 
        (e.from === current && e.to === neighbor) ||
        (e.from === neighbor && e.to === current)
      );
      if (!edge) continue;

      const tentativeG = gScore[current!] + edge.weight;
      if (tentativeG < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeG;
        fScore[neighbor] = tentativeG + heuristic(neighbor, targetId);
        openSet.add(neighbor);
      }
    }
  }

  return [];
}

/* ------------------ WeightedGraphExplorer ------------------ */
export default function WeightedGraphExplorer() {
  // We'll store the graph in state so we can regenerate random weights on reset
  const [graph, setGraph] = useState(() => generateCustomGraph());
  const { nodes, edges } = graph;

  const startId = 0;
  const targetId = 8;

  // We store three separate paths
  const [pathDijk, setPathDijk] = useState<number[]>([]);
  const [pathBF, setPathBF] = useState<number[]>([]);
  const [pathA, setPathA] = useState<number[]>([]);

  // Compute all three paths
  const handleFindPath = () => {
    setPathDijk(dijkstra(nodes, edges, startId, targetId));
    setPathBF(bellmanFord(nodes, edges, startId, targetId));
    setPathA(aStar(nodes, edges, startId, targetId));
  };

  // Reset: randomize weights, clear paths
  const handleReset = () => {
    setGraph(generateCustomGraph());
    setPathDijk([]);
    setPathBF([]);
    setPathA([]);
  };

  // Horizontal offsets for the three groups
  const offsets = {
    dijkstra: -30,
    bellmanFord: 0,
    aStar: 30,
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* UI Panel */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 999,
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '10px 15px',
          borderRadius: '8px',
        }}
      >
        <button onClick={handleFindPath} style={{ padding: '8px 12px', marginRight: '8px', cursor: 'pointer' }}>
          Start
        </button>
        <button onClick={handleReset} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>

      <Canvas
        camera={{ position: [0, 120, 80], fov: 60 }}
        style={{ background: '#222' }}
      >
        <OrbitControls />
        <ambientLight intensity={1} />
        <directionalLight position={[0, 100, 100]} intensity={0.7} />

        {/* Common floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[400, 400]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Render three copies of the same graph side by side */}
        {(['dijkstra', 'bellmanFord', 'aStar'] as const).map(algo => {
          let path: number[] = [];
          let label = '';
          let color = '';

          if (algo === 'dijkstra') {
            path = pathDijk;
            label = 'Dijkstra';
            color = 'orange';
          } else if (algo === 'bellmanFord') {
            path = pathBF;
            label = 'Bellman-Ford';
            color = 'yellow';
          } else {
            path = pathA;
            label = 'A*';
            color = 'lime';
          }

          return (
            <group key={algo} position={[offsets[algo], 0, 0]}>
              {/* Edges with weight labels */}
              {edges.map((e, idx) => {
                const from = nodes.find(n => n.id === e.from)!;
                const to = nodes.find(n => n.id === e.to)!;
                const points = [
                  [from.x, 0, from.z],
                  [to.x, 0, to.z],
                ];
                const midX = (from.x + to.x) / 2;
                const midZ = (from.z + to.z) / 2;

                return (
                  <React.Fragment key={idx}>
                    <Line points={points} color="gray" lineWidth={1} />
                    <Text
                      position={[midX, 0.5, midZ]}
                      fontSize={1.5}
                      color="white"
                      rotation={[-Math.PI / 2, 0, 0]}
                    >
                      {e.weight}
                    </Text>
                  </React.Fragment>
                );
              })}

              {/* Nodes */}
              {nodes.map(n => {
                const inPath = path.includes(n.id);
                return (
                  <mesh key={n.id} position={[n.x, 0, n.z]}>
                    <sphereGeometry args={[2, 16, 16]} />
                    <meshStandardMaterial color={inPath ? 'red' : 'blue'} />
                  </mesh>
                );
              })}

              {/* Computed path */}
              {path.length > 1 && (
                <Line
                  points={path.map(id => {
                    const node = nodes.find(n => n.id === id)!;
                    return [node.x, 0.3, node.z];
                  })}
                  color={color}
                  lineWidth={3}
                />
              )}

              {/* Label above each graph */}
              <Text
                position={[10, 5, -5]} 
                rotation={[-Math.PI / 2, 0, 0]}
                fontSize={3}
                color="white"
              >
                {label}
              </Text>
            </group>
          );
        })}
      </Canvas>
    </div>
  );
}
