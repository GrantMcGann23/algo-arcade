import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
function AnimatedBackground() {
    return (_jsxs(_Fragment, { children: [_jsx("color", { attach: "background", args: ['#000'] }), _jsx(Stars, { radius: 150, depth: 60, count: 6000, factor: 7, saturation: 0, fade: true }), _jsx("ambientLight", { intensity: 0.5 }), _jsx("directionalLight", { position: [10, 10, 10], intensity: 1 }), _jsxs("mesh", { rotation: [0.5, 0.5, 0], children: [_jsx("boxGeometry", { args: [2, 2, 2] }), _jsx("meshStandardMaterial", { color: "hotpink" })] })] }));
}
export default function HomeScreen() {
    return (_jsxs("div", { className: "root-container", children: [_jsx(Canvas, { className: "canvas-3d", children: _jsx(AnimatedBackground, {}) }), _jsxs("div", { className: "overlay", children: [_jsx("h1", { className: "title", children: "ALGORITHM ARCADE" }), _jsxs("ul", { style: { listStyle: 'none', padding: 0 }, children: [_jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/sorting-showdown", children: "SORTING SHOWDOWN" }) }), _jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/binary-tree-explorer", children: "BINARY TREE EXPLORER (BFS/DFS)" }) }), _jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/weighted-graph-explorer", children: "WEIGHTED GRAPH EXPLORER (Dijkstra / A* / Bellman-Ford)" }) }), _jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/dp-dungeon", children: "DYNAMIC PROGRAMMING DUNGEON" }) }), _jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/data-defender", children: "DATA STRUCTURE DEFENDER" }) }), _jsx("li", { style: { margin: '10px 0' }, children: _jsx(Link, { to: "/visualizer", children: "ALGORITHM VISUALIZER" }) })] })] })] }));
}
