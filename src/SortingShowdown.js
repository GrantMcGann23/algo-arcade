import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/// <reference types="@react-three/fiber" />
/// <reference types="@react-three/drei" />
import { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
/* ------------------ SORTING GENERATORS ------------------ */
// Bubble Sort
function* bubbleSortGenerator(array) {
    const arr = [...array];
    let swapped;
    for (let i = 0; i < arr.length - 1; i++) {
        swapped = false;
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                yield [...arr];
            }
        }
        if (!swapped)
            break;
    }
}
// Insertion Sort
function* insertionSortGenerator(array) {
    const arr = [...array];
    for (let i = 1; i < arr.length; i++) {
        let j = i;
        while (j > 0 && arr[j] < arr[j - 1]) {
            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
            yield [...arr];
            j--;
        }
    }
}
// Selection Sort
function* selectionSortGenerator(array) {
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
        let minIndex = i;
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            yield [...arr];
        }
    }
}
/* ------------------ UTILS ------------------ */
// Generate a random array of a given size
function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 50) + 5); // values between 5 and 55
    }
    return arr;
}
function Bar({ value, index, total, xOffset, isWinner = false }) {
    const spacing = 1.2;
    const xPos = index - total / 2 + 0.5 + xOffset;
    return (_jsxs("mesh", { position: [xPos * spacing, value / 2, 0], children: [_jsx("boxGeometry", { args: [1, value, 1] }), _jsx("meshStandardMaterial", { color: isWinner ? 'limegreen' : 'hotpink' })] }));
}
/* ------------------ MAIN COMPONENT ------------------ */
export default function SortingShowdown() {
    const ARRAY_SIZE = 15;
    // Three arrays, all starting with the same random values
    const [bubbleArray, setBubbleArray] = useState(() => {
        const initial = generateRandomArray(ARRAY_SIZE);
        return initial;
    });
    const [insertionArray, setInsertionArray] = useState(bubbleArray);
    const [selectionArray, setSelectionArray] = useState(bubbleArray);
    const [isSorting, setIsSorting] = useState(false);
    const [winner, setWinner] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    // Refs to hold each algorithm’s generator and intervals
    const bubbleGenRef = useRef(null);
    const insertionGenRef = useRef(null);
    const selectionGenRef = useRef(null);
    const sortingIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);
    /* ------------------ SHUFFLE ------------------ */
    const handleShuffle = () => {
        if (isSorting)
            return;
        const newArr = generateRandomArray(ARRAY_SIZE);
        setBubbleArray(newArr);
        setInsertionArray([...newArr]);
        setSelectionArray([...newArr]);
        setWinner(null);
        setElapsedTime(0);
    };
    /* ------------------ STOP ------------------ */
    const handleStop = () => {
        if (sortingIntervalRef.current)
            clearInterval(sortingIntervalRef.current);
        if (timerIntervalRef.current)
            clearInterval(timerIntervalRef.current);
        setIsSorting(false);
    };
    /* ------------------ START SORTING ------------------ */
    const handleStart = () => {
        if (isSorting)
            return;
        setIsSorting(true);
        setWinner(null);
        setElapsedTime(0);
        bubbleGenRef.current = bubbleSortGenerator(bubbleArray);
        insertionGenRef.current = insertionSortGenerator(insertionArray);
        selectionGenRef.current = selectionSortGenerator(selectionArray);
        // Start timer (update every 100ms)
        timerIntervalRef.current = setInterval(() => {
            setElapsedTime((prev) => prev + 0.1);
        }, 100);
        // Start sorting interval (every 200ms for better resolution)
        sortingIntervalRef.current = setInterval(() => {
            // We'll check each algorithm's progress
            let finishedAlgos = [];
            if (bubbleGenRef.current) {
                const bNext = bubbleGenRef.current.next();
                if (!bNext.done) {
                    setBubbleArray(bNext.value);
                }
                else {
                    finishedAlgos.push('Bubble');
                }
            }
            if (insertionGenRef.current) {
                const iNext = insertionGenRef.current.next();
                if (!iNext.done) {
                    setInsertionArray(iNext.value);
                }
                else {
                    finishedAlgos.push('Insertion');
                }
            }
            if (selectionGenRef.current) {
                const sNext = selectionGenRef.current.next();
                if (!sNext.done) {
                    setSelectionArray(sNext.value);
                }
                else {
                    finishedAlgos.push('Selection');
                }
            }
            // If any algorithm finished, determine winner if not already set
            if (finishedAlgos.length > 0 && !winner) {
                // If more than one finished on this tick, it's a tie
                if (finishedAlgos.length === 1) {
                    setWinner(finishedAlgos[0]);
                }
                else {
                    setWinner('Tie');
                }
                // Stop sorting and timer
                clearInterval(sortingIntervalRef.current);
                clearInterval(timerIntervalRef.current);
                setIsSorting(false);
            }
        }, 200);
    };
    return (_jsxs("div", { style: { width: '100vw', height: '100vh', position: 'relative' }, children: [_jsxs("div", { style: {
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 999,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '10px 15px',
                    borderRadius: '8px',
                }, children: [_jsx("button", { onClick: handleShuffle, style: { padding: '8px 12px', marginRight: '8px', cursor: 'pointer' }, children: "Shuffle" }), _jsx("button", { onClick: handleStart, style: { padding: '8px 12px', marginRight: '8px', cursor: 'pointer' }, children: "Start Sorting" }), _jsx("button", { onClick: handleStop, style: { padding: '8px 12px', cursor: 'pointer' }, children: "Stop" }), _jsxs("div", { style: { marginTop: '10px', color: 'white' }, children: ["Time: ", elapsedTime.toFixed(1), " sec"] }), winner && (_jsxs("div", { style: { marginTop: '10px', color: 'yellow', fontWeight: 'bold' }, children: ["Winner: ", winner] }))] }), _jsxs(Canvas, { camera: { position: [0, 40, 65], fov: 90 }, children: [_jsx(OrbitControls, { minDistance: 30, maxDistance: 150, enablePan: false, maxPolarAngle: Math.PI / 2 }), _jsx("ambientLight", { intensity: 0.3 }), _jsx("directionalLight", { position: [10, 15, 10], intensity: 1 }), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, 0, 0], children: [_jsx("planeGeometry", { args: [200, 200] }), _jsx("meshStandardMaterial", { color: "#ccc" })] }), bubbleArray.map((value, index) => (_jsx(Bar, { value: value, index: index, total: bubbleArray.length, xOffset: -20, isWinner: winner === 'Bubble' }, `bubble-${index}`))), _jsx(Text, { position: [-20 * 1.2, 0.5, 5], rotation: [-Math.PI / 2, 0, 0], fontSize: 2, color: winner === 'Bubble' ? 'limegreen' : 'black', children: "BUBBLE SORT" }), insertionArray.map((value, index) => (_jsx(Bar, { value: value, index: index, total: insertionArray.length, xOffset: 0, isWinner: winner === 'Insertion' }, `insertion-${index}`))), _jsx(Text, { position: [0, 0.5, 5], rotation: [-Math.PI / 2, 0, 0], fontSize: 2, color: winner === 'Insertion' ? 'limegreen' : 'black', children: "INSERTION SORT" }), selectionArray.map((value, index) => (_jsx(Bar, { value: value, index: index, total: selectionArray.length, xOffset: 20, isWinner: winner === 'Selection' }, `selection-${index}`))), _jsx(Text, { position: [20 * 1.2, 0.5, 5], rotation: [-Math.PI / 2, 0, 0], fontSize: 2, color: winner === 'Selection' ? 'limegreen' : 'black', children: "SELECTION SORT" })] })] }));
}
