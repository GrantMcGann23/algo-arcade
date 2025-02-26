/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const RotatingCube = () => {
  const meshRef = useRef<any>(null);

  // Rotate the cube on each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
};

const Scene = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <RotatingCube />
    </Canvas>
  );
};

export default Scene;
