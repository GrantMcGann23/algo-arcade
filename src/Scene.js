import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
const RotatingCube = () => {
    const meshRef = useRef(null);
    // Rotate the cube on each frame
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });
    return (_jsxs("mesh", { ref: meshRef, children: [_jsx("boxGeometry", { args: [1, 1, 1] }), _jsx("meshStandardMaterial", { color: "royalblue" })] }));
};
const Scene = () => {
    return (_jsxs(Canvas, { style: { height: '100vh', width: '100vw' }, children: [_jsx("ambientLight", { intensity: 0.5 }), _jsx("directionalLight", { position: [5, 5, 5], intensity: 1 }), _jsx(RotatingCube, {})] }));
};
export default Scene;
