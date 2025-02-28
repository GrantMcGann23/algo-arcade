import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
/* ------------------ BINARY TREE DEFINITION ------------------
       0
      / \
     1   2
    / \ / \
   3  4 5  6

We store only child pointers:
 0 -> [1, 2]
 1 -> [3, 4]
 2 -> [5, 6]
 3,4,5,6 -> []
*/
const NODES = [
    { id: 0, x: 0, z: 0 }, // root
    { id: 1, x: -10, z: 10 },
    { id: 2, x: 10, z: 10 },
    { id: 3, x: -15, z: 20 },
    { id: 4, x: -5, z: 20 },
    { id: 5, x: 5, z: 20 },
    { id: 6, x: 15, z: 20 },
];
// Directed edges: parent -> children
const adjacency = new Map([
    [0, [1, 2]],
    [1, [3, 4]],
    [2, [5, 6]],
    [3, []],
    [4, []],
    [5, []],
    [6, []],
]);
/* ------------------ BFS Step Computation ------------------
   Enqueue children in order, so BFS yields: 0, 1, 2, 3, 4, 5, 6
*/
function computeBFSSteps(start) {
    const steps = [];
    const visited = new Set();
    const edgesInTree = new Set();
    const queue = [start];
    visited.add(start);
    steps.push({ visited: new Set(visited), edgesInTree: new Set(edgesInTree) });
    while (queue.length > 0) {
        const current = queue.shift();
        const children = adjacency.get(current); // already in order
        for (const child of children) {
            if (!visited.has(child)) {
                visited.add(child);
                queue.push(child);
                const edgeKey = `${current}-${child}`;
                edgesInTree.add(edgeKey);
                steps.push({ visited: new Set(visited), edgesInTree: new Set(edgesInTree) });
            }
        }
    }
    return steps;
}
/* ------------------ DFS Preorder Step Computation ------------------
   In preorder, we visit the node first, then recursively visit its children.
   Using an iterative approach: push right child first, then left.
   Expected order: 0, 1, 3, 4, 2, 5, 6.
*/
function computeDFSPreorderSteps(start) {
    const steps = [];
    const visited = new Set();
    const edgesInTree = new Set();
    const stack = [start];
    // Mark root as visited immediately
    visited.add(start);
    steps.push({ visited: new Set(visited), edgesInTree: new Set(edgesInTree) });
    while (stack.length > 0) {
        const current = stack.pop();
        const children = adjacency.get(current);
        // Push right first, then left
        if (children.length > 1) {
            if (!visited.has(children[1]))
                stack.push(children[1]);
        }
        if (children.length > 0) {
            if (!visited.has(children[0]))
                stack.push(children[0]);
        }
        // Record edges for any unvisited child
        for (const child of children) {
            if (!visited.has(child)) {
                const edgeKey = `${current}-${child}`;
                edgesInTree.add(edgeKey);
            }
        }
        // If a node is popped and hasn't been recorded yet, mark it visited and record step
        if (!visited.has(current)) {
            visited.add(current);
            steps.push({ visited: new Set(visited), edgesInTree: new Set(edgesInTree) });
        }
    }
    return steps;
}
/* ------------------ DFS Postorder Step Computation ------------------
   In postorder, we recursively traverse left and right subtrees then visit the node.
   We use a recursive helper to record a step after processing children, then mark the node.
*/
function computeDFSPostorderSteps(start) {
    const steps = [];
    const visited = new Set();
    const edgesInTree = new Set();
    function helper(current) {
        const children = adjacency.get(current);
        for (const child of children) {
            // Record edge before recursing
            const edgeKey = `${current}-${child}`;
            edgesInTree.add(edgeKey);
            helper(child);
        }
        visited.add(current);
        steps.push({ visited: new Set(visited), edgesInTree: new Set(edgesInTree) });
    }
    helper(start);
    return steps;
}
/* ------------------ MAIN COMPONENT ------------------ */
export default function BinaryTreeExplorer() {
    const [mode, setMode] = useState('BFS');
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    // Precompute steps for each mode
    const bfsSteps = computeBFSSteps(0);
    const dfsPreSteps = computeDFSPreorderSteps(0);
    const dfsPostSteps = computeDFSPostorderSteps(0);
    let activeSteps = [];
    if (mode === 'BFS')
        activeSteps = bfsSteps;
    else if (mode === 'DFS Preorder')
        activeSteps = dfsPreSteps;
    else if (mode === 'DFS Postorder')
        activeSteps = dfsPostSteps;
    const step = activeSteps[currentStepIndex] || activeSteps[0];
    const handleStart = () => {
        setCurrentStepIndex(0);
    };
    const handleNext = () => {
        setCurrentStepIndex(i => Math.min(i + 1, activeSteps.length - 1));
    };
    const handlePrev = () => {
        setCurrentStepIndex(i => Math.max(i - 1, 0));
    };
    return (_jsxs("div", { style: { width: '100vw', height: '100vh', position: 'relative' }, children: [_jsxs("div", { style: {
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    zIndex: 999,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: '10px',
                    borderRadius: '8px',
                }, children: [_jsxs("div", { style: { marginBottom: '10px' }, children: [_jsx("button", { onClick: () => setMode('BFS'), style: {
                                    padding: '8px 12px',
                                    marginRight: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: mode === 'BFS' ? '#555' : '#222',
                                    color: 'white',
                                }, children: "BFS" }), _jsx("button", { onClick: () => setMode('DFS Preorder'), style: {
                                    padding: '8px 12px',
                                    marginRight: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: mode === 'DFS Preorder' ? '#555' : '#222',
                                    color: 'white',
                                }, children: "DFS Preorder" }), _jsx("button", { onClick: () => setMode('DFS Postorder'), style: {
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    backgroundColor: mode === 'DFS Postorder' ? '#555' : '#222',
                                    color: 'white',
                                }, children: "DFS Postorder" })] }), _jsxs("div", { style: { marginBottom: '10px' }, children: [_jsx("button", { onClick: handleStart, style: { padding: '8px 12px', marginRight: '8px' }, children: "Start" }), _jsx("button", { onClick: handlePrev, style: { padding: '8px 12px', marginRight: '8px' }, children: "< Prev" }), _jsx("button", { onClick: handleNext, style: { padding: '8px 12px' }, children: "Next >" })] }), _jsxs("div", { style: { color: 'white' }, children: ["Step: ", currentStepIndex + 1, " / ", activeSteps.length] })] }), _jsxs(Canvas, { camera: { position: [0, 30, 50], fov: 60 }, style: { background: '#222' }, children: [_jsx("ambientLight", { intensity: 1 }), _jsx("directionalLight", { position: [10, 20, 10], intensity: 0.5 }), _jsx(OrbitControls, {}), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, -1, 0], children: [_jsx("planeGeometry", { args: [200, 200] }), _jsx("meshStandardMaterial", { color: "#333" })] }), [...step.edgesInTree].map((edgeKey, idx) => {
                        const [aStr, bStr] = edgeKey.split('-');
                        const a = parseInt(aStr, 10);
                        const b = parseInt(bStr, 10);
                        const nA = NODES.find(n => n.id === a);
                        const nB = NODES.find(n => n.id === b);
                        const points = [
                            [nA.x, 0, nA.z],
                            [nB.x, 0, nB.z],
                        ];
                        return (_jsx(Line, { points: points, color: "red", lineWidth: 2 }, idx));
                    }), NODES.map(n => {
                        const isVisited = step.visited.has(n.id);
                        return (_jsxs("mesh", { position: [n.x, 0, n.z], children: [_jsx("sphereGeometry", { args: [1.5, 16, 16] }), _jsx("meshStandardMaterial", { color: isVisited ? 'red' : 'gray' })] }, n.id));
                    })] })] }));
}
