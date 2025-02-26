/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />

import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function AnimatedBackground() {
  return (
    <>
      <color attach="background" args={['#000']} />
      <Stars radius={150} depth={60} count={6000} factor={7} saturation={0} fade />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <mesh rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </>
  );
}

export default function HomeScreen() {
  return (
    <div className="root-container">
      <Canvas className="canvas-3d">
        <AnimatedBackground />
      </Canvas>
      <div className="overlay">
        <h1 className="title">ALGORITHM ARCADE</h1>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <Link to="/sorting-showdown">SORTING SHOWDOWN</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            {/* BFS/DFS on a Binary Tree */}
            <Link to="/binary-tree-explorer">BINARY TREE EXPLORER (BFS/DFS)</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            {/* Weighted Graph Explorer */}
            <Link to="/weighted-graph-explorer">
              WEIGHTED GRAPH EXPLORER (Dijkstra / A* / Bellman-Ford)
            </Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/dp-dungeon">DYNAMIC PROGRAMMING DUNGEON</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/data-defender">DATA STRUCTURE DEFENDER</Link>
          </li>
          <li style={{ margin: '10px 0' }}>
            <Link to="/visualizer">ALGORITHM VISUALIZER</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
